import { createContext } from "react";

const ThemeContext = createContext({
  theme: '',
  setTheme: (theme) => {}
})

export default ThemeContext