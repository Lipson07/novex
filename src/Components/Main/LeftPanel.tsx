import React, { useState } from "react";
import style from "../../style/Main/LeftPanel.module.scss";
import { leftPanelIcons } from "../../assets/LeftPanel/index.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";

function LeftPanel() {
  const user = useSelector(selectUser);
  const [activeCategory, setActiveCategory] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tittle, setTittle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestions = [
    "Обзор дорожной карты Q4",
    "Обновить документацию дизайн-системы",
    "Запланировать синхронизацию команды",
  ];

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      console.log("Отправка сообщения ИИ:", chatMessage);
      setChatMessage("");
    }
  };

  const handleNewProject = () => {
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTittle("");
    setDescription("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tittle.trim()) {
      setError("Пожалуйста, введите название проекта");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Отправка данных:", {
        tittle: tittle.trim(),
        description: description.trim(),
        owner_id: user.id,
      });

      const response = await fetch("http://127.0.0.1:8000/api/createProj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          tittle: tittle.trim(), // Исправлено: 'title' вместо 'tittle'
          description: description.trim(),
          owner_id: user.id,
        }),
      });

      console.log("Статус ответа:", response.status);
      console.log("Заголовки ответа:", response.headers);

      const responseText = await response.text();
      console.log("Текст ответа:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Ошибка парсинга JSON:", e);
        throw new Error("Некорректный ответ от сервера");
      }

      if (response.ok) {
        console.log("Проект успешно создан:", responseData);
        closeModal();
        // Можно добавить уведомление об успехе или обновить список проектов
      } else {
        console.error("Ошибка сервера:", responseData);
        const errorMessage =
          responseData.error ||
          responseData.message ||
          `Ошибка ${response.status}: ${response.statusText}`;
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setError(
        "Ошибка подключения к серверу. Проверьте подключение и попробуйте снова."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Стили для модального окна
  const modalOverlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    background: "rgba(32, 32, 32, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "16px",
    padding: "30px",
    width: "420px",
    maxWidth: "90vw",
    color: "white",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
  };

  return (
    <>
      <div className={style.main}>
        {/* Остальной код компонента без изменений */}
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

      {/* Модальное окно создания проекта */}
      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Создать новый проект
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                    color: "#f87171",
                    fontSize: "14px",
                    marginBottom: "20px",
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontWeight: 500,
                  }}
                >
                  Название проекта *
                </label>
                <input
                  type="text"
                  value={tittle}
                  onChange={(e) => {
                    setTittle(e.target.value);
                    setError("");
                  }}
                  placeholder="Введите название проекта"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: error
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "rgba(255, 255, 255, 0.1)";
                    e.target.style.background = "rgba(255, 255, 255, 0.08)";
                  }}
                  required
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontWeight: 500,
                  }}
                >
                  Описание
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишите ваш проект..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical",
                    minHeight: "80px",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.target.style.background = "rgba(255, 255, 255, 0.08)";
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  style={{
                    padding: "10px 20px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.12)";
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.2)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.15)";
                    }
                  }}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={!tittle.trim() || isLoading}
                  style={{
                    padding: "10px 24px",
                    background: isLoading
                      ? "rgba(108, 115, 218, 0.5)"
                      : "rgba(108, 115, 218, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading && tittle.trim()) {
                      e.currentTarget.style.background =
                        "rgba(108, 115, 218, 1)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading && tittle.trim()) {
                      e.currentTarget.style.background =
                        "rgba(108, 115, 218, 0.8)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Создание...
                    </>
                  ) : (
                    "Создать проект"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default LeftPanel;
