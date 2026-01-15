import React, { useState } from 'react';
import styles from './AccountSettings.module.scss';
import type { UserInterface } from '../Home/Home.Interface';
import { CloseIcon, LogoIcon, LogoutIcon } from '../Icons';
export default function AccountSettings({ onclose }) {
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
  return (
    <>
      <div className={styles.overlay} onClick={onclose}></div>
      <div className={styles.allAccountSettings}>
        <div className={styles.header} onClick={onclose}>
          <h1>Account Settings</h1>
          <div className={styles.icon}>
            <CloseIcon />
          </div>
        </div>

        {mockUsers.map(
          (user) =>
            user.role === 'Admin' && (
              <div className={styles.userInfo}>
                <div className={styles.allinfo}>
                  <div className={styles.info}>
                    <p>Name</p>
                    <div>{user.name}</div>
                    <button>Change</button>
                  </div>
                  <div className={styles.info}>
                    <p>Role</p>
                    <div>{user.role}</div>
                    <button>Change</button>
                  </div>
                  <div className={styles.info}>
                    <p>Email</p>
                    <div>{user.email}</div>
                    <button>Change</button>
                  </div>
                  <div className={styles.info}>
                    <p>Password</p>
                    <div>{user.password}</div>
                    <button>Change</button>
                  </div>
                </div>
                <div className={styles.logOut}>
                  <p>Loh out</p>
                  <button className={styles.logOutBtn}>
                    <p>Loh out</p>
                  </button>
                </div>
                <div className={styles.logOut}>
                  <p>Delete account</p>
                  <button className={styles.logOutBtn}>
                    <p>Delete account</p>
                  </button>
                </div>
              </div>
            ),
        )}
      </div>
    </>
  );
}
