import { useState, useEffect } from "react";

const AttendanceFilter = ({ selected, setSelected, style }) => {
  const [open, setOpen] = useState(false);

  const areAllSelected = (selected) => {
    if (!Array.isArray(selected)) { return true }
    return selected.length === 3 || selected.length === 0;
  }

  useEffect(() => {
    const clickOffListener = (e) => {
      if (e.target.id === "attendance-filter-btn") { return }
      if ( !document.getElementById('attendance-filter-clickbox').contains(e.target) && open) {
        setOpen(false)
      }
    }

    window.addEventListener('click', clickOffListener)

    return (() => {
      window.removeEventListener('click', clickOffListener)
    })
  }, [open])

  const handleUpdateSelected = (option) => {
    let _selected = selected;
    if (!Array.isArray(_selected)) {
      _selected = [ option ]
    }

    if (selected.includes(option)) {
      _selected = selected.filter(o => o !== option)
    } else {
      _selected.push(option)
    }
    setSelected([..._selected])
  }

  return (<>
    <button
      id="attendance-filter-btn"
      className="btn btn-flat text-on-background attendance-filter-btn"
      onClick={() => setOpen(o => !o)}
      style={
        typeof style === "object"
        ? { ...style }
        : {}
      }
    >
      { areAllSelected(selected) ? "Showing All" : selected.join(", ") }
    </button>
    {open &&
      <div
        id="attendance-filter-clickbox"
        style={{
          position: "relative",
          top: "0",
          left: "0",
        }}
      >
        <div
          className="floating-menu scale-transition scale-in"
          style={{
            position: "absolute",
            top: 0,
            left: "12px",
          }}
        >
          <div>
            <div
              className="switch toggle-switch"
              style={{
                paddingRight: '16px',
                margin: '4px 0px',
              }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes("present")}
                  onChange={() => {
                    handleUpdateSelected("present")
                  }}
                />
                <span className="lever"></span>
              </label>
              Present
            </div>
            <div
              className="switch toggle-switch"
              style={{
                paddingRight: '16px',
                margin: '4px 0px',
              }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes("tardy")}
                  onChange={() => {
                    handleUpdateSelected("tardy")
                  }}
                />
                <span className="lever"></span>
              </label>
              Tardy
            </div>
            <div
              className="switch toggle-switch"
              style={{
                paddingRight: '16px',
                margin: '4px 0px',
              }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes("absent")}
                  onChange={() => {
                    handleUpdateSelected("absent")
                  }}
                />
                <span className="lever"></span>
              </label>
              Absent
            </div>
          </div>
      </div>
     </div>
    }
  </>)
}

export default AttendanceFilter
