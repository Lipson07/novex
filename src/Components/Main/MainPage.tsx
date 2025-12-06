// MainPage.tsx
import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import Hero from "./Hero";
import ProjectsPage from "./ProjectsPage";
import ProjectDetailPage from "./ProjectDetailPage";
import style from "../../style/Main/MainPage.module.scss";

type Page = "main" | "projects" | "project-detail";

function MainPage() {
  const [currentPage, setCurrentPage] = useState<Page>("main");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setCurrentPage("project-detail");
  };

  const handlePageChange = (page: string) => {
    if (page === "main" || page === "projects" || page === "project-detail") {
      setCurrentPage(page as Page);
      if (page !== "project-detail") {
        setSelectedProjectId(null);
      }
    }
  };

  const handleBackToProjects = () => {
    setCurrentPage("projects");
    setSelectedProjectId(null);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "project-detail":
        if (selectedProjectId) {
          return (
            <ProjectDetailPage
              projectId={selectedProjectId}
              onBack={handleBackToProjects}
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
            <Hero onNavigateToProjects={() => setCurrentPage("projects")} />
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
