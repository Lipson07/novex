import React, { useState } from "react";
import style from "../../style/Main/Hero.module.scss";
import { HeroIcons } from "../../assets/LeftPanel/index.js";
import {
  statusBlocksData,
  projectsData,
  activitiesData,
  progressStatusIcons,
} from "../../assets/Hero/index.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import {
  mockUsers,
  projectTeams,
  deadlinesData,
  quickAccessData,
  formatDeadlineDate,
  getPriorityColor,
} from "../../assets/MockData/index.js";

interface HeroProps {
  onNavigateToProjects?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToProjects }) => {
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedSections, setCollapsedSections] = useState<{
    projects: boolean;
    team: boolean;
    deadlines: boolean;
    quickAccess: boolean;
  }>({
    projects: false,
    team: false,
    deadlines: false,
    quickAccess: false,
  });
  const user = useSelector(selectUser);

  const statIcons = {
    members: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    tasks: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 4L12 14.01l-3-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
    team: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          stroke="#667EEA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="7" r="4" stroke="#667EEA" strokeWidth="2" />
        <path
          d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          stroke="#667EEA"
          strokeWidth="2"
        />
      </svg>
    ),
    deadlines: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          ry="2"
          stroke="#667EEA"
          strokeWidth="2"
        />
        <line
          x1="16"
          y1="2"
          x2="16"
          y2="6"
          stroke="#667EEA"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="2"
          x2="8"
          y2="6"
          stroke="#667EEA"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="3"
          y1="10"
          x2="21"
          y2="10"
          stroke="#667EEA"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    quickAccess: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          stroke="#667EEA"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="3" stroke="#667EEA" strokeWidth="2" />
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

  const handleProjectClick = (id: number) => {
    console.log(`Выбран проект: ${id}`);
  };

  const handleViewAllClick = () => {
    console.log("Переход на страницу проектов");
    if (onNavigateToProjects) {
      onNavigateToProjects();
    }
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Получаем информацию о текущем пользователе
  const currentUser = mockUsers.find((u) => u.id === user?.id) || mockUsers[0];

  // Получаем команду для первого активного проекта
  const activeProject = projectsData[0];
  const projectTeam = projectTeams.find(
    (team) => team.projectId === activeProject?.id
  );

  // Получаем участников команды
  const teamMembers = projectTeam
    ? projectTeam.members.map((member) => ({
        ...mockUsers.find((u) => u.id === member.userId),
        role: member.role,
      }))
    : [];

  // Получаем ближайшие дедлайны (исключая завершенные)
  const upcomingDeadlines = deadlinesData.filter(
    (d) => d.status !== "completed"
  );

  const renderStatusBlock = (block: (typeof statusBlocksData)[0]) => (
    <div key={block.id} className={style[block.className]}>
      <span>{block.text}</span>
      {block.hasDot && <span className={style.dot}>●</span>}
      {block.value}
    </div>
  );

  const renderProjectCard = (project: (typeof projectsData)[0]) => {
    // Функция для расчета цвета
    const getProgressColor = (progress: number): string => {
      if (progress <= 33) {
        const ratio = progress / 33;
        const r = Math.floor(255);
        const g = Math.floor(165 * ratio);
        const b = Math.floor(0);
        return `rgb(${r}, ${g}, ${b})`;
      } else if (progress <= 66) {
        const ratio = (progress - 33) / 33;
        const r = Math.floor(255);
        const g = Math.floor(165 + 90 * ratio);
        const b = Math.floor(0);
        return `rgb(${r}, ${g}, ${b})`;
      } else {
        const ratio = (progress - 66) / 34;
        const r = Math.floor(255 - 155 * ratio);
        const g = Math.floor(255);
        const b = Math.floor(0);
        return `rgb(${r}, ${g}, ${b})`;
      }
    };

    // Получение статуса проекта с иконками
    const getProgressStatus = (p: number) => {
      if (p === 0)
        return {
          text: "Не начат",
          icon: progressStatusIcons.notStarted,
          color: "statusNotStarted",
        };
      if (p < 25)
        return {
          text: "Начальная стадия",
          icon: progressStatusIcons.earlyStage,
          color: "statusEarly",
        };
      if (p < 50)
        return {
          text: "В процессе",
          icon: progressStatusIcons.inProgress,
          color: "statusInProgress",
        };
      if (p < 75)
        return {
          text: "Хороший прогресс",
          icon: progressStatusIcons.goodProgress,
          color: "statusGood",
        };
      if (p < 100)
        return {
          text: "Почти готово",
          icon: progressStatusIcons.almostDone,
          color: "statusAlmost",
        };
      return {
        text: "Завершено",
        icon: progressStatusIcons.completed,
        color: "statusCompleted",
      };
    };

    const status = getProgressStatus(project.progress);

    // Рассчитываем выполненные задачи
    const totalTasks = project.tasks || 0;
    const completedTasks = Math.floor((project.progress / 100) * totalTasks);

    // Примерная дата дедлайна
    const deadlineDate = new Date();
    deadlineDate.setDate(
      deadlineDate.getDate() + Math.floor((100 - project.progress) / 10)
    );
    const deadline = deadlineDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });

    return (
      <div
        key={project.id}
        className={style.projectCard}
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

        {/* УЛУЧШЕННЫЙ ПРОГРЕСС-БАР */}
        <div className={style.enhancedProgress}>
          <div className={style.progressHeader}>
            <div className={style.progressStatus}>
              <div
                className={`${style.statusIcon} ${style[status.color]}`}
                dangerouslySetInnerHTML={{ __html: status.icon }}
              />
              <span className={style.statusText}>{status.text}</span>
            </div>

            <div className={style.progressTooltip}>
              <span className={style.percentage}>{project.progress}%</span>
              <div className={style.tooltip}>
                <div className={style.tooltipItem}>
                  <span className={style.tooltipLabel}>Задачи:</span>
                  <span className={style.tooltipValue}>
                    {completedTasks}/{totalTasks}
                  </span>
                </div>
                <div className={style.tooltipItem}>
                  <span className={style.tooltipLabel}>Дедлайн:</span>
                  <span className={style.tooltipValue}>~{deadline}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ПРОГРЕСС-БАР */}
          <div className={style.progressBar}>
            <div
              className={style.progressFill}
              style={{
                width: `${project.progress}%`,
                background: getProgressColor(project.progress),
              }}
            />
          </div>
        </div>
        {/* КОНЕЦ УЛУЧШЕННОГО ПРОГРЕСС-БАРА */}
      </div>
    );
  };

  const renderActivityItem = (activity: (typeof activitiesData)[0]) => (
    <div key={activity.id} className={style.activityItem}>
      <div className={style.avatar}>{activity.avatar}</div>
      <div className={style.activityContent}>
        <p>{activity.text}</p>
        <span>{activity.time}</span>
      </div>
    </div>
  );

  // Рендер участника команды
  const renderTeamMember = (member: any) => (
    <div key={member.id} className={style.teamMember}>
      <div className={style.memberAvatar}>
        <div className={style.avatarCircle}>{member.avatar}</div>
        {member.online && <div className={style.onlineIndicator} />}
      </div>
      <div className={style.memberInfo}>
        <span className={style.memberName}>{member.name}</span>
        <span className={style.memberRole}>{member.role}</span>
      </div>
    </div>
  );

  // Рендер дедлайна
  const renderDeadline = (deadline: any) => {
    const deadlineDate = new Date(deadline.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysUntil = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isUrgent = daysUntil <= 1;
    const isSoon = daysUntil <= 3 && daysUntil > 1;

    return (
      <div
        key={deadline.id}
        className={`${style.deadlineItem} ${isUrgent ? style.urgent : ""} ${
          isSoon ? style.soon : ""
        }`}
      >
        <div
          className={style.deadlineDate}
          style={{
            backgroundColor: `${getPriorityColor(deadline.priority)}20`,
            borderColor: `${getPriorityColor(deadline.priority)}30`,
          }}
        >
          {formatDeadlineDate(deadline.date)}
        </div>
        <div className={style.deadlineInfo}>
          <div className={style.deadlineTitleRow}>
            <span className={style.deadlineTitle}>{deadline.title}</span>
            {isUrgent && (
              <span className={style.urgentBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Срочно
              </span>
            )}
          </div>
          <div className={style.deadlineMeta}>
            <span
              className={style.deadlinePriority}
              style={{ color: getPriorityColor(deadline.priority) }}
            >
              {deadline.priority === "high"
                ? "Высокий"
                : deadline.priority === "medium"
                ? "Средний"
                : "Низкий"}
            </span>
            {daysUntil >= 0 && (
              <span className={style.deadlineDays}>
                {daysUntil === 0
                  ? "Сегодня"
                  : daysUntil === 1
                  ? "Завтра"
                  : `Через ${daysUntil} дн.`}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Рендер быстрого доступа
  const renderQuickAccess = (item: any) => (
    <button
      key={item.id}
      className={style.quickAccessItem}
      onClick={() => console.log(`Быстрый доступ: ${item.action}`)}
    >
      <div
        className={style.quickAccessIcon}
        dangerouslySetInnerHTML={{ __html: item.icon }}
      />
      <span className={style.quickAccessTitle}>{item.title}</span>
    </button>
  );

  return (
    <>
      <div className={style.container}>
        <header className={style.header}>
          <div className={style.topBar}>
            {/* Логотип и поиск */}
            <div className={style.leftSection}>
              <div className={style.logo}>
                <h1 className={style.title}>Novex</h1>
              </div>

              {/* Поиск */}
              <div className={style.searchBar}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  className={style.searchIcon}
                >
                  <path
                    d="M6 0C9.3136 1.28863e-07 11.9998 2.68644 12 6C12 7.41644 11.5074 8.7168 10.6865 9.74316L13.1377 12.1953C13.398 12.4557 13.398 12.8773 13.1377 13.1377C12.8773 13.398 12.4557 13.398 12.1953 13.1377L9.74316 10.6865C8.7168 11.5074 7.41644 12 6 12C2.68644 11.9998 1.28867e-07 9.3136 0 6C0.000175991 2.68655 2.68655 0.000175988 6 0ZM6 1.33398C3.42293 1.33416 1.33416 3.42293 1.33398 6C1.33398 8.57722 3.42282 10.6668 6 10.667C8.57733 10.667 10.667 8.57733 10.667 6C10.6668 3.42282 8.57722 1.33398 6 1.33398Z"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Поиск проектов, задач, людей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={style.searchInput}
                />
                {searchQuery && (
                  <button
                    className={style.searchClear}
                    onClick={() => setSearchQuery("")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Правая часть: кнопки и профиль */}
            <div className={style.rightSection}>
              {/* Статус-блоки (компактные) */}
              <div className={style.statusBlocksCompact}>
                {statusBlocksData.map(renderStatusBlock)}
              </div>

              {/* Кнопки действий */}
              <div className={style.topButtons}>
                {HeroIcons.filter((icon) => icon.name !== "profile").map(
                  (icon) => (
                    <button
                      key={icon.name}
                      className={style.topButton}
                      onClick={() => handleTopButtonClick(icon.name)}
                      title={
                        icon.name === "notifications"
                          ? "Уведомления"
                          : icon.name === "settings"
                          ? "Настройки"
                          : ""
                      }
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d={icon.icon}
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )
                )}
              </div>

              {/* Информация о пользователе */}
              <div className={style.userProfileHeader}>
                <div className={style.userAvatarHeader}>
                  <div className={style.avatarCircleHeader}>
                    {currentUser.avatar}
                  </div>
                  {currentUser.online && (
                    <div className={style.onlineIndicatorHeader} />
                  )}
                </div>
                <div className={style.userInfoHeader}>
                  <span className={style.userNameHeader}>
                    {currentUser.name}
                  </span>
                  <span className={style.userPositionHeader}>
                    {currentUser.position}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Основной контент - группировка секций */}
        <div className={style.mainContent}>
          {/* Группа: Проекты и команда */}
          <div className={style.projectsGroup}>
            {/* Секция активных проектов */}
            <div className={style.projectsSection}>
              <div className={style.sectionHeader}>
                <div
                  className={style.sectionTitle}
                  onClick={() => toggleSection("projects")}
                >
                  {sectionIcons.projects}
                  <h2>Активные проекты</h2>
                  <button
                    className={style.collapseButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection("projects");
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`${style.collapseIcon} ${
                        collapsedSections.projects ? style.collapsed : ""
                      }`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
                <button
                  className={style.viewAll}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewAllClick();
                  }}
                >
                  Смотреть все →
                </button>
              </div>

              {!collapsedSections.projects && (
                <div className={style.projectCards}>
                  {projectsData.length > 0 ? (
                    projectsData.map(renderProjectCard)
                  ) : (
                    <div className={style.noProjects}>
                      <p>Нет активных проектов</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Секция команды проекта */}
            {teamMembers.length > 0 && (
              <div className={style.teamSection}>
                <div
                  className={style.sectionHeader}
                  onClick={() => toggleSection("team")}
                >
                  <div className={style.sectionTitle}>
                    {sectionIcons.team}
                    <h2>Команда проекта</h2>
                    <button className={style.collapseButton}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`${style.collapseIcon} ${
                          collapsedSections.team ? style.collapsed : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  <span className={style.teamCount}>
                    {teamMembers.length} участников
                  </span>
                </div>
                {!collapsedSections.team && (
                  <div className={style.teamList}>
                    {teamMembers.map(renderTeamMember)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Группа: Дедлайны и быстрый доступ */}
          <div className={style.secondaryGroup}>
            {/* Секция ближайших дедлайнов */}
            {upcomingDeadlines.length > 0 && (
              <div className={style.deadlinesSection}>
                <div
                  className={style.sectionHeader}
                  onClick={() => toggleSection("deadlines")}
                >
                  <div className={style.sectionTitle}>
                    {sectionIcons.deadlines}
                    <h2>Ближайшие дедлайны</h2>
                    <button className={style.collapseButton}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`${style.collapseIcon} ${
                          collapsedSections.deadlines ? style.collapsed : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  <span className={style.deadlinesCount}>
                    {upcomingDeadlines.length}
                  </span>
                </div>
                {!collapsedSections.deadlines && (
                  <div className={style.deadlinesList}>
                    {upcomingDeadlines.map(renderDeadline)}
                  </div>
                )}
              </div>
            )}

            {/* Секция быстрого доступа */}
            <div className={style.quickAccessSection}>
              <div
                className={style.sectionHeader}
                onClick={() => toggleSection("quickAccess")}
              >
                <div className={style.sectionTitle}>
                  {sectionIcons.quickAccess}
                  <h2>Быстрый доступ</h2>
                  <button className={style.collapseButton}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`${style.collapseIcon} ${
                        collapsedSections.quickAccess ? style.collapsed : ""
                      }`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
              </div>
              {!collapsedSections.quickAccess && (
                <div className={style.quickAccessGrid}>
                  {quickAccessData.map(renderQuickAccess)}
                </div>
              )}
            </div>
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
