import React, { useState } from "react";
import style from "../../style/Main/LeftPanel.module.scss";
import { leftPanelIcons } from "../../assets/LeftPanel/index.js";

function LeftPanel() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [chatMessage, setChatMessage] = useState("");

  const suggestions = [
    "Обзор дорожной карты Q4",
    "Обновить документацию дизайн-системы",
    "Запланировать синхронизацию команды",
  ];

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      console.log("Отправка сообщения ИИ:", chatMessage);
      // Здесь будет логика отправки сообщения ИИ
      setChatMessage("");
    }
  };

  const handleNewProject = () => {
    console.log("Создание нового проекта");
    // Логика создания нового проекта
  };

  return (
    <div className={style.main}>
      <div className={style.header}>
        <div className={style.naming}>
          <div className={style.svgbox}>
            <svg
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.00341 13.0026C1.81418 13.0032 1.62864 12.9502 1.46836 12.8496C1.30809 12.749 1.17964 12.605 1.09796 12.4343C1.01628 12.2636 0.984703 12.0732 1.00691 11.8853C1.02912 11.6973 1.10419 11.5196 1.22341 11.3726L11.1234 1.1726C11.1977 1.08689 11.2989 1.02896 11.4104 1.00834C11.5219 0.987714 11.6371 1.00562 11.7371 1.05911C11.8371 1.1126 11.916 1.1985 11.9607 1.30271C12.0055 1.40692 12.0135 1.52325 11.9834 1.6326L10.0634 7.6526C10.0068 7.80413 9.98778 7.96712 10.008 8.12761C10.0282 8.2881 10.0871 8.44129 10.1795 8.57403C10.2719 8.70678 10.3952 8.81512 10.5387 8.88976C10.6822 8.96441 10.8417 9.00313 11.0034 9.0026H18.0034C18.1926 9.00196 18.3782 9.05502 18.5385 9.15563C18.6987 9.25623 18.8272 9.40025 18.9089 9.57095C18.9905 9.74165 19.0221 9.93202 18.9999 10.1199C18.9777 10.3079 18.9026 10.4856 18.7834 10.6326L8.88341 20.8326C8.80915 20.9183 8.70795 20.9762 8.59643 20.9969C8.48491 21.0175 8.36969 20.9996 8.26968 20.9461C8.16967 20.8926 8.09083 20.8067 8.04607 20.7025C8.00132 20.5983 7.99333 20.482 8.02341 20.3726L9.94341 14.3526C10 14.2011 10.019 14.0381 9.99882 13.8776C9.9786 13.7171 9.91975 13.5639 9.82732 13.4312C9.73489 13.2984 9.61164 13.1901 9.46813 13.1154C9.32463 13.0408 9.16516 13.0021 9.00341 13.0026H2.00341Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={style.namingtxt}>
            <p>Рабочее пространство</p>
          </div>
        </div>
        <div className={style.searchcont}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 0C9.3136 1.28863e-07 11.9998 2.68644 12 6C12 7.41644 11.5074 8.7168 10.6865 9.74316L13.1377 12.1953C13.398 12.4557 13.398 12.8773 13.1377 13.1377C12.8773 13.398 12.4557 13.398 12.1953 13.1377L9.74316 10.6865C8.7168 11.5074 7.41644 12 6 12C2.68644 11.9998 1.28867e-07 9.3136 0 6C0.000175991 2.68655 2.68655 0.000175988 6 0ZM6 1.33398C3.42293 1.33416 1.33416 3.42293 1.33398 6C1.33398 8.57722 3.42282 10.6668 6 10.667C8.57733 10.667 10.667 8.57733 10.667 6C10.6668 3.42282 8.57722 1.33398 6 1.33398Z"
              fill="white"
              fillOpacity="0.4"
            />
          </svg>
          <input type="text" placeholder="Поиск" />
        </div>
      </div>

      <div className={style.category}>
        {leftPanelIcons.map((element, index) => (
          <div
            key={element.name}
            className={`${style.categoryItem} ${
              activeCategory === index ? style.active : ""
            }`}
            onClick={() => setActiveCategory(index)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d={element.icon} />
            </svg>
            <p>{element.name}</p>
          </div>
        ))}
      </div>

      {/* Секция ИИ */}
      <div className={style.suggestions}>
        <div className={style.glassCard}>
          <div className={style.cardHeader}>
            <div className={style.aiIdentity}>
              <div className={style.aiIcon}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className={style.aiInfo}>
                <div className={style.aiName}>Synapse AI</div>
                <div className={style.aiStatus}>
                  <div className={style.statusDot}></div>
                  <span>Всегда учится</span>
                </div>
              </div>
            </div>
          </div>

          <div className={style.cardContent}>
            <div className={style.suggestionsTitle}>Умные предложения</div>

            <div className={style.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <div key={index} className={style.suggestionItem}>
                  <div className={style.suggestionIcon}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                  <span className={style.suggestionText}>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Компактный чат с ИИ */}
          <form
            onSubmit={handleChatSubmit}
            className={style.chatInputContainer}
          >
            <div className={style.chatInputWrapper}>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Спросите Synapse AI..."
                className={style.chatInput}
                maxLength={100}
              />
              <button
                type="submit"
                className={style.chatSendButton}
                disabled={!chatMessage.trim()}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Кнопка нового проекта в самом низу */}
      <div className={style.bottomSection}>
        <button className={style.newProjectBtn} onClick={handleNewProject}>
          <div className={style.btnIcon}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span>Новый проект</span>
        </button>
      </div>
    </div>
  );
}

export default LeftPanel;
