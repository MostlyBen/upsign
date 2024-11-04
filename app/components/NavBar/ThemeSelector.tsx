import { useEffect, useState } from "react";

type Themes = "light" | "dark" | "nord" | "retro" | "valentine";

const ThemeSelector = () => {
  const [theme, setTheme] = useState<Themes>("dark");

  useEffect(() => {
    if (typeof window === 'undefined') { return }

    const windowDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (window.localStorage.getItem("theme")) {
      setTheme(window.localStorage.getItem("theme") as Themes);
    } else {
      setTheme(windowDark ? "dark" : "light")
    }
  }, []);

  const handleChangeTheme = (t: Themes) => {
    window.localStorage.setItem("theme", t);
    setTheme(t);
  }

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </div>
      <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Light"
            onClick={() => handleChangeTheme("light")}
            checked={theme === "light"}
            value="light" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Dark"
            onClick={() => handleChangeTheme("dark")}
            checked={theme === "dark"}
            value="dark" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Nord"
            onClick={() => handleChangeTheme("nord")}
            checked={theme === "nord"}
            value="nord" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Retro"
            onClick={() => handleChangeTheme("retro")}
            checked={theme === "retro"}
            value="retro" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Valentine"
            onClick={() => handleChangeTheme("valentine")}
            checked={theme === "valentine"}
            value="valentine" />
        </li>
      </ul>
    </div >
  )
}

export default ThemeSelector;

