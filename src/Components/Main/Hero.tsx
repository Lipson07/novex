import React, { useState } from "react";
import style from "../../style/Main/Hero.module.scss";
import { HeroIcons } from "../../assets/LeftPanel/index.js";
import {
  quickActionsData,
  statusBlocksData,
  projectsData,
  activitiesData,
} from "../../assets/Hero/index.js";

const Hero = () => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const statIcons = {
    members: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        {/* ... существующий код ... */}
      </svg>
    ),
    tasks: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        {/* ... существующий код ... */}
      </svg>
    ),
  };

  const sectionIcons = {
    projects: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="#667EEA" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="#667EEA" strokeWidth="2" />
      </svg>
    ),
    activity: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="#667EEA" strokeWidth="2" />
        <path
          d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20"
          stroke="#667EEA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  // Функция для обработки клика по иконкам в header
  const handleTopButtonClick = (iconName: string) => {
    if (iconName === "notifications") {
      setIsActivityModalOpen(true);
    } else {
      console.log(`Нажата иконка: ${iconName}`);
      // Обработка других иконок
    }
  };

  // Функция для закрытия модального окна
  const closeActivityModal = () => {
    setIsActivityModalOpen(false);
  };

  const handleQuickActionClick = (id: number) => {
    console.log(`Быстрое действие: ${id}`);
  };

  const handleProjectClick = (id: number) => {
    setActiveProject(id);
    console.log(`Выбран проект: ${id}`);
  };

  const handleViewAllClick = () => {
    console.log("Показать все проекты");
  };

  const renderQuickActionButton = (action: (typeof quickActionsData)[0]) => (
    <button
      key={action.id}
      className={style.quickBtn}
      data-gradient={action.gradient}
      onClick={() => handleQuickActionClick(action.id)}
    >
      <div className={style.quickIcon}>
        <div dangerouslySetInnerHTML={{ __html: action.icon }} />
      </div>
      <span>{action.title}</span>
    </button>
  );

  const renderStatusBlock = (block: (typeof statusBlocksData)[0]) => (
    <div key={block.id} className={style[block.className]}>
      <span>{block.text}</span>
      {block.hasDot && <span className={style.dot}>●</span>}
      {block.value}
    </div>
  );

  const renderProjectCard = (project: (typeof projectsData)[0]) => (
    <div
      key={project.id}
      className={`${style.projectCard} ${
        activeProject === project.id ? style.active : ""
      }`}
      onClick={() => handleProjectClick(project.id)}
    >
      <div className={style.projectHeader}>
        <div className={style.projectName}>
          <h3>{project.name}</h3>
          <span
            className={
              project.status === "active"
                ? style.statusActive
                : style.statusReview
            }
          >
            {project.statusText}
          </span>
        </div>
        <div className={style.projectStats}>
          <div className={style.stat}>
            {statIcons.members}
            <span>{project.members}</span>
          </div>
          <div className={style.stat}>
            {statIcons.tasks}
            <span>{project.tasks}</span>
          </div>
        </div>
      </div>
      <div className={style.progressContainer}>
        <div className={style.progressLabel}>
          <span>Прогресс</span>
          <span>{project.progress}%</span>
        </div>
        <div className={style.progressBar}>
          <div
            className={style.progressFill}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderActivityItem = (activity: (typeof activitiesData)[0]) => (
    <div key={activity.id} className={style.activityItem}>
      <div className={style.avatar}>{activity.avatar}</div>
      <div className={style.activityContent}>
        <p>{activity.text}</p>
        <span>{activity.time}</span>
      </div>
    </div>
  );

  return (
    <>
      <div className={style.container}>
        <header className={style.header}>
          <div className={style.topBar}>
            <div className={style.logo}>
              <h1 className={style.title}>Novex</h1>
              <p className={style.subtitle}>
                Интеллектуальное рабочее пространство для современных команд
              </p>
            </div>

            <div className={style.topButtons}>
              {HeroIcons.map((icon) => (
                <button
                  key={icon.name}
                  className={style.topButton}
                  onClick={() => handleTopButtonClick(icon.name)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d={icon.icon}
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className={style.bottomBar}>
            {statusBlocksData.map(renderStatusBlock)}
          </div>
        </header>

        <div className={style.quickActions}>
          {quickActionsData.map(renderQuickActionButton)}
        </div>

        <div className={style.projectsSection}>
          <div className={style.sectionHeader}>
            <div className={style.sectionTitle}>
              {sectionIcons.projects}
              <h2>Активные проекты</h2>
            </div>
            <button className={style.viewAll} onClick={handleViewAllClick}>
              Смотреть все →
            </button>
          </div>

          <div className={style.projectCards}>
            {projectsData.map(renderProjectCard)}
          </div>
        </div>
      </div>

      {/* Модальное окно активности */}
      {isActivityModalOpen && (
        <div className={style.modalOverlay} onClick={closeActivityModal}>
          <div
            className={style.activityModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={style.modalHeader}>
              <div className={style.modalTitle}>
                {sectionIcons.activity}
                <h2>Недавняя активность</h2>
              </div>
              <button
                className={style.closeButton}
                onClick={closeActivityModal}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className={style.modalActivityList}>
              {activitiesData.map(renderActivityItem)}
            </div>

            <div className={style.modalFooter}>
              <button className={style.viewAllBtn} onClick={handleViewAllClick}>
                Показать всю активность
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
