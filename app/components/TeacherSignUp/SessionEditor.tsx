import { useState, useEffect, useRef, useMemo, ChangeEvent } from "react";
import DebounceInput from '../SmallBits/DebounceInput';
import { Enrollment, Session } from "~/types";

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


import AttendanceList from './AttendanceList';
import { ChevronDown, ChevronRight, Trash } from "~/icons";
import { getSessionEnrollments, removeTeacherSession, updateSession } from "~/services";
import { getSchoolId } from "~/utils";

type SessionEditorProps = {
  db: Firestore,
  session: Session,
  date: Date,
  groupOptions: string[],
  isModal?: boolean,
  hasMultipleSessions?: boolean,
  enrollmentsFromParent?: Enrollment[]
}

const SessionEditor = ({
  db,
  session,
  date,
  groupOptions,
  hasMultipleSessions,
  isModal,
  enrollmentsFromParent
}: SessionEditorProps) => {

  const groupList = useRef(groupOptions.length ? groupOptions : []);

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
    if (enrollments.length !== session.number_enrolled) {
      updateSession(db, date, session.id, { number_enrolled: enrollments.length });
    }
  }, [enrollments]);

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
    setTitle(e.target.value);

    const title = String(e.target.value);
    updateDoc(doc(db, `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`), { title });
    session.title = title;
  }

  const handleChangeTeacher = (e: ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    if (!e) { return }
    setTeacher(e.target.value);

    const teacher = String(e.target.value);
    updateDoc(doc(db, `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`), { teacher });
    session.teacher = teacher;
  }

  const handleChangeSubtitle = (e: ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    if (!e) { return }
    setSubtitle(e.target.value);

    const subtitle = String(e.target.value);
    if (subtitle === "undefined") {
      updateDoc(doc(db, `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`), { subtitle: deleteField() });
    } else {
      updateDoc(doc(db, `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`), { subtitle });
      session.subtitle = subtitle;
    }
  }

  const handleChangeRoom = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e) { return }
    setRoom(e.target.value);

    const room = String(e.target.value);
    updateDoc(doc(db, `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`), { room });
    session.room = room;
  }

  const handleChangeCapacity = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e) { return }
    setCapacity(Number(e.target.value));

    const capacity = String(e.target.value);
    updateDoc(doc(db, `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`), { capacity: Number(capacity) });
    session.capacity = Number(capacity);
  }

  const GroupSelect = useMemo(() => {
    const handleRestrict = async (e: ChangeEvent<HTMLSelectElement>) => {
      const group = e.target.value;
      updateDoc(doc(db, `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`), { restricted_to: group });
      session.restricted_to = group;
    }

    return (
      <select
        id={`group-select-${session.id}`}
        className="select select-bordered group-dropdown col-span-2 m-2"
        onChange={handleRestrict}
        value={session.restricted_to}
      >
        <option value="">All Students</option>
        {groupList.current.map((option) => {
          return (
            <option
              value={option}
              key={`group-options-${option}-${Math.floor(Math.random() * 10000)}`}
            >{option}</option>
          )
        })}
      </select>
    )
  }, [db, date, schoolId, session.restricted_to])

  if (collapsed) {
    return (
      <div className="w-100 session-editor bg-base-100 card drop-shadow-md p-4 my-2">
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
      className={`relative${removing ? " opacity-30" : ""}`}
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
            if (window.confirm("Remove session?")) {
              setRemoving(true);
              removeTeacherSession(db, date, session.id);
            }
          }}
          style={{
            right: "-12px"
          }}
        >
          <Trash />
        </button>}
      <div className="session-editor bg-base-100 card drop-shadow-md p-4 my-4 grid grid-cols-2 gap-8">
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
            <DebounceInput
              className="block w-full m-2 input input-bordered text-lg font-bold"
              id={`session-title-${session.id}`}
              type="text"
              value={title}
              onChange={handleChangeTitle}
              autoComplete="off"
              placeholder="Session Title"
              debounceTimeout={1200}
              onBlur={handleBlurTitle}
            />
            <DebounceInput
              className="block w-full m-2 input input-bordered"
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

          {/* Teacher */}
          <DebounceInput
            className="col-span-2 ml-2 my-2 input h-auto w-full py-1 px-2 mb-0"
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
          <div className="m-2">

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
          <div className="m-2">
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
            />
          </div>

          {/* Restrict */}
          {GroupSelect}
        </div>

        {/* Student Enrollment */}
        <div className="col-span-2 md:col-span-1">
          <div className="session-student-list-card">
            <AttendanceList
              db={db}
              schoolId={schoolId}
              date={date}
              session={session}
              enrollmentsFromParent={enrollments}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionEditor
