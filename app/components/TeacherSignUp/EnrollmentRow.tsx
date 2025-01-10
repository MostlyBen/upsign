import { useState, useEffect } from "react";
import { Emoji } from "emoji-picker-react";
import { Firestore } from "@firebase/firestore";
import {
  getDefaultReactions,
  unenrollFromSession,
  updateEnrollment,
} from "../../services";
import { EmojiSelect } from "~/components";
import { Close, FaceSmile } from "~/icons";
import { Session, Enrollment, Attendance, UpsignUser } from "~/types";


interface EnrollmentRowProps {
  db: Firestore,
  user: UpsignUser,
  session: Session,
  enrollment: Enrollment,
  date: Date,
}

const EnrollmentRow = ({ db, user, session, enrollment, date }: EnrollmentRowProps) => {
  const [showRemove, setShowRemove] = useState<0 | 1>(0);
  const [reactionOpen, setReactionOpen] = useState<boolean>(false);
  const [reactions, setReactions] = useState<string[] | undefined>();

  // Update the reactions list
  useEffect(() => {
    const updateReactions = async () => {
      const _reactions = await getDefaultReactions(db);
      setReactions(_reactions);
    }
    updateReactions();
  }, [db]);

  const handleMouseEnter = () => {
    setShowRemove(1);
  }

  const handleMouseLeave = () => {
    if (reactionOpen) { return }
    setShowRemove(0);
  }

  const handleClickEmoji = (emoji: string) => {
    handleMouseLeave()
    if (!enrollment.id) { return }

    updateEnrollment(db, date, enrollment.id, {
      flag: emoji
    })
  }

  const handleRemoveFlag = () => {
    if (!enrollment.id) { return }

    updateEnrollment(db, date, enrollment.id, {
      flag: null
    })
  }

  const handleRemoveStudent = (uid: string | undefined, name: string) => {
    if (!uid) {
      console.error("Tried to remove", name, "from a session, but do not know their ID");
    }

    if (window.confirm(`Are you sure you want to remove ${name} from this session?`)) {
      if (!session.id) { return }
      unenrollFromSession(db, date, String(uid), session.id)
    }
  }

  const removeDim = () => {
    const elem = document.getElementById(`enrollment-row-${session.id}-${enrollment.uid}`);
    if (elem) {
      elem.classList.remove('dim');
    }
  }

  const handleCheck = (value: Attendance) => {
    if (!enrollment.id) { return }

    const _value = (value === enrollment.attendance ? '' : value);
    // Dim the row (to be lightened on update from firestore)
    const elem = document.getElementById(`enrollment-row-${session.id}-${enrollment.uid}`);
    if (elem) {
      elem.classList.add('dim');
    }

    updateEnrollment(db, date, enrollment.id, {
      attendance: _value,
    }, user).then(removeDim).catch(removeDim);
  }

  return (
    <tr
      className="hover"
      id={`enrollment-row-${session.id}-${enrollment.uid}`}
      key={`${enrollment.uid}-${session.id}`}
      onMouseOver={handleMouseEnter}
      onMouseOut={handleMouseLeave}
    >
      <td
        className="enrollment-name-cell"
        style={{ padding: "0 0 0 1.5rem", textAlign: "left" }}
      >
        <span className="mr-1">{enrollment.nickname ?? enrollment.name}</span>

        <EmojiSelect
          open={reactionOpen}
          onSubmit={handleClickEmoji}
          reactions={reactions}
          onClose={() => setReactionOpen(false)}
        />

        {enrollment.flag
          ? <button className="mr-1" onClick={() => handleRemoveFlag()} style={{ transform: "translateY(2px)" }}>
            <Emoji unified={enrollment.flag ?? "1f389"} size={16} />
          </button>
          : <button
            onClick={() => setReactionOpen(o => !o)}
            style={{
              opacity: showRemove,
              userSelect: 'none',
            }}
          >
            <FaceSmile />
          </button>
        }

        <button
          className="mr-1"
          onClick={() => handleRemoveStudent(enrollment.uid, enrollment.name)}
          style={{
            opacity: showRemove,
            userSelect: 'none'
          }}
        >
          <Close />
        </button>
      </td>

      {/* Present */}
      <td>
        <div
          className="flex align-middle justify-center"
        >
          <label style={{ lineHeight: "0", textAlign: "center" }}>
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              id={`present-check-${enrollment.uid}`}
              checked={enrollment.attendance === "present"}
              onChange={() => handleCheck("present")}
            />
          </label>
        </div>
      </td>

      {/* Tardy */}
      <td>
        <div
          className="flex align-middle justify-center"
        >
          <label style={{ lineHeight: "0" }}>
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              id={`tardy-check-${enrollment.uid}`}
              checked={enrollment.attendance === "tardy"}
              onChange={() => handleCheck("tardy")}
            />
          </label>
        </div>
      </td>

      {/* Absent */}
      <td>
        <div
          className="flex align-middle justify-center"
        >        <label style={{ lineHeight: "0" }}>
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              id={`absent-check-${enrollment.uid}`}
              checked={enrollment.attendance === "absent"}
              onChange={() => handleCheck("absent")}
            />
          </label>
        </div>

      </td>

    </tr>
  )
}

export default EnrollmentRow;

