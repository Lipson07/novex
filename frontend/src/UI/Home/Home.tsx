import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { Tabs } from './Data';
import { Link } from 'react-router-dom';
import type { TaskInterface, UserInterface } from './Home.Interface';
import {
  SearchIcon,
  NotificationIcon,
  AccountIcon,
  StatusIcon,
  TeamIcon,
  AIIcon,
  ExclamationIcon,
  GithubIcon,
  ProjectsIcon,
  MetricsIcon,
  CICDHealthIcon,
  ActiveIcon,
  OverdueIcon,
  BlockedIcon,
  ArrowRightIcon,
  WarningIcon,
  PauseIconRounded,
  SettingsIcon,
  LogoutIcon,
} from '../Icons';
import { Projects } from '../Projects/Projects.Mockdata';
import { Tasks } from '../../Tasks/Tasks.mockData';
import AccountSettings from '../AccountSettings/AccountSettings';

export default function Home() {
  const [mockUsers, setMockUsers] = useState<UserInterface[]>([
    {
      userid: 0,
      email: 'botoli@gmail.com',
      password: 'passwd',
      name: 'botoli',
      online: false,
      role: 'Admin',
      avatar: false,
    },
    {
      userid: 1,
      email: 'bnix@gmail.com',
      password: 'passwd',
      name: 'bnix',
      online: true,
      role: 'Designer',
      avatar: false,
    },
    {
      userid: 2,
      email: 'test@gmail.com',
      password: 'passwd',
      name: 'test',
      online: true,
      role: 'Senior',
      avatar: false,
    },
  ]);

  const [mockAI, setMockAI] = useState([
    {
      id: 0,
      name: 'ChatGPT',
      text: 'Решить проблемы с безопасностью ',
    },
    {
      id: 1,
      name: 'ChatGPT',
      text: 'Разработать документацию',
    },
  ]);

  const [mockTasks, setMockTasks] = useState<TaskInterface[]>(Tasks);
  const [sortBy, setSortBy] = useState('Dedline');
  const [sort, setSort] = useState([]);
  const [isUp, setIsUp] = useState(true);
  const [isopenProfile, setIsopenProfile] = useState(false);
  const [isOpenAccountSettings, setIsOpenAccountSettings] = useState(false);

  const progress = (title: string) => {
    return Math.floor(
      (mockTasks.filter((task) => task.project === title && task.success).length /
        mockTasks.filter((task) => task.project === title).length) *
        100,
    );
  };
  useEffect(() => {
    isUp ? sortUpTasks() : sortDownTasks();
  }, [mockTasks, sortBy, isUp]);
  function openAccountSettings() {
    setIsOpenAccountSettings(!isOpenAccountSettings);
  }
  function sortUpTasks() {
    if (sortBy === 'Dedline') {
      setSort(
        [...mockTasks].sort((a, b) => {
          const A = parseInt(a.dedline);
          const B = parseInt(b.dedline);
          return A - B;
        }),
      );
    } else if (sortBy === 'Risk') {
      setSort(
        [...mockTasks].sort((a, b) => {
          const A = a.riskId;
          const B = b.riskId;
          return A - B;
        }),
      );
    }
  }

  function sortDownTasks() {
    if (sortBy === 'Dedline') {
      setSort(
        [...mockTasks].sort((a, b) => {
          const A = parseInt(a.dedline);
          const B = parseInt(b.dedline);
          return B - A;
        }),
      );
    } else if (sortBy === 'Risk') {
      setSort(
        [...mockTasks].sort((a, b) => {
          const A = a.riskId;
          const B = b.riskId;
          return B - A;
        }),
      );
    }
  }

  function SetStatistikActive(title: string) {
    return Math.floor(
      mockTasks.filter((task) => task.project === title && task.active === true).length,
    );
  }

  function SetStatistikBlocked(title: string) {
    return Math.floor(
      mockTasks.filter((task) => task.project === title && task.blocked === true).length,
    );
  }
  function SetStatistikOverdue(title: string) {
    return Math.floor(
      mockTasks.filter((task) => task.project === title && task.overdue === true).length,
    );
  }

  function OpenModalProfile() {
    isopenProfile === false ? setIsopenProfile(true) : setIsopenProfile(false);
  }
  return (
    <div className={styles.homeContainer}>
      <div className={styles.AccountSettingsModal}>
        {isOpenAccountSettings && (
          <AccountSettings onclose={() => setIsOpenAccountSettings(!isOpenAccountSettings)} />
        )}
      </div>
      <section className={styles.pageHeader}>
        <div className={styles.searchBar}>
          <SearchIcon />
          <input type="text" placeholder="Search" />
          <button>Search</button>
        </div>

        <div className={styles.avatar}>
          <div>
            <button>
              <NotificationIcon />
            </button>
          </div>
          {mockUsers.map(
            (user) =>
              user.role === 'Admin' && (
                <div className={styles.allAccount} onClick={OpenModalProfile}>
                  <div className={styles.account}>
                    <div className={styles.accountInfo}>
                      <div className={styles.accountAvatar}>
                        <AccountIcon />
                      </div>
                      <div className={styles.accountDetails}>
                        <p className={styles.accountName}>{user.name}</p>
                        <p className={styles.accountRole}>{user.role}</p>
                      </div>
                    </div>
                  </div>
                  {isopenProfile ? (
                    <div className={styles.modalProfile}>
                      <div className={styles.btnProfile} onClick={openAccountSettings}>
                        <button className={styles.settings}>
                          <SettingsIcon />
                        </button>
                        <p>Account settings</p>
                      </div>
                      <div className={styles.btnProfile}>
                        <button className={styles.logOut}>
                          <LogoutIcon />
                        </button>
                        <p>Log out</p>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ),
          )}
        </div>
      </section>

      <section className={styles.dashboard}>
        <h1>Home</h1>

        <div className={styles.metricsGrid}>
          {/* Company Projects Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <div className={styles.svgdiv}>
                <ProjectsIcon width={40} height={40} />
              </div>
              <h1>Company Projects</h1>
              <h3 className={styles.cardInfo}>Total: {Projects.length}</h3>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.infoTasks}>
                <div className={styles.active}>
                  <ActiveIcon />
                  <span className={styles.metricValue}>
                    {Projects.filter((project) => project.status === 'Active').length}
                  </span>
                  <p className={styles.cardInfo}>Active</p>
                </div>
                <div className={styles.blocked}>
                  <PauseIconRounded />
                  <span className={styles.metricValue}>
                    {Projects.filter((project) => project.status === 'Paused').length}
                  </span>
                  <p className={styles.cardInfo}>Paused</p>
                </div>
                <div className={styles.warning}>
                  <WarningIcon />
                  <span className={styles.metricValue}>
                    {Projects.filter((project) => project.status === 'Risk').length}
                  </span>
                  <p className={styles.cardInfo}>Risk</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Teams Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <div className={styles.svgdiv}>
                <TeamIcon width={40} height={40} />
              </div>
              <h1>Company Teams</h1>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardContentrow}>
                <p> Online:</p>
                <p>{mockUsers.filter((user) => user.online).length}</p>
              </div>
              <div className={styles.avatars}>
                {mockUsers.map((user) => user.online && <AccountIcon />)}
              </div>
            </div>
          </div>

          {/* Global Metrics Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <div className={styles.svgdiv}>
                <MetricsIcon width={40} height={40} />
              </div>
              <h1>Global Metrics</h1>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardInfo}>
                <div>
                  <h1>{mockTasks.length}</h1>
                  <p className={styles.text}>Total tasks</p>
                </div>
                <div>
                  <h1>{mockTasks.filter((task) => task.overdue === true).length}</h1>
                  <p className={styles.text}>Overdue tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/* CI/CD Health Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <div className={styles.svgdiv}>
                <CICDHealthIcon width={40} height={40} />
              </div>
              <h1>CI/CD Health</h1>
            </div>
            <div className={styles.cardContent}>
              <h1></h1>
              <h1></h1>
            </div>
          </div>
        </div>

        {/* Projects Focus Section */}
        <div className={styles.tasksSection}>
          <h1 className={styles.sectionTitle}>Projects Focus</h1>
          <div className={styles.gridProjects}>
            {Projects?.map((project) => (
              <div key={project.id} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <div className={styles.taskInfo}>
                    <h1>
                      {project.title}
                      <button>
                        <ArrowRightIcon />
                      </button>
                    </h1>
                    <div className={styles.progressContainer}>
                      <p className={styles.progressText}>{progress(project.title)}%</p>
                      <div className={styles.progressDiv}>
                        <div
                          className={styles.progressBar}
                          style={{ width: progress(project.title) + '%' }}></div>
                      </div>
                      <p>
                        {Math.floor(
                          Tasks.filter(
                            (task) => task.project === project.title && task.success === true,
                          ).length,
                        )}
                        /{Math.floor(Tasks.filter((task) => task.project === project.title).length)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.taskFooter}>
                  <div className={styles.taskMetrics}>
                    <div className={styles.metricButtons}>
                      <button className={`${styles.btnActive}`}>
                        <ActiveIcon />
                        <span className={styles.label}>Active:</span>
                        <span className={styles.value}>{SetStatistikActive(project.title)}</span>
                      </button>

                      <button className={`${styles.btnBlocked}`}>
                        <BlockedIcon />
                        <span className={styles.label}>Blocked:</span>

                        <span className={styles.value}>{SetStatistikBlocked(project.title)}</span>
                      </button>

                      <button className={`${styles.btnOverdue}`}>
                        <OverdueIcon />
                        <span className={styles.label}>Overdue:</span>
                        <span className={styles.value}>{SetStatistikOverdue(project.title)}</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.githubInfo}>
                    <GithubIcon />
                    <span>github:</span>
                    <span className={styles.githubCommits}>
                      commits:{/* {CountOfCommits} */} 10
                    </span>
                    <span className={styles.githubCommits}>PR:{/* {PR} */}7</span>
                    <span className={styles.githubCommits}>CI:{/* {CI} */}2 </span>
                  </div>

                  <div className={styles.actionButtons}>
                    <button className={styles.btnBoard}>
                      <p>Board</p>
                    </button>
                    <button className={styles.btnGithub}>
                      <p>Repo</p>
                    </button>
                    <button className={styles.btnAnalytics}>
                      <p>Analytics</p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Active Tasks */}
        <div className={styles.bottomSection}>
          <div className={styles.myactivetaskSection}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>My Active Tasks</h1>
              <div className={styles.sort}>
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setSortBy('Risk');
                  }}>
                  Risk
                </button>
                <button className={styles.btnSecondary} onClick={() => setSortBy('Dedline')}>
                  Dedline
                </button>
              </div>

              {/* <p className={styles.Overdue}>Overdue: {SetStatistikOverdue(1)}</p> */}
              <button className={styles.btnSecondary}>View All</button>
            </div>
            <div className={styles.mytaskscard}>
              {sort?.map((task) => (
                <div key={task.id}>
                  <div
                    className={
                      task.risk === 'Low Risk'
                        ? styles.Lowcardstatus
                        : task.risk === 'Medium Risk'
                        ? styles.Mediumcardstatus
                        : task.risk === 'Low Hight'
                        ? styles.Hightcardstatus
                        : styles.Hightcardstatus
                    }>
                    {task.risk}
                  </div>
                  <div className={styles.taskInfo}>
                    <p className={styles.taskName}>{task.name}</p>
                    <div className={styles.datesContainer}>
                      <p className={styles.taskCreatedAt}>{task.createdAt}</p>
                      <p className={styles.taskDedline}>{task.dedline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.mystatsSection}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.sectionTitle}>My Stats</h1>
                <button className={styles.btnSecondary}>Show All</button>
              </div>
              <div className={styles.mystatscard}>
                <div className={styles.taskscomplited}>
                  {/* {CountOfCompletedweekTasks} */} Tasks complited this week
                </div>
                <p className={styles.tasksoverdue}>
                  Tasks overdue this week:{/* {CountOfOverdueTasks} */}
                </p>
              </div>
            </div>
            <div className={styles.AiSection}>
              <div className={styles.sectionHeader}>
                <AIIcon width={24} height={24} />
                <h1 className={styles.sectionTitle}>AI Analysis</h1>
              </div>
              {mockAI.map((card) => (
                <div key={card.id}>
                  <div className={styles.AiCard}>
                    <AIIcon width={20} height={20} />
                    <p className={styles.aiName}>{card.name}</p>
                    <p>{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
