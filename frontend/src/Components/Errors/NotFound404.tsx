import React from "react";
import style from "../../style/Errors/NotFound404.module.scss";

function NotFound404() {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <h1 className={style.glitch} data-text="404">
          Ошибка 404
        </h1>
        <div className={style.imageWrapper}>
          <img
            src="public/d993a2e28da3bc76d7b33c492c39e2aa.jpg"
            alt="Не думаю что страница существует "
            className={style.img}
          />
          <div className={style.memeText}>Не думаю что страница существует</div>
        </div>
        <a href="/" className={style.homeButton}>
          <span>Вернуться назад</span>
        </a>
      </div>
    </div>
  );
}

export default NotFound404;
