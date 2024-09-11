import { useState, useEffect, useRef, useMemo } from "react"
import { useLoaderData } from "react-router-dom"
import { DebounceInput } from 'react-debounce-input'

import {
  doc,
  updateDoc,
  query,
  collection,
  where,
  onSnapshot,
  deleteField
 } from "@firebase/firestore"


import { SessionAttendanceList, SessionOptions } from '../'

import { getSchoolId } from "../../utils"

const SessionEditor = ({ db, session, date, user, groupOptions=[], hideOptions, hideRemove }) => {
  const loaderData = useLoaderData()
  let groupList = useRef(groupOptions.length ? groupOptions : loaderData.groupOptions)

  const [title, setTitle] = useState(session.title ?? "")
  const [savedTitle, setSavedTitle] = useState(session.title ?? "")
  const [teacher, setTeacher] = useState(session.teacher ?? "")
  const [savedTeacher, setSavedTeacher] = useState(session.teacher ?? "")
  const [subtitle, setSubtitle] = useState(session.subtitle ?? "")
  const [savedSubtitle, setSavedSubtitle] = useState(session.subtitle ?? "")
  const [room, setRoom] = useState(session.room ?? "")
  const [capacity, setCapacity] = useState(session.capacity ?? 0)
  const [showOptions, setShowOptions] = useState(false)

  const schoolId = getSchoolId()

  useEffect(() => {
    var titleEl = document.getElementById(`session-title-${session.id}`)
    var isActive = (titleEl === document.activeElement)

    if (!isActive) {
      setTitle(savedTitle)
    }
  }, [savedTitle, session.id])

  useEffect(() => {
    if (session.restricted_to) {
      document.getElementById(`group-select-${session.id}`).value = session.restricted_to
    } else if (session.restricted_to === "") {
      // If not restricted to anything yet, show All Students
      document.getElementById(`group-select-${session.id}`).value = ""
    }
  }, [session.id, session.restricted_to])


  /* SUBSCRIBE TO UPDATES FROM FIRESTORE */
  useEffect(() => {
    // Set up snapshot & load sessions
    if (session.id) {
      const q = query(collection(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString())), where("id", "==", session.id));
      const unsubscribe = onSnapshot(q, querySnapshot => {
        querySnapshot.forEach( d => {
          var updatedSession = d.data();

          setSavedTitle(updatedSession.title ?? '');
          setSavedSubtitle(updatedSession.subtitle ?? '');
          setSavedTeacher(updatedSession.teacher ?? '');
          setRoom(updatedSession.room ?? '');
          setCapacity(updatedSession.capacity ?? 30);
          session.restricted_to = updatedSession.restricted_to;
        })
      })

      return () => unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, session])

  /* BUTTON HANDLERS */
  const clickOffListener = (e) => {
    if ( !e.target.classList.contains('more-btn-clickbox') && showOptions ) {
      setShowOptions(false)
    }
  }

  window.addEventListener('click', clickOffListener)

  const handleClickOptions = () => {
    setShowOptions(true)
  }


  /* BLUR HANDLERS */
  const handleBlurTitle = () => {
    if (savedTitle !== title) {
      handleChangeTitle({target:{value:session.title}});
    }
  }
  const handleBlurSubtitle = () => {
    if (savedSubtitle !== session.subtitle) {
      handleChangeSubtitle({target:{value:session.subtitle}});
    }
  }
  const handleBlurTeacher = () => {
    if (savedTeacher !== session.teacher) {
      handleChangeTeacher({target:{value:session.teacher}})
    }
  }


  /* CHANGE HANDLERS */
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
    
    var title = String(e.target.value);
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {title: title});
    session.title = title;
  }

  const handleChangeTeacher = (e) => {
    setTeacher(e.target.value);

    var teacher = String(e.target.value);
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {teacher: teacher});
    session.teacher = teacher;
  }

  const handleChangeSubtitle = (e) => {
    setSubtitle(e.target.value);

    var subtitle = String(e.target.value);
    if (subtitle === "undefined") {
      updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {subtitle: deleteField()});
    } else {
      updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {subtitle: subtitle});
      session.subtitle = subtitle;
    }

  }

  const handleChangeRoom = (e) => {
    setRoom(e.target.value);

    var room = String(e.target.value);
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {room: room});
    session.room = room;
  }

  const handleChangeCapacity = (e) => {
    setCapacity(Number(e.target.value));

    var capacity = Number(e.target.value);
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {capacity: capacity});
    session.capacity = capacity;
  }

  const GroupSelect = useMemo(() => {
    const handleRestrict = async (e) => {
      const group = e.target.value;
      updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {restricted_to: group});
      session.restricted_to = group;
    }

    return (
      <select
            id={`group-select-${session.id}`}
            className='btn group-dropdown'
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, date, schoolId, session.restricted_to])

  return (
    <div className="session-editor">
      {/* Options Button & Menu */}
      {!hideOptions && <>
        <button className="session-more-btn btn btn-floating btn-flat more-btn-clickbox" onClick={handleClickOptions}>
          <i className="material-icons session-more-btn-icon more-btn-clickbox">more_vert</i>
        </button>
        <SessionOptions
          db={db}
          date={date}
          session={session.session}
          sessionId={session.id}
          show={showOptions}
          user={user}
          hideRemove={hideRemove}
        />
      </>}

      {/* Session Info */}
      <div className="col s12 m6">
        <div className="teacher-card-h1">
          Session Info
        </div>

        <div className="col s12">
          {/* Title */}
          <DebounceInput
            className="mimic-card-h1"
            id={`session-title-${session.id}`}
            type="text"
            value={title}
            onChange={handleChangeTitle}
            autoComplete="off"
            placeholder="Session Title"
            minLength={0}
            debounceTimeout={1200}
            onBlur={handleBlurTitle}
          />
          <DebounceInput
            className="mimic-card-h2"
            id={`session-subtitle-${session.id}`}
            type="text"
            value={subtitle}
            onChange={handleChangeSubtitle}
            autoComplete="off"
            placeholder="Subtitle"
            minLength={0}
            debounceTimeout={1200}
            onBlur={handleBlurSubtitle}
            style={{marginBottom: '0', height: '2.5rem'}}
          />
        </div>

        {/* Teacher */}
        <div className="col s12">
          <DebounceInput
            className="mimic-card-h2"
            id={`session-teacher-${session.id}`}
            type="text"
            value={teacher}
            onChange={handleChangeTeacher}
            autoComplete="off"
            placeholder="Teacher"
            minLength={0}
            debounceTimeout={1200}
            onBlur={handleBlurTeacher}
            style={{margin: '0 0 12px 0', height: 'auto', padding: '4px 0'}}
          />
        </div>

        {/* Room */}
        <div className="col s6">

          <label htmlFor={`session-title-${session.id}`}>Room</label>
          <DebounceInput
            className="mimic-card-h2 remove-border"
            id={`session-room-${session.id}`}
            type="text"
            value={room}
            onChange={handleChangeRoom}
            autoComplete="off"
            minLength={0}
            debounceTimeout={1200}
            placeholder="No Room"
          />
        </div>

        {/* Capacity */}
        <div className="col s6">
          <label htmlFor={`session-title-${session.id}`}>Capacity</label>
            <DebounceInput
              className="mimic-card-h2 remove-border"
              id={`session-capacity-${session.id}`}
              type="number"
              value={capacity}
              onChange={handleChangeCapacity}
              autoComplete="off"
              minLength={0}
              debounceTimeout={1200}
              placeholder="Capacity"
            />
          </div>

          {/* Restrict */}
          {GroupSelect}
        </div>

      {/* Student Enrollment */}
      <div className="col s12 m6">
        <div className="session-student-list-card">
          <div className="teacher-card-h1">
            Student List
          </div>
          <SessionAttendanceList db={db} schoolId={schoolId} date={date} session={session} />
        </div>
      </div>
    </div>
  )
}

export default SessionEditor