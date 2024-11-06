import { useState } from "react";

type FeatureSwitchProps = {
  category: string,
  title: string,
  id?: string,
}

const features: FeatureSwitchProps[] = [
  { category: "All Sessions", title: "Show missing students", id: "show-missing-students" },
  { category: "Home", title: "Show other teacher's schedule", id: "show-other-schedule" },
  { category: "Session Editor", title: "Advanced filters", id: "advanced-group-select" },
]

const FeatureSwitch = ({ category, title, id }: FeatureSwitchProps) => {
  const [checked, setChecked] =
    useState<boolean>(id ? localStorage.getItem(id) === "true" : false);

  const handleChange = () => {
    if (!id) { return }
    if (checked) {
      localStorage.removeItem(id);
    } else {
      localStorage.setItem(id, "true");
    }
    setChecked(!checked);
  }

  return (
    <div className="flex flex-row align-middle gap-4 mb-4"
      onClick={handleChange}
    >
      <input
        className="toggle toggle-primary"
        type="checkbox"
        checked={checked}
        readOnly
        disabled={typeof id === "undefined"}
      />
      <label className="relative" style={{ top: "-2px" }}>
        <b>{category}</b> / {title}
      </label>
    </div>
  )
}

const Preferences = () => {

  return (
    <div className="prose">
      <h2>Experimental Features</h2>
      {features.map(f => <FeatureSwitch key={f.id} {...f} />)}
    </div>

  )
}

export default Preferences;

