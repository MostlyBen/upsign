import { useState, useEffect } from "react";
import { Attendance } from "~/types";

const AttendanceFilter = ({
  onChange
}: { onChange: (val: Attendance[]) => void }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [p, setP] = useState<boolean>(true);
  const [t, setT] = useState<boolean>(true);
  const [a, setA] = useState<boolean>(true);
  const [arr, setArr] = useState<Attendance[]>(["present", "tardy", "absent"]);

  useEffect(() => {
    const _arr: Attendance[] = [];
    if (p) { _arr.push("present") }
    if (t) { _arr.push("tardy") }
    if (a) { _arr.push("absent") }
    onChange(_arr);
    setArr(_arr);
  }, [p, t, a]);

  useEffect(() => {
    if (!open) { return }
    const handleClick = (e: any) => {
      const container = document.getElementById('attendance-filter-container');
      if (!container || !container.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  return (
    <div className="relative w-fit" id="attendance-filter-container">
      <button
        className="btn btn-ghost capitalize mb-2"
        onClick={() => setOpen(!open)}
      >
        {(p && t && a) || (!p && !t && !a) ? "Showing All" : arr.join(", ")}
      </button>

      {open && <div
        className="card rounded-lg flex flex-col gap-4 bg-base-100 p-4 absolute z-30 shadow-lg"
        style={{ top: "50px" }}
      >
        <div className="flex flex-row gap-2 align-middle">
          <input
            id="present-toggle"
            type="checkbox"
            className="toggle toggle-success"
            checked={p}
            onChange={() => setP(!p)}
          />
          <label htmlFor="present-toggle">Present</label>
        </div>

        <div className="flex flex-row gap-2 align-middle">
          <input
            id="tardy-toggle"
            type="checkbox"
            className="toggle toggle-warning"
            checked={t}
            onChange={() => setT(!t)}
          />
          <label htmlFor="tardy-toggle">Tardy</label>
        </div>

        <div className="flex flex-row gap-2 align-middle">
          <input
            id="absent-toggle"
            type="checkbox"
            className="toggle toggle-error"
            checked={a}
            onChange={() => setA(!a)}
          />
          <label htmlFor="absent-toggle">Absent</label>
        </div>
      </div>
      }
    </div>
  )
}

export default AttendanceFilter;

