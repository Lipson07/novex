// MainPage.tsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import LeftPanel from "./LeftPanel";
import Hero from "./Hero";
import ProjectsPage from "./ProjectsPage";
import ProjectDetailPage from "./ProjectDetailPage";
import TeamChat from "./TeamChat";
import Schedule from "./Schedule";
import QuickNote from "./QuickNote";
import { ProjectService } from "../../assets/MockData/index.js";
import style from "../../style/Main/MainPage.module.scss";

type Page =
  | "main"
  | "projects"
  | "project-detail"
  | "team-chat"
  | "schedule"
  | "quick-note";

function MainPage() {
  const user = useSelector(selectUser);
  const [currentPage, setCurrentPage] = useState<Page>("main");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<
    string | null
  >(null);

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
      setSelectedProjectTitle(project.tittle);
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
            />
          );
        }
        return <ProjectsPage onProjectClick={handleProjectClick} />;
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
      case "main":
      default:
        return (
          <div className={style.contentColumn}>
            <Hero
              onNavigateToProjects={() => setCurrentPage("projects")}
              onProjectClick={handleProjectClick}
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
        />
      </div>
      <div className={style.contentContainer}>{renderContent()}</div>
    </div>
  );
}

export default MainPage;
