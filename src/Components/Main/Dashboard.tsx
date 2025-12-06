import React from "react";
import styles from "../../style/Main/Dashboard.module.scss";
import { DashboardIconsData } from "../../assets/DashboardIcons/index.js";

interface Suggestion {
  title: string;
  priority: string;
  priorityColor: string;
  description: string;
  time: string;
  tag: string;
  iconType: string;
}

interface Document {
  title: string;
  description: string;
  type: string;
  typeColor: string;
  tags: string[];
  connections: number;
  timeAgo: string;
}

interface ActivityTag {
  name: string;
  count: number;
  color: string;
}

interface WeeklyData {
  day: string;
  value: number;
}

interface DataItem {
  id: number;
  title: string;
  gradient: "blue" | "purple" | "orange" | "green" | "default";
  icon: string;
}

const Dashboard: React.FC = () => {
  const suggestions: Suggestion[] = [
    {
      title: "Оптимизировать планирование спринта",
      priority: "Высокий",
      priorityColor: "#FF8904",
      description:
        "На основе прошлой скорости, предложить скорректировать стори-поинты.",
      time: "15 мин",
      tag: "Продуктивность",
      iconType: "Оптимизация",
    },
    {
      title: "Обновить документацию",
      priority: "Средний",
      priorityColor: "#FDC700",
      description:
        "Конечные точки API изменились в последнем спринте, нужно обновить документацию.",
      time: "30 мин",
      tag: "Документация",
      iconType: "Документы",
    },
    {
      title: "Требуется синхронизация команд",
      priority: "Высокий",
      priorityColor: "#FF8904",
      description: "У команд дизайна и разработки конфликтующие требования.",
      time: "1 час",
      tag: "Коллаборация",
      iconType: "Команды",
    },
    {
      title: "Проверить заблокированные задачи",
      priority: "Критический",
      priorityColor: "#FF6467",
      description: "3 задачи заблокированы более 48 часов",
      time: "20 мин",
      tag: "Блокеры",
      iconType: "Проверка",
    },
  ];

  const documents: Document[] = [
    {
      title: "Стратегия продукта 2025",
      description: "Ключевые цели на Q1-Q4, включая расширение рынка...",
      type: "Документ",
      typeColor: "#51A2FF",
      tags: ["#продукт", "#стратегия"],
      connections: 8,
      timeAgo: "2 дня назад",
    },
    {
      title: "Гайдлайны дизайн-системы",
      description: "Полное руководство по компонентам, цветам и паттернам...",
      type: "Вики",
      typeColor: "#C27AFF",
      tags: ["#дизайн", "#ui"],
      connections: 15,
      timeAgo: "1 неделю назад",
    },
    {
      title: "Архитектура API",
      description: "Паттерны RESTful API и лучшие практики...",
      type: "Технический",
      typeColor: "#05DF72",
      tags: ["#разработка", "#api"],
      connections: 12,
      timeAgo: "3 дня назад",
    },
    {
      title: "Результаты пользовательских исследований",
      description: "Инсайты из 50+ интервью и опросов пользователей...",
      type: "Исследование",
      typeColor: "#FF8904",
      tags: ["#продукт", "#ux"],
      connections: 6,
      timeAgo: "5 дней назад",
    },
  ];

  const activityTags: ActivityTag[] = [
    { name: "Глубокая работа", count: 12, color: "#AD46FF" },
    { name: "Встречи", count: 8, color: "#2B7FFF" },
    { name: "Code Review", count: 15, color: "#00C950" },
    { name: "Планирование", count: 6, color: "#F0B100" },
    { name: "Исследование", count: 9, color: "#F6339A" },
  ];

  const weeklyData: WeeklyData[] = [
    { day: "П", value: 75 },
    { day: "В", value: 82 },
    { day: "С", value: 68 },
    { day: "Ч", value: 91 },
    { day: "П", value: 88 },
    { day: "С", value: 45 },
    { day: "В", value: 32 },
  ];

  const renderIcon = (icon: string) => {
    return <div dangerouslySetInnerHTML={{ __html: icon }} />;
  };

  const getSuggestionIcon = (iconType: string) => {
    // Ищем иконку по типу в данных SmartSuggestions
    const iconData = DashboardIconsData.SmartSuggestions.find(
      (item) => item.title === iconType
    );

    // Если не найдено, используем первую иконку
    return iconData || DashboardIconsData.SmartSuggestions[0];
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardContent}>
        <div className={styles.dashboardRow}>
          <div className={`${styles.panel} ${styles.neuralNetworkPanel}`}>
            <div className={styles.panelHeader}>
              <div className={styles.titleContainer}>
                <div
                  className={styles.neuralIcon}
                  data-gradient={DashboardIconsData.NeuralNetwork[0].gradient}
                >
                  {renderIcon(DashboardIconsData.NeuralNetwork[0].icon)}
                </div>
                <h2>{DashboardIconsData.NeuralNetwork[0].title}</h2>
              </div>
              <button className={styles.iconButton}>
                <div>
                  {renderIcon(DashboardIconsData.NeuralNetwork[1].icon)}
                </div>
              </button>
            </div>

            <div className={styles.graphContainer}>
              <div className={styles.graphImage}></div>
              <div className={styles.graphOverlay}>
                <div className={styles.overlayItem}>
                  <div
                    className={styles.colorDot}
                    style={{ backgroundColor: "#667EEA" }}
                  ></div>
                  <span>Проекты</span>
                </div>
                <div className={styles.overlayItem}>
                  <div
                    className={styles.colorDot}
                    style={{ backgroundColor: "#764BA2" }}
                  ></div>
                  <span>Документы</span>
                </div>
                <div className={styles.overlayItem}>
                  <div
                    className={styles.colorDot}
                    style={{ backgroundColor: "#EC4899" }}
                  ></div>
                  <span>Задачи</span>
                </div>
              </div>
            </div>

            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>24</div>
                <div className={styles.statLabel}>Связей</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>8</div>
                <div className={styles.statLabel}>Узлов</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>94%</div>
                <div className={styles.statLabel}>Состояние</div>
              </div>
            </div>
          </div>

          <div className={`${styles.panel} ${styles.suggestionsPanel}`}>
            <div className={styles.panelHeader}>
              <div className={styles.titleContainer}>
                <div
                  className={styles.suggestionsIcon}
                  data-gradient={
                    DashboardIconsData.SmartSuggestions[0].gradient
                  }
                >
                  {renderIcon(DashboardIconsData.SmartSuggestions[0].icon)}
                </div>
                <div>
                  <h2>{DashboardIconsData.SmartSuggestions[0].title}</h2>
                  <p className={styles.subtitle}>Рекомендации на основе ИИ</p>
                </div>
              </div>
            </div>

            <div className={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => {
                const iconData = getSuggestionIcon(suggestion.iconType);
                return (
                  <div key={index} className={styles.suggestionItem}>
                    <div className={styles.suggestionHeader}>
                      <div
                        className={styles.suggestionIcon}
                        data-gradient={iconData.gradient}
                      >
                        {renderIcon(iconData.icon)}
                      </div>
                      <div className={styles.suggestionContent}>
                        <div className={styles.suggestionTitleRow}>
                          <h3>{suggestion.title}</h3>
                          <div
                            className={styles.priorityBadge}
                            style={{
                              backgroundColor: `${suggestion.priorityColor}20`,
                              borderColor: `${suggestion.priorityColor}30`,
                            }}
                          >
                            <span style={{ color: suggestion.priorityColor }}>
                              {suggestion.priority}
                            </span>
                          </div>
                        </div>
                        <p className={styles.suggestionDescription}>
                          {suggestion.description}
                        </p>
                        <div className={styles.suggestionFooter}>
                          <div className={styles.timeTag}>
                            <div className={styles.clockIcon}></div>
                            <span>{suggestion.time}</span>
                          </div>
                          <div className={styles.categoryTag}>
                            <span>{suggestion.tag}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.panelFooter}>
              <span className={styles.footerText}>
                12 предложений на этой неделе
              </span>
              <button className={styles.viewAllButton}>Смотреть все</button>
            </div>
          </div>
        </div>

        <div className={styles.dashboardRow}>
          <div className={`${styles.panel} ${styles.knowledgePanel}`}>
            <div className={styles.panelHeader}>
              <div className={styles.titleContainer}>
                <div
                  className={styles.knowledgeIcon}
                  data-gradient={DashboardIconsData.KnowledgeGraph[0].gradient}
                >
                  {renderIcon(DashboardIconsData.KnowledgeGraph[0].icon)}
                </div>
                <div>
                  <h2>{DashboardIconsData.KnowledgeGraph[0].title}</h2>
                  <p className={styles.subtitle}>Связанная информация</p>
                </div>
              </div>
            </div>

            <div className={styles.filtersContainer}>
              <div className={styles.quickFilters}>
                <div
                  className={styles.filterIcon}
                  data-gradient={DashboardIconsData.KnowledgeGraph[1].gradient}
                >
                  {renderIcon(DashboardIconsData.KnowledgeGraph[1].icon)}
                </div>
                <span>{DashboardIconsData.KnowledgeGraph[1].title}</span>
              </div>
              <div className={styles.filterButtons}>
                <button className={`${styles.filterButton} ${styles.active}`}>
                  продукт <span className={styles.count}>(12)</span>
                </button>
                <button className={styles.filterButton}>
                  дизайн <span className={styles.count}>(8)</span>
                </button>
                <button className={styles.filterButton}>
                  разработка <span className={styles.count}>(15)</span>
                </button>
                <button className={styles.filterButton}>
                  исследование <span className={styles.count}>(6)</span>
                </button>
              </div>
            </div>

            <div className={styles.documentsList}>
              {documents.map((doc, index) => (
                <div key={index} className={styles.documentItem}>
                  <div className={styles.documentHeader}>
                    <h3>{doc.title}</h3>
                    <div className={styles.documentIcon}></div>
                  </div>
                  <p className={styles.documentDescription}>
                    {doc.description}
                  </p>
                  <div className={styles.documentFooter}>
                    <div className={styles.documentTags}>
                      <div
                        className={styles.typeTag}
                        style={{ backgroundColor: `${doc.typeColor}20` }}
                      >
                        <span style={{ color: doc.typeColor }}>{doc.type}</span>
                      </div>
                      {doc.tags.map((tag, i) => (
                        <div key={i} className={styles.hashTag}>
                          <span>{tag}</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.documentMeta}>
                      <div className={styles.connections}>
                        <div className={styles.connectionIcon}></div>
                        <span>{doc.connections}</span>
                      </div>
                      <span className={styles.timeAgo}>{doc.timeAgo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.panelFooter}>
              <span className={styles.footerText}>
                147 документов проиндексировано
              </span>
              <button className={styles.exploreButton}>
                Исследовать граф
                <div className={styles.exploreIcon}></div>
              </button>
            </div>
          </div>

          <div className={`${styles.panel} ${styles.flowPanel}`}>
            <div className={styles.panelHeader}>
              <div className={styles.titleContainer}>
                <div
                  className={styles.flowIcon}
                  data-gradient={DashboardIconsData.FlowDashboard[0].gradient}
                >
                  {renderIcon(DashboardIconsData.FlowDashboard[0].icon)}
                </div>
                <div>
                  <h2>{DashboardIconsData.FlowDashboard[0].title}</h2>
                  <p className={styles.subtitle}>Пульс вашей эффективности</p>
                </div>
              </div>
            </div>

            <div className={styles.metricsContainer}>
              {DashboardIconsData.FlowDashboard.slice(1).map(
                (item: DataItem) => (
                  <div key={item.id} className={styles.metricCard}>
                    <div
                      className={styles.metricIcon}
                      data-gradient={item.gradient}
                    >
                      <div className={styles.iconInner}>
                        {renderIcon(item.icon)}
                      </div>
                    </div>
                    <div className={styles.metricValue}>
                      {item.id === 2 ? "6.5ч" : item.id === 3 ? "24" : "94%"}
                    </div>
                    <div className={styles.metricLabel}>{item.title}</div>
                    <div className={styles.metricTrend}>
                      {item.id === 2
                        ? "+12% на этой неделе"
                        : item.id === 3
                        ? "+8 на этой неделе"
                        : "+5% на этой неделе"}
                    </div>
                  </div>
                )
              )}
            </div>

            <div className={styles.activityContainer}>
              <div className={styles.activityHeader}>
                <div className={styles.activityIcon}></div>
                <h3>Активность за неделю</h3>
                <span className={styles.timeRange}>Эта неделя</span>
              </div>
              <div className={styles.weeklyChart}>
                {weeklyData.map((day, index) => (
                  <div key={index} className={styles.chartColumn}>
                    <div
                      className={styles.chartBar}
                      style={{ height: `${day.value}%` }}
                    ></div>
                    <div className={styles.chartLabel}>{day.day}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.tagsContainer}>
              <div className={styles.tagsHeader}>
                <div className={styles.tagsIcon}></div>
                <h3>Теги активности</h3>
              </div>
              <div className={styles.tagsList}>
                {activityTags.map((tag, index) => (
                  <div key={index} className={styles.activityTag}>
                    <div
                      className={styles.tagColor}
                      style={{ backgroundColor: tag.color }}
                    ></div>
                    <span className={styles.tagName}>{tag.name}</span>
                    <span className={styles.tagCount}>({tag.count})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.panelFooter}>
              <span className={styles.footerText}>
                Итого: 42.5 часов на этой неделе
              </span>
              <button className={styles.viewDetailsButton}>Подробнее</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
