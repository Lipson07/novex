import React, { useState} from "react";
import style from "../../style/Main/Hero.module.scss";
import { osnovaIcons } from "../../assets/LeftPanel/index.js";
import { 
  quickActionsData, 
  statusBlocksData, 
  projectsData, 
  activitiesData 
} from "../../assets/Hero/index.js";

const Hero = () => {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const statIcons = {
    members: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 3.12805C16.8578 3.35042 17.6174 3.85132 18.1597 4.55211C18.702 5.25291 18.9962 6.11394 18.9962 7.00005C18.9962 7.88616 18.702 8.74719 18.1597 9.44799C17.6174 10.1488 16.8578 10.6497 16 10.8721"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    tasks: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
        />
        <circle
          cx="8"
          cy="8"
          r="3"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
        />
      </svg>
    )
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
    )
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

 
  const renderQuickActionButton = (action: typeof quickActionsData[0]) => (
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

  const renderStatusBlock = (block: typeof statusBlocksData[0]) => (
    <div key={block.id} className={style[block.className]}>
      <span>{block.text}</span>
      {block.hasDot && <span className={style.dot}>●</span>}
      {block.value}
    </div>
  );

  const renderProjectCard = (project: typeof projectsData[0]) => (
    <div 
      key={project.id} 
      className={`${style.projectCard} ${activeProject === project.id ? style.active : ""}`}
      onClick={() => handleProjectClick(project.id)}
    >
      <div className={style.projectHeader}>
        <div className={style.projectName}>
          <h3>{project.name}</h3>
          <span className={project.status === 'active' ? style.statusActive : style.statusReview}>
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

  const renderActivityItem = (activity: typeof activitiesData[0]) => (
    <div key={activity.id} className={style.activityItem}>
      <div className={style.avatar}>{activity.avatar}</div>
      <div className={style.activityContent}>
        <p>{activity.text}</p>
        <span>{activity.time}</span>
      </div>
    </div>
  );

  return (
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
            {osnovaIcons.map((icon) => (
              <button key={icon.name} className={style.topButton}>
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

      <div className={style.activitySection}>
        <div className={style.sectionHeader}>
          <div className={style.sectionTitle}>
            {sectionIcons.activity}
            <h2>Недавняя активность</h2>
          </div>
        </div>

        <div className={style.activityList}>
          {activitiesData.map(renderActivityItem)}
        </div>
      </div>
    </div>
  );
};

export default Hero;