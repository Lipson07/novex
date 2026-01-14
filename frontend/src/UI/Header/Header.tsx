import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { Tabs } from './tabs';
import { Link } from 'react-router-dom';
import { Projects } from '../Projects/Projects.Mockdata';
import {
  LogoIcon,
  HomeIcon,
  ProjectsIcon,
  TasksIcon,
  CodeIcon,
  SettingsIcon,
  AIIcon,
  MenuIcon,
  CloseIcon,
} from '../Icons/index.ts';
import { useTheme } from '../../context/Theme.tsx';

export default function Header() {
  const countOfProjects = Projects.length;
  const [tabs, setTabs] = useState(Tabs);
  const [active, setActive] = useState();
  const { theme, changeTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'home':
        return <HomeIcon />;
      case 'projects':
        return <ProjectsIcon />;
      case 'tasks':
        return <TasksIcon />;
      case 'code':
        return <CodeIcon />;
      case 'settings':
        return <SettingsIcon />;
      case 'ai':
        return <AIIcon />;
      default:
        return null;
    }
  };

  function toogleActive(name: string) {
    setTabs((item) => item.map((prev) => ({ ...prev, active: prev.name === name })));
    // Закрываем меню при клике на таб на мобильных
    if (window.innerWidth <= 1024) {
      setIsMenuOpen(false);
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Закрываем меню при изменении размера окна
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Блокируем скролл body когда меню открыто на мобильных
    if (isMenuOpen && window.innerWidth <= 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  return (
    <>
      {/* Overlay для мобильных */}
      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}

      {/* Бургер-кнопка для мобильных */}
      <button className={styles.burgerButton} onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
      </button>

      <div className={`${styles.allheader} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <div className={styles.logo_Container}>
          <LogoIcon />
          <h1>Novex</h1>
        </div>

        <div className={styles.Tabs}>
          {tabs.map((tab) => (
            <Link key={tab.id} to={tab.name === 'Home' ? '/' : `/${tab.name}`}>
              <div
                className={tab.active ? styles.activeTab : styles.tab}
                onClick={() => toogleActive(tab.name)}>
                {getIcon(tab.name)}
                <h2>{tab.name}</h2>
                {tab.name === 'Projects' && countOfProjects > 0 && (
                  <div className={styles.projectCount}>{countOfProjects}</div>
                )}
              </div>
            </Link>
          ))}
          <div
            className={styles.tab}
            onClick={() => {
              changeTheme();
              // Закрываем меню при клике на смену темы на мобильных
              if (window.innerWidth <= 1024) {
                setIsMenuOpen(false);
              }
            }}>
            {theme}
          </div>
        </div>
      </div>
    </>
  );
}
