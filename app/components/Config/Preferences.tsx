import { Firestore } from "firebase/firestore";
import { useState } from "react";

type PreferencesProps = {
  db: Firestore,
}

const Preferences = ({ db }: PreferencesProps) => {
  const [showMissing, setShowMissing] = useState<boolean>(localStorage.getItem("show-missing-students") === "true");
  const [advFilters, setAdvFilters] = useState<boolean>(false);

  const handleSwitchShowMissing = () => {
    localStorage.setItem("show-missing-students", String(!showMissing));
    setShowMissing(!showMissing);
  }

  return (
    <div className="prose">
      <h2>Experimental Features</h2>

      <div className="flex flex-row align-middle gap-4 mb-4"
        onClick={handleSwitchShowMissing}
      >
        <input
          className="toggle toggle-primary"
          type="checkbox"
          checked={showMissing}
          readOnly
        />
        <label className="relative" style={{ top: "-2px" }}>
          <b>All Sessions</b> / Show missing students
        </label>
      </div>

      <div className="flex flex-row align-middle gap-4 mb-4"
      >
        <input
          className="toggle toggle-primary disabled"
          type="checkbox"
          checked={advFilters}
          disabled
          readOnly
        />
        <label className="relative" style={{ top: "-2px" }}>
          <b>Session Editor</b> / Advanced filters (coming soon)
        </label>
      </div>

    </div>

  )
}

export default Preferences;

