import LeftPanel from "./LeftPanel";
import Hero from "./Hero.tsx";
import style from "../../style/Main/MainPage.module.scss";
import { useEffect } from "react";
function MainPage() {

  
  return (
    <div className={style.main}>
      <LeftPanel />
      <Hero />
    </div>
  );
}

export default MainPage;
