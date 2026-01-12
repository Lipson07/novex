import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ThemeName } from "../assets/LeftPanel/themes";

interface ThemeState {
  currentTheme: ThemeName | "";
}

// Инициализация из localStorage для сохранения темы между сессиями
const getInitialTheme = (): ThemeName | "" => {
  if (typeof window === "undefined") return "";
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      // Проверяем, что сохраненная тема есть в списке доступных
      const themeNames = [
        "dark-plus",
        "light-plus",
        "monokai",
        "solarized-dark",
        "dracula",
        "github-dark",
        "github-light",
        "one-dark-pro",
        "material-theme-darker",
        "night-owl",
        "palenight",
        "synthwave-84",
        "tokyo-night",
        "catppuccin-mocha",
        "ayu-dark",
        "cobalt2",
        "gruvbox-dark",
        "horizon",
        "nord",
        "red",
        "abyss",
        "quietlight",
        "kimbie-dark",
        "solarized-light",
      ] as const;
      if (themeNames.includes(savedTheme as ThemeName)) {
        return savedTheme as ThemeName;
      }
    }
  } catch (e) {
    console.error("Error reading theme from localStorage:", e);
  }
  return "";
};

const initialState: ThemeState = {
  currentTheme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state: ThemeState, action: PayloadAction<ThemeName | "">) => {
      state.currentTheme = action.payload;
      
      // Сохраняем в localStorage для сохранения между сессиями
      if (typeof window !== "undefined") {
        try {
          if (action.payload) {
            localStorage.setItem("theme", action.payload);
          } else {
            localStorage.removeItem("theme");
          }
        } catch (e) {
          console.error("Error saving theme to localStorage:", e);
        }
      }
      
      // Применяем тему к DOM
      applyThemeToDOM(action.payload);
    },
    resetTheme: (state: ThemeState) => {
      state.currentTheme = "";
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("theme");
        } catch (e) {
          console.error("Error removing theme from localStorage:", e);
        }
      }
      applyThemeToDOM("");
    },
  },
});

// Функция применения темы к DOM (аналогично логике из ThemeSelector и SettingsPage)
const applyThemeToDOM = (theme: ThemeName | "") => {
  if (typeof window === "undefined") return;
  
  try {
    // Удаляем существующие theme-* классы
    Array.from(document.body.classList)
      .filter(
        (c): c is string => typeof c === "string" && c.startsWith("theme-")
      )
      .forEach((c) => document.body.classList.remove(c));

    if (theme) {
      // Добавляем класс вида theme-<name>
      document.body.classList.add(`theme-${theme}`);
      document.body.setAttribute("data-theme", theme);
    } else {
      document.body.removeAttribute("data-theme");
    }
  } catch (e) {
    console.error("[themeSlice] applyThemeToDOM error", e);
  }
};

export const { setTheme, resetTheme } = themeSlice.actions;
export const selectTheme = (state: { theme: ThemeState }) => state.theme.currentTheme;
export default themeSlice.reducer;