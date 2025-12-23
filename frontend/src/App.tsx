// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Regmodule from "./Components/Form/Regmodule";
import MainPage from "./Components/Main/MainPage";
import ProjectsPage from "./Components/Main/ProjectsPage"; // Добавить импорт
import NotFound404 from "./Components/Errors/NotFound404";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setVerificationCode, setVerified } from "./store/user";

function App() {
  const user = useSelector(selectUser);
  console.log(user);

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
