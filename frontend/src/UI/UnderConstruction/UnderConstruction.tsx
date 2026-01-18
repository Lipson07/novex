import React from 'react';
import styles from './UnderConstruction.module.scss';
import { CodeIcon, WarningIcon, SettingsIcon } from '../Icons';

export default function UnderConstruction() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            <CodeIcon width={48} height={48} className={styles.mainIcon} />
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Страница в разработке</h1>
            <p className={styles.subtitle}>
              Данный раздел находится в стадии разработки и будет доступен в ближайшее время.
            </p>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <WarningIcon width={20} height={20} className={styles.cardIcon} />
            <span className={styles.cardTitle}>Статус разработки</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Этап</div>
              <div className={styles.statusValue}>В разработке</div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Тип работ</div>
              <div className={styles.statusValue}>Технические работы</div>
            </div>
          </div>
        </div>

        <div className={styles.actionsGrid}>
          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <CodeIcon width={24} height={24} />
            </div>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>Разработка</div>
              <div className={styles.actionDescription}>Ведется активная разработка функционала</div>
            </div>
          </div>

          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <SettingsIcon width={24} height={24} />
            </div>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>Тестирование</div>
              <div className={styles.actionDescription}>Проводятся тесты и оптимизация</div>
            </div>
          </div>

          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <WarningIcon width={24} height={24} />
            </div>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>Обновление</div>
              <div className={styles.actionDescription}>Подготовка к релизу новой версии</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
