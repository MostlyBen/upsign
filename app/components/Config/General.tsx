import { useState, useEffect } from "react";
import { Firestore } from "firebase/firestore";
import { Emoji } from "emoji-picker-react";
import { Add, Close } from "~/icons";
import { EmojiSelect } from "~/components";
import {
  getDefaultDay,
  getDefaultReactions,
  getSchoolName,
  getSignupAllowed,
  setDefaultDay,
  setDefaultReactions,
  setSchoolName,
  setSignupAllowed,
} from "~/services";
import { DefaultDayOption } from "~/types";

type GeneralProps = {
  db: Firestore,
}

type ReactionButtonProps = {
  reaction: string,
  onRemove: (arg0: string) => void,
}

const ReactionButton = ({ reaction, onRemove }: ReactionButtonProps) => {
  const [hovering, setHovering] = useState(false)

  return (
    <div
      className="not-prose"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      style={{ display: 'inline-block', margin: '0 6px', position: 'relative' }}
    >
      <Emoji key={reaction} unified={reaction} size={24} />
      <button
        className="bg-base-100 btn-circle btn-sm btn"
        style={{ position: 'absolute', right: '-4px', top: '-4px', opacity: hovering ? 1 : 0 }}
        onClick={() => onRemove(reaction)}
      ><Close /></button>
    </div>
  )
}

const General = ({ db }: GeneralProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [studentSign, setStudentSign] = useState<boolean>(true);
  const [defaultDayState, setDefaultDayState] = useState<string>('');
  const [schoolNameState, setSchoolNameState] = useState<string>('');
  const [defaultReactions, setDefaultReactionsState] = useState<string[]>([]);
  const [reactionsOpen, setReactionsOpen] = useState<boolean>(false);
  const [nameMatch, setNameMatch] = useState<boolean>(true);

  const updateSettings = async () => {
    const studentSignupSetting = await getSignupAllowed(db);
    const defaultDaySetting = await getDefaultDay(db, null, true);
    const schoolNameSetting = await getSchoolName(db);
    const _defaultReactions = await getDefaultReactions(db);

    setStudentSign(studentSignupSetting);
    setDefaultDayState(defaultDaySetting as string);
    setSchoolNameState(schoolNameSetting);
    setDefaultReactionsState(_defaultReactions);
    setLoading(false);
  }

  useEffect(() => {
    updateSettings();
  }, []);

  useEffect(() => {
    updateDropdown();
  }, [defaultDayState])

  const updateDropdown = () => {
    if (defaultDayState) {
      const elem = document.getElementById("default-day-select") as HTMLInputElement | null;
      if (elem !== null) {
        elem.value = defaultDayState;
      } else {
        setTimeout(updateDropdown, 15)
      }
    }
  }

  const checkNameMatch = (newValue: string) => {
    setNameMatch(newValue === schoolNameState)
  }

  const handleSwitchStudentSign = async () => {
    await setSignupAllowed(db, { active: !studentSign });
    setStudentSign(!studentSign);
  }

  const handleCancelNameInput = () => {
    const elem = document.getElementById("school-name-input") as HTMLInputElement | null;
    if (!elem) { return }
    elem.value = schoolNameState
    setNameMatch(true)
  }

  const handleSaveNameInput = () => {
    const elem = document.getElementById("school-name-input") as HTMLInputElement | null;
    if (!elem) { return }
    setSchoolName(db, elem.value);
    setSchoolNameState(elem.value);
    setNameMatch(true);
  }

  const handleChangeDefaultDay = async () => {
    const elem = document.getElementById("default-day-select") as HTMLInputElement | null;
    if (!elem) { return }
    const value = elem.value;
    setDefaultDay(db, value as DefaultDayOption);
    setDefaultDayState(value);
  }

  const handleAddReaction = async (reaction: string) => {
    const newReactions = [...defaultReactions, reaction];
    setDefaultReactionsState(newReactions);
    await setDefaultReactions(db, newReactions);
  }

  const handleRemoveReaction = async (reaction: string) => {
    const newReactions = defaultReactions.filter(r => r !== reaction);
    console.log("New reactions:", newReactions);
    setDefaultReactionsState(newReactions);
    await setDefaultReactions(db, newReactions);
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="menu-card prose">
      <h1>
        General Settings
      </h1>

      <hr className="my-2" />

      {loading
        ? <div>Loading...</div>
        : <div />
      }

      {/* Student SignUps */}
      <h2 className="mt-8">Student Sign-Ups</h2>
      <div className="switches">
        <div className="flex flex-row align-middle gap-4">
          <input
            className="toggle toggle-primary"
            type="checkbox"
            checked={!!studentSign}
            readOnly
            onClick={handleSwitchStudentSign}
          />
          <label className="relative" style={{ top: "-2px" }}>
            Students can sign up
          </label>
        </div>
      </div>

      {/* School Name */}
      <div>
        <h2 className="mt-8">School Name</h2>
        <div className="flex flex-row gap-2 w-full">
          <input
            className="input input-bordered grow"
            id="school-name-input"
            defaultValue={schoolNameState}
            type="text"
            autoComplete="off"
            onChange={(e) => checkNameMatch(e.target.value)}
          />
          <div
            className={`btn ${nameMatch ? 'btn-disabled' : ''}`}
            onClick={handleCancelNameInput}
          >
            Cancel
          </div>
          <div
            className={`btn ${nameMatch ? 'btn-disabled' : 'btn-primary'}`}
            onClick={handleSaveNameInput}
          >
            Save
          </div>
        </div>
        <div style={{ height: '1.5rem' }} />
      </div>

      {/* Default Day */}
      <div>
        <h2 className="mt-8">Default Day</h2>
        <div className="input-field col s12" style={{ marginTop: "10px" }}>
          <select className="select select-bordered w-full" id="default-day-select" onChange={handleChangeDefaultDay}>
            <option value="" disabled>Select Day</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            {/* Makeshift Divider */}
            {/* <option value="" style={{fontSize: "3pt", backgroundColor: "#fff"}} disabled>&nbsp;</option> */}
            <option value="" style={{ fontSize: "1pt", backgroundColor: "dimgrey" }} disabled>&nbsp;</option>
            {/* <option value="" style={{fontSize: "3pt", backgroundColor: "#fff"}} disabled>&nbsp;</option> */}

            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
          </select>
        </div>
      </div>

      {/* Reactions */}
      <div>
        <h2 className="mt-8">Reactions</h2>
        <div>
          {Array.isArray(defaultReactions) &&
            defaultReactions.map((reaction, i) =>
              <ReactionButton
                key={i}
                reaction={reaction}
                onRemove={handleRemoveReaction}
              />
            )}

          <button
            className="btn btn-ghost btn-sm m-0"
            onClick={() => setReactionsOpen(o => !o)}
            style={{ transform: "translateY(-8px)" }}
          >
            <span className="material-icons">{reactionsOpen ? 'close' : <Add />}</span>
          </button>
        </div>

        <EmojiSelect reactionsOpen={false} open={reactionsOpen} onSubmit={handleAddReaction} />
      </div>

      <div style={{ height: "3rem" }} />

    </div>
  )
}

export default General;

