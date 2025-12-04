import React from "react";
import LeftPanel from "./LeftPanel";
import Hero from "./Hero";
import Dashboard from "./Dashboard";
import style from "../../style/Main/MainPage.module.scss";

function MainPage() {
  return (
    <div className={style.mainContainer}>
      <div className={style.leftPanelContainer}>
        <LeftPanel />
      </div>
      <div className={style.contentContainer}>
        <div className={style.contentColumn}>
          <Hero />
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
