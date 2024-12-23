import { doc, updateDoc, deleteField, Firestore } from "firebase/firestore";
import { ChangeEvent } from "react";
import { Session } from "~/types";

type GroupSelectProps = {
  session: Session,
  date: Date,
  db: Firestore,
  schoolId: string | null,
  groupList: string[],
}

const GroupSelect = ({
  session,
  date,
  db,
  schoolId,
  groupList,
}: GroupSelectProps) => {

  const handleRestrict = async (e: ChangeEvent<HTMLSelectElement>) => {
    const group = e.target.value;
    updateDoc(
      doc(
        db,
        `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`
      ),
      { restricted_to: group, advanced_restriction_type: deleteField() }
    );
    session.restricted_to = group;
  }

  return (<>
    <select
      id={`group-select-${session.id}`}
      className="select select-bordered group-dropdown col-span-2"
      onChange={handleRestrict}
      value={session.restricted_to}
    >
      <option value="">All Students</option>

      {typeof session.restricted_to === "string" && session.restricted_to.startsWith("%t") &&
        <option value={session.restricted_to}>{session.restricted_to.split("-")[2]}</option>
      }

      {Array.isArray(session.restricted_to) &&
        <option value={session.restricted_to}>{session.restricted_to.join(", ")}</option>
      }

      {groupList.map((option) => {
        return (
          <option
            value={option}
            key={`group-options-${option}-${Math.floor(Math.random() * 10000)}`}
          >
            {option.startsWith("%t-")
              ? `${option.split("-")[2]} (your group)`
              : option}
          </option>
        )
      })}
    </select>
  </>)
}

export default GroupSelect;

