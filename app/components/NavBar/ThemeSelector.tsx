import { useEffect, useState } from "react";

type Themes = "light" | "dark" | "nord" | "retro" | "thursday" | "valentine" | "verypink" | "nocturne";
const themes: Themes[] = ["light", "dark", "nocturne", "nord", "retro", "thursday", "valentine", "verypink"];

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
    <details className="dropdown">
      <summary tabIndex={0} role="button" className="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </summary>
      <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
        {themes.map(t =>
          <li key={`theme-${t}`}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
              aria-label={t.charAt(0).toUpperCase() + t.slice(1)}
              onClick={() => handleChangeTheme(t)}
              checked={theme === t}
              readOnly
              value={t} />
          </li>
        )}
      </ul>
    </details >
  )
}

export default ThemeSelector;

