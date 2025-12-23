// MainPage.tsx
import React, { useState, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import LeftPanel from "./LeftPanel";
import Hero from "./Hero";
import { ProjectService } from "../../assets/MockData/index.js";
import style from "../../style/Main/MainPage.module.scss";

// Ленивая загрузка страниц
const Dashboard = lazy(() => import("./Dashboard"));
const TasksPage = lazy(() => import("./TasksPage"));
const SettingsPage = lazy(() => import("./SettingsPage"));
const ProjectsPage = lazy(() => import("./ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./ProjectDetailPage"));
const TeamChat = lazy(() => import("./TeamChat"));
const Schedule = lazy(() => import("./Schedule"));
const QuickNote = lazy(() => import("./QuickNote"));
const AIAssistantPage = lazy(() => import("./AIAssistantPage"));

type Page =
  | "main"
  | "projects"
  | "project-detail"
  | "team-chat"
  | "schedule"
  | "quick-note"
  | "tasks"
  | "dashboard"
  | "settings"
  | "ai";

function MainPage() {
  const user = useSelector(selectUser);
  const [currentPage, setCurrentPage] = useState<Page>("main");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<
    string | null
  >(null);
  const [projectRefreshKey, setProjectRefreshKey] = useState(0);

  const refreshProjects = () => {
    setProjectRefreshKey(prev => prev + 1);
  };

  const handleProjectClick = async (projectId: number) => {
    try {
      const project = await ProjectService.getProjectById(projectId, user?.id);
      setSelectedProjectId(projectId);
      setSelectedProjectTitle(project.tittle);
      setCurrentPage("project-detail");
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      setSelectedProjectId(projectId);
      setCurrentPage("project-detail");
    }
  };

  const handlePageChange = (page: string) => {
    const validPages: Page[] = [
      "main",
      "projects",
      "project-detail",
      "team-chat",
      "schedule",
      "quick-note",
      "tasks",
      "dashboard",
      "settings",
      "ai",
    ];
    if (validPages.includes(page as Page)) {
      setCurrentPage(page as Page);
      if (
        page !== "project-detail" &&
        page !== "team-chat" &&
        page !== "schedule" &&
        page !== "quick-note"
      ) {
        setSelectedProjectId(null);
        setSelectedProjectTitle(null);
      }
    }
  };

  const handleBackToProjects = () => {
    setCurrentPage("projects");
    setSelectedProjectId(null);
    setSelectedProjectTitle(null);
  };

  const handleBackToProjectDetail = () => {
    setCurrentPage("project-detail");
  };

  const handleNavigateToTeamChat = async (projectId: number) => {
    try {
      const project = await ProjectService.getProjectById(projectId, user?.id);
      setSelectedProjectId(projectId);
      setSelectedProjectTitle(project.tittle);
      setCurrentPage("team-chat");
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      setSelectedProjectId(projectId);
      setCurrentPage("team-chat");
    }
  };

  const handleNavigateToSchedule = async (projectId: number) => {
    try {
      const project = await ProjectService.getProjectById(projectId, user?.id);
      setSelectedProjectId(projectId);
      setSelectedProjectTitle(project.title);
      setCurrentPage("schedule");
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      setSelectedProjectId(projectId);
      setCurrentPage("schedule");
    }
  };

  const handleNavigateToQuickNote = async (projectId: number) => {
    try {
      const project = await ProjectService.getProjectById(projectId, user?.id);
      setSelectedProjectId(projectId);
      setSelectedProjectTitle(project.tittle);
      setCurrentPage("quick-note");
    } catch (error) {
      console.error("Ошибка загрузки проекта:", error);
      setSelectedProjectId(projectId);
      setCurrentPage("quick-note");
    }
  };

  const handleNavigateToAI = () => {
    setCurrentPage("ai");
  };

  const renderContent = () => {
    switch (currentPage) {
      case "project-detail":
        if (selectedProjectId) {
          return (
            <ProjectDetailPage
              projectId={selectedProjectId}
              onBack={handleBackToProjects}
              onNavigateToTeamChat={handleNavigateToTeamChat}
              onNavigateToSchedule={handleNavigateToSchedule}
              onNavigateToQuickNote={handleNavigateToQuickNote}
              onNavigateToAI={handleNavigateToAI}
              onProjectDeleted={refreshProjects}
            />
          );
        }
        return <ProjectsPage onProjectClick={handleProjectClick} projectRefreshKey={projectRefreshKey} />;
      case "team-chat":
        if (selectedProjectId) {
          return (
            <TeamChat
              projectId={selectedProjectId}
              projectTitle={selectedProjectTitle || undefined}
              onBack={handleBackToProjectDetail}
            />
          );
        }
        return <ProjectsPage onProjectClick={handleProjectClick} />;
      case "schedule":
        if (selectedProjectId) {
          return (
            <Schedule
              projectId={selectedProjectId}
              projectTitle={selectedProjectTitle || undefined}
              onBack={handleBackToProjectDetail}
            />
          );
        }
        return <ProjectsPage onProjectClick={handleProjectClick} />;
      case "quick-note":
        if (selectedProjectId) {
          return (
            <QuickNote
              projectId={selectedProjectId}
              projectTitle={selectedProjectTitle || undefined}
              onBack={handleBackToProjectDetail}
            />
          );
        }
        return <ProjectsPage onProjectClick={handleProjectClick} />;
      case "projects":
        return <ProjectsPage onProjectClick={handleProjectClick} />;
      case "tasks":
        return <TasksPage />;
      case "dashboard":
        return <Dashboard />;
      case "settings":
        return <SettingsPage />;
      case "ai":
        return <AIAssistantPage />;
      case "main":
      default:
        return (
          <div className={style.contentColumn}>
            <Hero
              onNavigateToProjects={() => setCurrentPage("projects")}
              onProjectClick={handleProjectClick}
              projectRefreshKey={projectRefreshKey}
            />
          </div>
        );
    }
  };

  return (
    <div className={style.mainContainer}>
      <div className={style.leftPanelContainer}>
        <LeftPanel
          onPageChange={handlePageChange}
          currentPage={currentPage}
          onProjectClick={handleProjectClick}
          activeProjectId={selectedProjectId}
          projectRefreshKey={projectRefreshKey}
        />
      </div>
      <div className={style.contentContainer}>
        <Suspense fallback={<div className={style.loadingFallback}>Загрузка...</div>}>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  );
}

export default MainPage;
