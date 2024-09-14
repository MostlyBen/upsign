import { useEffect, useState } from "react";

const Sun = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path
        d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>

  )
}

const Moon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>

  )
}

type Themes = "light" | "dark"

const ThemeSelector = () => {
  const [windowDark, setWindowDark] = useState<boolean>(true);
  const [theme, setTheme] = useState<Themes>("dark");

  useEffect(() => {
    if (typeof window === 'undefined') { return }
    
    const _windowDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setWindowDark(_windowDark);

    if (window.localStorage.getItem("theme")) {
      setTheme(window.localStorage.getItem("theme") as Themes);
    } else {
      setTheme(_windowDark ? "dark" : "light" )
  }
  }, []);

  const handleChangeTheme = (t: Themes) => {
    window.localStorage.setItem("theme", t);
    setTheme(t);
  }

  return (
    <label className="flex cursor-pointer gap-2" suppressHydrationWarning>
      {windowDark ? <Moon /> : <Sun />}
      <input
        type="checkbox"
        value={windowDark ? "light" : "dark"}
        checked={theme === (windowDark ? "light" : "dark")
        }
        className="toggle theme-controller"
        onChange={() => handleChangeTheme(theme === "light" ? "dark" : "light")}
      />
      {windowDark ? <Sun /> : <Moon />}
    </label>
  )
}

export default ThemeSelector;

