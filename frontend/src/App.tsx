// App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Regmodule from "./Components/Form/Regmodule";
import MainPage from "./Components/Main/MainPage";
import ProjectsPage from "./Components/Main/ProjectsPage"; // Добавить импорт
import NotFound404 from "./Components/Errors/NotFound404";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setVerificationCode, setVerified } from "./store/user";
import { selectTheme } from "./store/theme";

function App() {
  const user = useSelector(selectUser);
  const themeValue = useSelector(selectTheme);
  console.log(user);

  // Применение темы при загрузке приложения
  useEffect(() => {
    if (themeValue && typeof window !== "undefined") {
      try {
        // Удаляем существующие theme-* классы
        Array.from(document.body.classList)
          .filter(
            (c): c is string => typeof c === "string" && c.startsWith("theme-")
          )
          .forEach((c) => document.body.classList.remove(c));

        // Добавляем класс вида theme-<name>
        document.body.classList.add(`theme-${themeValue}`);
        document.body.setAttribute("data-theme", themeValue);
      } catch (e) {
        console.error("Error applying theme on app init:", e);
      }
    }
  }, [themeValue]);

  return (
    <div className="App">
      <Routes>
        <Route path="/auth/*" element={<Regmodule />} />
        {user.isVerified ? (
          <>
            <Route path="/" element={<MainPage />} />
            <Route path="/projects" element={<ProjectsPage />} />{" "}
            {/* Добавить маршрут */}
          </>
        ) : (
          <Route path="/" element={<Regmodule />} />
        )}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </div>
  );
}

export default App;
