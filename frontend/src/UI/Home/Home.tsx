import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { Tabs } from './Data';
import { Link } from 'react-router-dom';
import type { UserInterface } from './Home.Interface';

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
  ArrowUpIcon,
  ArrowDownIcon,
} from '../Icons';
import { ProjectsData } from '../Projects/Projects.Mockdata';
import { Tasks, type TaskInterface } from '../../Tasks/Tasks.mockData';
import AccountSettings from '../AccountSettings/AccountSettings';
import { mockUsers } from '../../MockData/UsersMock';

export default function Home() {
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
  const [users, setUser] = useState([mockUsers]);
  const [mockTasks, setMockTasks] = useState(Tasks);
  const [sortBy, setSortBy] = useState('Dedline');
  const [sort, setSort] = useState([]);
  const [isopenProfile, setIsopenProfile] = useState(false);
  const [isOpenAccountSettings, setIsOpenAccountSettings] = useState(false);
  const [isSortRisk, setIsSortRisk] = useState(true);
  const [isSortDedline, setIsSortDedline] = useState(true);
  const progress = (id: number) => {
    return Math.floor(
      (mockTasks.filter((task) => task.projectId === id && task.status === 'completed').length /
        mockTasks.filter((task) => task.projectId === id).length) *
        100,
    );
  };

  function sorty() {
    const copyMockTasks = [...mockTasks];
    if (sortBy === 'Dedline') {
      const SortByDedline = copyMockTasks.sort((a, b) => {
        const dedlineA = parseInt(a.deadline);
        const dedlineB = parseInt(b.deadline);
        return isSortDedline ? dedlineA - dedlineB : dedlineB - dedlineA;
      });
      setSort(SortByDedline);
    }

    if (sortBy === 'Risk') {
      const sortByRisk = copyMockTasks.sort((a, b) => {
        const RiskA = a.priority === 'low' ? 1 : a.priority === 'medium' ? 2 : 3;
        const RiskB = b.priority === 'low' ? 1 : b.priority === 'medium' ? 2 : 3;
        return isSortRisk ? RiskA - RiskB : RiskB - RiskA;
      });
      setSort(sortByRisk);
    }
  }
  useEffect(() => {
    sorty();
  }, [mockTasks, sortBy, isSortDedline, isSortRisk]);
  function openAccountSettings() {
    setIsOpenAccountSettings(!isOpenAccountSettings);
  }

  function SetStatistikActive(id: number) {
    return Math.floor(
      mockTasks.filter((task) => task.projectId === id && task.status === 'active').length,
    );
  }

  function SetStatistikBlocked(id: number) {
    return Math.floor(
      mockTasks.filter((task) => task.projectId === id && task.status === 'blocked').length,
    );
  }
  function SetStatistikOverdue(id: number) {
    return Math.floor(
      mockTasks.filter((task) => task.projectId === id && task.status === 'overdue').length,
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
                  {isopenProfile && (
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
              <div className={`${styles.svgdiv} ${styles.projectsIcon}`}>
                <ProjectsIcon width={32} height={32} />
              </div>
              <div className={styles.headerTitle}>
                <h1>Company Projects</h1>
                <p className={styles.cardSubtitle}>Status overview</p>
              </div>
              <div className={styles.totalBadge}>
                <span>{ProjectsData.length}</span>
                <span>Total</span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.projectsGrid}>
                <div className={`${styles.projectStatus} ${styles.active}`}>
                  <div className={styles.statusHeader}>
                    <ActiveIcon className={styles.statusIcon} />
                    <span className={styles.statusCount}>
                      {ProjectsData.filter((project) => project.status === 'Active').length}
                    </span>
                  </div>
                  <p className={styles.statusLabel}>Active</p>
                  <div className={styles.statusBar}>
                    <div
                      className={styles.statusBarFill}
                      style={{
                        width: `${
                          (ProjectsData.filter((p) => p.status === 'Active').length /
                            ProjectsData.length) *
                            100 || 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className={`${styles.projectStatus} ${styles.paused}`}>
                  <div className={styles.statusHeader}>
                    <PauseIconRounded className={styles.statusIcon} />
                    <span className={styles.statusCount}>
                      {ProjectsData.filter((project) => project.status === 'Paused').length}
                    </span>
                  </div>
                  <p className={styles.statusLabel}>Paused</p>
                  <div className={styles.statusBar}>
                    <div
                      className={styles.statusBarFill}
                      style={{
                        width: `${
                          (ProjectsData.filter((p) => p.status === 'Paused').length /
                            ProjectsData.length) *
                            100 || 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className={`${styles.projectStatus} ${styles.risk}`}>
                  <div className={styles.statusHeader}>
                    <WarningIcon className={styles.statusIcon} />
                    <span className={styles.statusCount}>
                      {ProjectsData.filter((project) => project.status === 'Risk').length}
                    </span>
                  </div>
                  <p className={styles.statusLabel}>At Risk</p>
                  <div className={styles.statusBar}>
                    <div
                      className={styles.statusBarFill}
                      style={{
                        width: `${
                          (ProjectsData.filter((p) => p.status === 'Risk').length /
                            ProjectsData.length) *
                            100 || 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Teams Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.svgdiv} ${styles.teamsIcon}`}>
                <TeamIcon width={32} height={32} />
              </div>
              <div className={styles.headerTitle}>
                <h1>Company Teams</h1>
                <p className={styles.cardSubtitle}>Online members</p>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.teamsStats}>
                <div className={styles.statBlock}>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Total Members</span>
                    <span className={styles.statValue}>{mockUsers.length}</span>
                  </div>
                  <div className={styles.statProgress}>
                    <div className={styles.statProgressFill} style={{ width: '100%' }} />
                  </div>
                </div>

                <div className={styles.statBlock}>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Currently Online</span>
                    <div className={styles.onlineStat}>
                      <span className={`${styles.statValue} ${styles.onlineValue}`}>
                        {mockUsers.filter((user) => user.online).length}
                      </span>
                    </div>
                  </div>
                  <div className={styles.statProgress}>
                    <div
                      className={`${styles.statProgressFill} ${styles.onlineProgress}`}
                      style={{
                        width: `${
                          (mockUsers.filter((u) => u.online).length / mockUsers.length) * 100 || 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.onlineUsers}>
                <div className={styles.avatarsRow}>
                  {mockUsers
                    .filter((user) => user.online)
                    .slice(0, 6)
                    .map((user) => (
                      <div key={user.userid} className={styles.avatarWrapper}>
                        <AccountIcon className={styles.avatar} />
                      </div>
                    ))}
                  {mockUsers.filter((user) => user.online).length > 6 && (
                    <div className={styles.moreUsers}>
                      +{mockUsers.filter((user) => user.online).length - 6}
                    </div>
                  )}
                </div>
                <p className={styles.onlineHint}>
                  {mockUsers.filter((u) => u.online).length} of {mockUsers.length} online
                </p>
              </div>
            </div>
          </div>

          {/* Global Metrics Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.svgdiv} ${styles.metricsIcon}`}>
                <MetricsIcon width={32} height={32} />
              </div>
              <div className={styles.headerTitle}>
                <h1>Global Metrics</h1>
                <p className={styles.cardSubtitle}>Task performance</p>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.metricsOverview}>
                <div className={styles.metricItem}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricNumber}>{mockTasks.length}</span>
                    <div className={`${styles.metricTrend} ${styles.neutral}`}>
                      <span>Total</span>
                    </div>
                  </div>
                  <p className={styles.metricDescription}>All tasks in system</p>
                </div>

                <div className={styles.metricDivider} />

                <div className={styles.metricItem}>
                  <div className={styles.metricHeader}>
                    <span className={`${styles.metricNumber} ${styles.overdue}`}>
                      {mockTasks.filter((task) => task.status === 'overdue').length}
                    </span>
                    <div className={`${styles.metricTrend} ${styles.negative}`}>
                      <span>Overdue</span>
                    </div>
                  </div>
                  <p className={styles.metricDescription}>Require attention</p>
                </div>
              </div>

              <div className={styles.tasksProgress}>
                <div className={styles.progressInfo}>
                  <span className={styles.progressLabel}>On Time</span>
                  <span className={styles.progressValue}>
                    {Math.round(
                      ((mockTasks.length - mockTasks.filter((t) => t.status === 'overdue').length) /
                        mockTasks.length) *
                        100 || 0,
                    )}
                    %
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      width: `${
                        ((mockTasks.length -
                          mockTasks.filter((t) => t.status === 'overdue').length) /
                          mockTasks.length) *
                          100 || 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CI/CD Health Card */}
          <div className={styles.metricCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.svgdiv} ${styles.cicdIcon}`}>
                <CICDHealthIcon width={32} height={32} />
              </div>
              <div className={styles.headerTitle}>
                <h1>CI/CD Health</h1>
                <p className={styles.cardSubtitle}>Pipeline status</p>
              </div>
              <div className={styles.healthScore}>
                <span>85%</span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.pipelineStats}>
                <div className={styles.pipelineItem}>
                  <div className={`${styles.statusIndicator} ${styles.success}`} />
                  <div className={styles.pipelineInfo}>
                    <span className={styles.pipelineCount}>24</span>
                    <span className={styles.pipelineLabel}>Successful</span>
                  </div>
                </div>

                <div className={styles.pipelineItem}>
                  <div className={`${styles.statusIndicator} ${styles.failed}`} />
                  <div className={styles.pipelineInfo}>
                    <span className={styles.pipelineCount}>3</span>
                    <span className={styles.pipelineLabel}>Failed</span>
                  </div>
                </div>

                <div className={styles.pipelineItem}>
                  <div className={`${styles.statusIndicator} ${styles.running}`} />
                  <div className={styles.pipelineInfo}>
                    <span className={styles.pipelineCount}>2</span>
                    <span className={styles.pipelineLabel}>Running</span>
                  </div>
                </div>
              </div>

              <div className={styles.deploymentFrequency}>
                <div className={styles.deploymentHeader}>
                  <span className={styles.deploymentLabel}>Avg. deployment time</span>
                  <span className={styles.deploymentValue}>12m 34s</span>
                </div>
                <div className={styles.deploymentBar}>
                  <div className={styles.deploymentBarFill} style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Focus Section */}
        <div className={styles.tasksSection}>
          <h1 className={styles.sectionTitle}>Projects Focus</h1>
          <div className={styles.gridProjects}>
            {ProjectsData?.map((project) => (
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
                      <p className={styles.progressText}>{progress(project.id)}%</p>
                      <div className={styles.progressDiv}>
                        <div
                          className={styles.progressBar}
                          style={{ width: progress(project.id) + '%' }}></div>
                      </div>
                      <p>
                        {Math.floor(
                          Tasks.filter(
                            (task) => task.projectId === project.id && task.status === 'completed',
                          ).length,
                        )}
                        /{Math.floor(Tasks.filter((task) => task.projectId === project.id).length)}
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
                        <span className={styles.value}>{SetStatistikActive(project.id)}</span>
                      </button>

                      <button className={`${styles.btnBlocked}`}>
                        <BlockedIcon />
                        <span className={styles.label}>Blocked:</span>

                        <span className={styles.value}>{SetStatistikBlocked(project.id)}</span>
                      </button>

                      <button className={`${styles.btnOverdue}`}>
                        <OverdueIcon />
                        <span className={styles.label}>Overdue:</span>
                        <span className={styles.value}>{SetStatistikOverdue(project.id)}</span>
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
                    setIsSortRisk(!isSortRisk);
                  }}>
                  <p>Risk</p>
                  {isSortRisk ? <ArrowDownIcon /> : <ArrowUpIcon />}
                </button>
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setSortBy('Dedline');
                    setIsSortDedline(!isSortDedline);
                  }}>
                  <p>Dedline</p>
                  {isSortDedline ? <ArrowDownIcon /> : <ArrowUpIcon />}
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
                      task.priority === 'low'
                        ? styles.Lowcardstatus
                        : task.priority === 'medium'
                        ? styles.Mediumcardstatus
                        : task.priority === 'high'
                        ? styles.Hightcardstatus
                        : styles.Hightcardstatus
                    }>
                    {task.priority}
                  </div>
                  <div className={styles.taskInfo}>
                    <p className={styles.taskName}>{task.name}</p>
                    <div className={styles.datesContainer}>
                      <p className={styles.taskCreatedAt}>{task.createdAt}</p>
                      <p className={styles.taskDedline}>{task.deadline}</p>
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
