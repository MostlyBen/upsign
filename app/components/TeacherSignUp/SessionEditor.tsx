// TODO: Show lock icon on this student list

import { useState, useEffect, useRef, ChangeEvent } from "react";
import DebounceInput from '../SmallBits/DebounceInput';
import { Enrollment, Session, UpsignUser } from "~/types";

import {
  Firestore,
  doc,
  updateDoc,
  query,
  collection,
  where,
  onSnapshot,
  deleteField
} from "@firebase/firestore";

import AddStudents from './AddStudents';
import AttendanceList from './AttendanceList';
import GroupSelect from './GroupSelect';
import GroupSelectAdvanced from './GroupSelectAdvanced';
import { ChevronDown, ChevronRight, Trash } from "~/icons";
import { getSessionEnrollments, removeTeacherSession } from "~/services";
import { getSchoolId } from "~/utils";

type SessionEditorProps = {
  db: Firestore,
  session: Session,
  user: UpsignUser,
  date: Date,
  groupOptions: string[],
  isModal?: boolean,
  index?: number,
  hasMultipleSessions?: boolean,
  enrollmentsFromParent?: Enrollment[]
  allStudents?: UpsignUser[]
}

const SessionEditor = ({
  db,
  session,
  user,
  date,
  groupOptions,
  hasMultipleSessions,
  isModal,
  index,
  enrollmentsFromParent,
  allStudents,
}: SessionEditorProps) => {

  const groupList = useRef(groupOptions.length ? groupOptions : []);
  const advancedGroupSelect = typeof window !== "undefined" && localStorage.getItem("advanced-group-select") === "true";

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [hasClicked, setHasClicked] = useState<boolean>(false);
  const [removing, setRemoving] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [title, setTitle] = useState(session.title ?? "");
  const [savedTitle, setSavedTitle] = useState(session.title ?? "");
  const [teacher, setTeacher] = useState(session.teacher ?? "");
  const [savedTeacher, setSavedTeacher] = useState(session.teacher ?? "");
  const [subtitle, setSubtitle] = useState(session.subtitle ?? "");
  const [savedSubtitle, setSavedSubtitle] = useState(session.subtitle ?? "");
  const [room, setRoom] = useState(session.room ?? "");
  const [capacity, setCapacity] = useState(session.capacity ?? 0);
  const [showOptions, setShowOptions] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(enrollmentsFromParent ?? []);

  const schoolId = getSchoolId();

  const loadEnrollments = async (db: Firestore) => {
    if (enrollmentsFromParent) { return }
    if (!session.id) { return }

    const sessionEnrollments = await getSessionEnrollments(db, date, session.id) as Enrollment[];
    if (!Array.isArray(sessionEnrollments)) { return }

    setEnrollments(sessionEnrollments.sort((a, b) => {
      return ((a.nickname ?? a.name) > (b.nickname ?? b.name) ? 1 : -1);
    }));
  }

  useEffect(() => {
    if (enrollmentsFromParent) { return }

    setEnrollments([]);
    // Set up snapshot & load sessions
    const eQuery = query(
      collection(
        db,
        `schools/${schoolId}/sessions/${String(date.getFullYear())}/${date.toDateString()}-enrollments`
      ),
      where("session_id", "==", session.id)
    );
    const unsubscribe = onSnapshot(eQuery, () => {
      loadEnrollments(db);
    })

    return () => unsubscribe();

  }, [db]);

  useEffect(() => {
    const titleEl = document.getElementById(`session-title-${session.id}`);
    const isActive = (titleEl === document.activeElement);

    if (!isActive) {
      setTitle(savedTitle);
    }
  }, [savedTitle, session.id])

  useEffect(() => {
    const groupSelect: HTMLSelectElement | null = document.getElementById(`group-select-${session.id}`) as HTMLSelectElement;
    if (!groupSelect) { return }
    const group = Array.isArray(session.restricted_to) ? session.restricted_to.join(', ') : session.restricted_to;

    if (session.restricted_to) {
      groupSelect.value = group as string;
    } else if (session.restricted_to === "") {
      // If not restricted to anything yet, show All Students
      groupSelect.value = "";
    }
  }, [session.id, session.restricted_to]);


  /* SUBSCRIBE TO UPDATES FROM FIRESTORE */
  useEffect(() => {
    // Set up snapshot & load sessions
    if (session.id) {
      const q = query(collection(db, `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}`), where("id", "==", session.id));
      const unsubscribe = onSnapshot(q, querySnapshot => {
        querySnapshot.forEach(d => {
          const updatedSession = d.data();

          setSavedTitle(updatedSession.title ?? '');
          setSavedSubtitle(updatedSession.subtitle ?? '');
          setSavedTeacher(updatedSession.teacher ?? '');
          setRoom(updatedSession.room ?? '');
          setCapacity(updatedSession.capacity ?? 30);
          session.restricted_to = updatedSession.restricted_to;
        });
      });

      return () => unsubscribe();
    }
  }, [db, session]);

  useEffect(() => {
    if (Array.isArray(enrollmentsFromParent)) {
      setEnrollments([...enrollmentsFromParent]);
    }
  }, [enrollmentsFromParent]);

  useEffect(() => {
    if (hasClicked) {
      document.addEventListener("mousedown", () => { setIsHovering(false); setHasClicked(false) });
    }
    return () => document.removeEventListener("mousedown", () => { setIsHovering(false); setHasClicked(false) });
  }, [hasClicked]);


  /* BUTTON HANDLERS */
  const clickOffListener = (e: MouseEvent) => {
    if (!e.target) { return }
    const target = e.target as HTMLElement;

    if (!target.classList.contains('more-btn-clickbox') && showOptions) {
      setShowOptions(false);
    }
  }

  window.addEventListener('click', clickOffListener)

  /* BLUR HANDLERS */
  const handleBlurTitle = () => {
    if (savedTitle !== title) {
      handleChangeTitle({ target: { value: session.title as string } });
    }
  }
  const handleBlurSubtitle = () => {
    if (savedSubtitle !== session.subtitle) {
      handleChangeSubtitle({ target: { value: session.subtitle as string } });
    }
  }
  const handleBlurTeacher = () => {
    if (savedTeacher !== session.teacher) {
      handleChangeTeacher({ target: { value: session.teacher as string } })
    }
  }


  /* CHANGE HANDLERS */
  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    if (!e) { return }
    setTitle(e.target.value ?? "");

    const title = String(e.target.value);
    updateDoc(
      doc(
        db,
        `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`
      ),
      { title }
    );
    session.title = title;
  }

  const handleChangeTeacher = (e: ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    if (!e) { return }
    setTeacher(e.target.value ?? "");

    const teacher = String(e.target.value);
    updateDoc(
      doc(
        db,
        `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`
      ),
      { teacher }
    );
    session.teacher = teacher;
  }

  const handleChangeSubtitle = (e: ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    if (!e) { return }
    setSubtitle(e.target.value ?? "");

    const subtitle = String(e.target.value);
    if (subtitle === "undefined") {
      updateDoc(
        doc(
          db,
          `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`
        ),
        { subtitle: deleteField() }
      );
    } else {
      updateDoc(
        doc(
          db,
          `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`
        ),
        { subtitle }
      );
      session.subtitle = subtitle;
    }
  }

  const handleChangeRoom = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e) { return }
    setRoom(e.target.value ?? "");

    const room = String(e.target.value);
    updateDoc(
      doc(
        db,
        `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`
      ),
      { room }
    );
    session.room = room;
  }

  const handleChangeCapacity = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e) { return }
    setCapacity(Number(e.target.value));

    const capacity = String(e.target.value);
    updateDoc(
      doc(
        db,
        `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`
      ),
      { capacity: Number(capacity) }
    );
    session.capacity = Number(capacity);
  }

  if (collapsed) {
    return (
      <div
        className="w-100 shadow-md bg-base-100 card p-4 my-2"
        style={{
          borderRadius: "var(--rounded-btn, 0.5rem)",
          zIndex: index,
        }}
      >
        <button
          className="absolute btn btn-ghost p-1 h-full collapse-btn-offset"
          onClick={() => setCollapsed(false)}
        >
          <ChevronRight />
        </button>

        <h1 className={`text-lg${session.title && session.title.length ? " font-semibold" : " font-light"}`}>
          {session.title && session.title.length ? session.title : "Empty Session"}
        </h1>
      </div>
    )
  }

  return (
    <div
      className={`${removing ? " opacity-30" : ""}`}
      onClick={(e) => {
        if (!(e.target instanceof HTMLElement)) { return }
        if (!['BUTTON', 'INPUT', 'IMG', 'path', 'svg'].includes(e.target?.nodeName)) {
          setIsHovering(true);
          setHasClicked(true);
        }
      }}
      onPointerEnter={() => { setIsHovering(true) }}
      onPointerLeave={() => {
        if (!hasClicked) { setIsHovering(false) }
      }}
    >
      {!isModal && isHovering && hasMultipleSessions && !removing &&
        <button
          className="btn btn-circle bg-base-100 text-error absolute top-0 z-40 print:hidden"
          onPointerDown={() => {
            if (!session.id) { return }
            if (window.confirm("Remove session?")) {
              setRemoving(true);
              removeTeacherSession(db, date, session.id);
            }
          }}
          style={{
            right: "-12px",
            zIndex: index ? index + 1 : undefined,
          }}
        >
          <Trash />
        </button>}
      <div
        className="session-editor bg-base-100 card shadow-md p-4 my-4 grid grid-cols-2 gap-4"
        style={{
          borderRadius: "var(--rounded-btn, 0.5rem)",
          zIndex: index,
        }}
      >
        {!isModal && <button
          className="absolute btn btn-ghost p-1 h-full collapse-btn-offset print:hidden"
          onClick={() => setCollapsed(true)}
        >
          <ChevronDown />
        </button>}


        {/* Session Info */}
        <div className="grid grid-cols-2 col-span-2 md:col-span-1 h-fit">
          <div className="block col-span-2">
            {/* Title */}
            <div className="mb-2">
              <DebounceInput
                className="block w-full input input-bordered text-lg font-bold"
                id={`session-title-${session.id}`}
                type="text"
                value={title}
                onChange={handleChangeTitle}
                autoComplete="off"
                placeholder="Session Title"
                debounceTimeout={1200}
                onBlur={handleBlurTitle}
              />
            </div>
            <div className="mb-2">
              <DebounceInput
                className="block w-full input input-bordered"
                id={`session-subtitle-${session.id}`}
                type="text"
                value={subtitle}
                onChange={handleChangeSubtitle}
                autoComplete="off"
                placeholder="Subtitle"
                debounceTimeout={1200}
                onBlur={handleBlurSubtitle}
                style={{ marginBottom: '0', height: '2.5rem' }}
              />
            </div>
          </div>

          {/* Teacher */}
          <DebounceInput
            className="col-span-2 mb-2 input h-auto w-full py-1 px-2"
            id={`session-teacher-${session.id}`}
            type="text"
            value={teacher}
            onChange={handleChangeTeacher}
            autoComplete="off"
            placeholder="Teacher"
            debounceTimeout={1200}
            onBlur={handleBlurTeacher}
          />

          {/* Room */}
          <div className="mb-2 mr-2">

            <label htmlFor={`session-title-${session.id}`}>Room</label>
            <DebounceInput
              className="mimic-card-h2 remove-border input input-bordered w-full"
              id={`session-room-${session.id}`}
              type="text"
              value={room}
              onChange={handleChangeRoom}
              autoComplete="off"
              debounceTimeout={1200}
              placeholder="No Room"
            />
          </div>

          {/* Capacity */}
          <div className="mb-2 ml-2">
            <label htmlFor={`session-title-${session.id}`}>Capacity</label>
            <DebounceInput
              className="mimic-card-h2 remove-border input input-bordered w-full"
              id={`session-capacity-${session.id}`}
              type="number"
              value={capacity}
              onChange={handleChangeCapacity}
              autoComplete="off"
              debounceTimeout={1200}
              placeholder="Capacity"
              min={0}
            />
          </div>

          {/* Restrict */}
          {schoolId && Array.isArray(groupList.current) &&
            advancedGroupSelect
            ? <GroupSelectAdvanced
              session={session}
              date={date}
              db={db}
              schoolId={schoolId}
              groupList={groupList.current}
            />
            : <GroupSelect
              session={session}
              date={date}
              db={db}
              schoolId={schoolId}
              groupList={groupList.current}
            />
          }
        </div>

        {/* Student Enrollment */}
        <div className="col-span-2 md:col-span-1 relative">
          <div className="session-student-list-card">
            <AttendanceList
              db={db}
              user={user}
              schoolId={schoolId}
              date={date}
              session={session}
              enrollmentsFromParent={enrollments}
            />
            {Array.isArray(allStudents) &&
              <AddStudents
                db={db}
                session={session}
                user={user}
                date={date}
                groupOptions={groupOptions}
                allStudents={allStudents}
              />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionEditor;

