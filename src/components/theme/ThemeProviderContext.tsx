import {createContext} from "react";

export type Theme = "dark" | "light" | "system"

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeProviderContext = createContext<ThemeProviderState>(
  {
    theme: "system",
    setTheme: () => { /* empty */
    }
  } as ThemeProviderState
)
