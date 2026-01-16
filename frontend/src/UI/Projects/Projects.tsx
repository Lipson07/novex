import { useState } from 'react';
import { AccountIcon, LogoutIcon, NotificationIcon, SearchIcon, SettingsIcon } from '../Icons';
import styles from './Projects.module.scss';
import { ProjectsData } from './Projects.Mockdata';
import { mockUsers } from '../../MockData/UsersMock';
import AccountSettings from '../AccountSettings/AccountSettings';
export default function Projects() {
  const [isopenProfile, setIsopenProfile] = useState(false);
  const [isOpenAccountSettings, setIsOpenAccountSettings] = useState(false);

  function OpenModalProfile() {
    isopenProfile === false ? setIsopenProfile(true) : setIsopenProfile(false);
  }
  function openAccountSettings() {
    setIsOpenAccountSettings(!isOpenAccountSettings);
  }
  return (
    <div className={styles.ProjectContainer}>
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
        <h1>Projects</h1>
        <div className={styles.filterall}>
          <button className={styles.Allprojetcs}>
            <p>All Projects</p>
            <p className={styles.countProjects}>{ProjectsData.length}</p>
          </button>
          <button className={styles.ActiveProjetcs}>
            <p>Active</p>
            <p className={styles.countProjects}>
              {ProjectsData.filter((project) => project.status === 'Active').length}
            </p>
          </button>
          <button className={styles.PausedProjetcs}>
            <p>Paused</p>
            <p className={styles.countProjects}>
              {ProjectsData.filter((project) => project.status === 'Paused').length}
            </p>
          </button>
          <button className={styles.CompletedProjetcs}>
            <p>At Risk</p>
            <p className={styles.countProjects}>
              {ProjectsData.filter((project) => project.status === 'Risk').length}
            </p>
          </button>
          <button className={styles.CompletedProjetcs}>
            <p>Completed</p>
            <p className={styles.countProjects}>
              {ProjectsData.filter((project) => project.status === 'Completed').length}
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}
