import { doc, updateDoc, deleteField, Firestore } from "firebase/firestore";
import { useState, useEffect, ChangeEvent } from "react";
import { Session } from "~/types";
import { Intersect, Union } from "~/icons";

type GroupSelectProps = {
  session: Session,
  date: Date,
  db: Firestore,
  schoolId: string,
  groupList: string[],
}

const AdvancedSelect = ({
  session,
  date,
  db,
  schoolId,
  groupList,
  handleRestrict }: GroupSelectProps & { handleRestrict: any }) => {
  const [boolType, setBoolType] = useState(session.advanced_restriction_type ?? "OR");
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    Array.isArray(session.restricted_to) ? session.restricted_to :
      typeof session.restricted_to === "string" && session.restricted_to !== ""
        ? [session.restricted_to]
        : []
  );

  useEffect(() => {
    handleRestrict({ target: { value: selectedGroups } });
  }, [selectedGroups]);

  useEffect(() => {
    if (boolType !== session.advanced_restriction_type) {
      updateDoc(
        doc(
          db,
          `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`
        ),
        { advanced_restriction_type: boolType }
      );
    }
  }, [boolType]);

  const handleClickOption = (option: string) => {
    if (selectedGroups.includes(option)) {
      setSelectedGroups(selectedGroups.filter(o => o !== option));
    } else {
      setSelectedGroups([...selectedGroups, option]);
    }
  }

  return (<div className="flex flex-row w-full col-span-2 gap-2">
    <div className="col-span-2 mb-2 flex items-center gap-2 justify-between">
      <div className="join">
        <div className="tooltip" data-tip="Students in ANY of...">
          <button
            className={`btn join-item ${boolType === "OR" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setBoolType("OR")}
          >
            <Union color={boolType === "OR" ? "white" : "black"} />
          </button>
        </div>
        <div className="tooltip" data-tip="Students in ALL of...">
          <button
            className={`btn join-item ${boolType === "AND" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setBoolType("AND")}
          >
            <Intersect color={boolType === "AND" ? "white" : "black"} />
          </button>
        </div>
      </div>
    </div>
    <div className="dropdown flex-grow" style={{ zIndex: 1000000 }}>
      <div tabIndex={0} role="button" className="btn w-full">
        {selectedGroups.length === 0 ? "Select Groups" : ""}
        {selectedGroups.map(o => o.startsWith("%t-") ? o.split("-")[2] : o).join(", ")}
      </div>
      <div className="dropdown-content rounded-box max-h-96 overflow-y-auto">
        <div
          tabIndex={0}
          className="form-control menu bg-base-100 w-52 p-2 shadow"
        >
          {groupList.map((option, index) => {
            return (
              <label
                key={`${option}-${index}`}
                className="label justify-start gap-2"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  onChange={() => handleClickOption(option)}
                  checked={selectedGroups.includes(option)}
                />
                <span className="label-text">
                  {option.startsWith("%t-") ? `${option.split("-")[2]} (your group)` : option}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  </div>)
}


const GroupSelect = ({
  session,
  date,
  db,
  schoolId,
  groupList,
}: GroupSelectProps) => {
  const [isSimple, setIsSimple] = useState(
    !["OR", "AND"].includes(session.advanced_restriction_type as string)
  );

  useEffect(() => {
    if (isSimple && session.advanced_restriction_type) {
      console.log("deleting restrictions on", session)
      updateDoc(
        doc(
          db,
          `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`
        ),
        { advanced_restriction_type: deleteField(), restricted_to: deleteField() }
      );
    }
  }, [isSimple]);

  const handleRestrict = async (e: ChangeEvent<HTMLSelectElement>) => {
    const group = e.target?.value;

    updateDoc(
      doc(
        db,
        `schools/${schoolId}/sessions/${String(date.getFullYear())}/${String(date.toDateString())}/${session.id}`
      ),
      { restricted_to: group ?? "" }
    );
    session.restricted_to = group ?? "";
  }

  return (<>
    <div className="col-span-2 mb-1 flex items-center gap-2 justify-between">
      <span>Open to</span>
      <div className="join">
        <button
          className={`btn btn-xs join-item ${isSimple ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setIsSimple(true)}
        >Simple</button>
        <button
          className={`btn btn-xs join-item ${!isSimple ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setIsSimple(false)}
        >Advanced</button>
      </div>
    </div>

    {isSimple &&
      <select
        id={`group-select-${session.id}`}
        className="select select-bordered group-dropdown col-span-2"
        onChange={handleRestrict}
        value={session.restricted_to ?? ""}
      >
        <option value="">All Students</option>
        {groupList.map((option) => {
          return (
            <option
              value={option}
              key={`group-options-${option}-${Math.floor(Math.random() * 10000)}`}
            >
              {option.startsWith("%t-") ? `${option.split("-")[2]} (your group)` : option}
            </option>
          )
        })}
      </select>
    }

    {!isSimple &&
      <AdvancedSelect
        session={session}
        date={date}
        db={db}
        schoolId={schoolId}
        groupList={groupList}
        handleRestrict={handleRestrict}
      />
    }

  </>)
}

export default GroupSelect;

