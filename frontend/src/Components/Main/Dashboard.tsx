import React, { useState, useMemo, useEffect } from "react";
import styles from "../../style/Main/Dashboard.module.scss";
import { taskService } from "../../services/taskService.ts";
import type { Task as ApiTask } from "../../services/taskService.ts";

interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
  assignee: string;
  assigneeAvatar?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high" | "critical";
}

interface DashboardProps {
  projectId?: number;
  refreshKey?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ projectId, refreshKey }) => {
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high" | "critical"
  >("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция загрузки задач с бэкенда
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (projectId) {
        params.project_id = projectId;
      }
      const data = await taskService.getTasks(params);
      // Преобразование данных из API в интерфейс компонента
      const transformed: Task[] = data.map((task: ApiTask) => {
        // Маппинг статуса
        let status: "todo" | "in-progress" | "done";
        switch (task.status?.toLowerCase()) {
          case "completed":
          case "done":
            status = "done";
            break;
          case "in_progress":
          case "in-progress":
            status = "in-progress";
            break;
          default:
            status = "todo";
        }

        // Маппинг приоритета (ожидаем low, medium, high, critical)
        const priority = task.priority as
          | "low"
          | "medium"
          | "high"
          | "critical";

        // Имя назначенного
        const assigneeName = task.assignee?.name || "Не назначено";
        // Аватар - первые буквы имени
        const assigneeAvatar = assigneeName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        // Дата в формате YYYY-MM-DD
        const dueDate = task.due_date ? task.due_date.split(" ")[0] : undefined;

        return {
          id: task.id,
          title: task.title,
          status,
          assignee: assigneeName,
          assigneeAvatar,
          dueDate,
          priority,
        };
      });
      setTasks(transformed);
      setError(null);
    } catch (err) {
      console.error("Ошибка загрузки задач:", err);
      setError("Не удалось загрузить задачи. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // Загрузка задач с бэкенда
  useEffect(() => {
    fetchTasks();
  }, [projectId, refreshKey]);

  const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };

  // Фильтрация и сортировка задач
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Фильтрация по приоритету
    if (priorityFilter !== "all") {
      filtered = tasks.filter((task) => task.priority === priorityFilter);
    }

    // Сортировка от менее важных к критически важным (asc) или наоборот (desc)
    const sorted = [...filtered].sort((a, b) => {
      const orderA = priorityOrder[a.priority];
      const orderB = priorityOrder[b.priority];
      return sortOrder === "asc" ? orderA - orderB : orderB - orderA;
    });

    return sorted;
  }, [tasks, priorityFilter, sortOrder]);

  const handleEditTask = (taskId: number) => {
    console.log("Редактирование задачи", taskId);
    // TODO: открыть модальное окно редактирования задачи
    alert(`Редактирование задачи ${taskId} (заглушка)`);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (
      !confirm(
        "Вы уверены, что хотите удалить задачу? Это действие нельзя отменить."
      )
    ) {
      return;
    }
    try {
      console.log("Удаление задачи", taskId);
      // Вызов API удаления задачи
      await taskService.deleteTask(taskId);
      // Оптимистичное обновление: удаляем задачу из локального состояния
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      // Перезагружаем задачи с сервера для синхронизации
      await fetchTasks();
      // Можно показать уведомление, но не обязательно
      // alert(`Задача ${taskId} удалена`);
    } catch (error) {
      console.error("Ошибка удаления задачи:", error);
      alert("Не удалось удалить задачу");
      // В случае ошибки перезагружаем задачи, чтобы восстановить состояние
      fetchTasks();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "#667EEA";
      case "in-progress":
        return "#FDC700";
      case "done":
        return "#05DF72";
      default:
        return "#667EEA";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "todo":
        return "К выполнению";
      case "in-progress":
        return "В работе";
      case "done":
        return "Выполнено";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#FF6467";
      case "high":
        return "#FF8C42";
      case "medium":
        return "#FDC700";
      case "low":
        return "#667EEA";
      default:
        return "#667EEA";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "critical":
        return "Критический";
      case "high":
        return "Высокий";
      case "medium":
        return "Средний";
      case "low":
        return "Низкий";
      default:
        return priority;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    const color = getStatusColor(status);
    return {
      backgroundColor: `${color}20`,
      borderColor: `${color}40`,
      color: color,
      border: "2px solid",
      padding: "4px 12px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    };
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardContent}>
        {/* Панель задач */}
        <div className={`${styles.panel} ${styles.tasksPanel}`}>
          <div className={styles.panelHeader}>
            <div className={styles.titleContainer}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4.16663 10H15.8333M10 4.16675V15.8334" />
              </svg>
              <h2>Задачи</h2>
            </div>
          </div>

          {/* Фильтры и сортировка */}
          <div className={styles.filtersContainer}>
            <div className={styles.priorityFilters}>
              <button
                className={`${styles.filterButton} ${
                  priorityFilter === "all" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setPriorityFilter("all")}
              >
                Все
              </button>
              <button
                className={`${styles.filterButton} ${
                  priorityFilter === "low" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setPriorityFilter("low")}
                style={{
                  backgroundColor:
                    priorityFilter === "low"
                      ? `${getPriorityColor("low")}20`
                      : "transparent",
                  borderColor:
                    priorityFilter === "low"
                      ? getPriorityColor("low")
                      : "rgba(255, 255, 255, 0.1)",
                  color:
                    priorityFilter === "low"
                      ? getPriorityColor("low")
                      : "rgba(255, 255, 255, 0.6)",
                }}
              >
                Низкий
              </button>
              <button
                className={`${styles.filterButton} ${
                  priorityFilter === "medium" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setPriorityFilter("medium")}
                style={{
                  backgroundColor:
                    priorityFilter === "medium"
                      ? `${getPriorityColor("medium")}20`
                      : "transparent",
                  borderColor:
                    priorityFilter === "medium"
                      ? getPriorityColor("medium")
                      : "rgba(255, 255, 255, 0.1)",
                  color:
                    priorityFilter === "medium"
                      ? getPriorityColor("medium")
                      : "rgba(255, 255, 255, 0.6)",
                }}
              >
                Средний
              </button>
              <button
                className={`${styles.filterButton} ${
                  priorityFilter === "high" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setPriorityFilter("high")}
                style={{
                  backgroundColor:
                    priorityFilter === "high"
                      ? `${getPriorityColor("high")}20`
                      : "transparent",
                  borderColor:
                    priorityFilter === "high"
                      ? getPriorityColor("high")
                      : "rgba(255, 255, 255, 0.1)",
                  color:
                    priorityFilter === "high"
                      ? getPriorityColor("high")
                      : "rgba(255, 255, 255, 0.6)",
                }}
              >
                Высокий
              </button>
              <button
                className={`${styles.filterButton} ${
                  priorityFilter === "critical" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setPriorityFilter("critical")}
                style={{
                  backgroundColor:
                    priorityFilter === "critical"
                      ? `${getPriorityColor("critical")}20`
                      : "transparent",
                  borderColor:
                    priorityFilter === "critical"
                      ? getPriorityColor("critical")
                      : "rgba(255, 255, 255, 0.1)",
                  color:
                    priorityFilter === "critical"
                      ? getPriorityColor("critical")
                      : "rgba(255, 255, 255, 0.6)",
                }}
              >
                Критический
              </button>
            </div>
            <button
              className={styles.sortButton}
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"} Сортировка
            </button>
          </div>

          {loading ? (
            <div className={styles.tasksList}>
              <div
                className={styles.taskItem}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "2rem",
                }}
              >
                Загрузка задач...
              </div>
            </div>
          ) : error ? (
            <div className={styles.tasksList}>
              <div
                className={styles.taskItem}
                style={{ borderLeftColor: "#FF6467", color: "#FF6467" }}
              >
                {error}
              </div>
            </div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className={styles.tasksList}>
              <div
                className={styles.taskItem}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "2rem",
                }}
              >
                Нет задач для отображения
              </div>
            </div>
          ) : (
            <div className={styles.tasksList}>
              {filteredAndSortedTasks.map((task) => (
                <div
                  key={task.id}
                  className={styles.taskItem}
                  style={{
                    borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                  }}
                >
                  <div className={styles.taskHeader}>
                    <div className={styles.taskStatus}>
                      <span style={getStatusBadgeStyle(task.status)}>
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: getStatusColor(task.status),
                            display: "inline-block",
                          }}
                        />
                        {getStatusText(task.status)}
                      </span>
                    </div>
                    <div
                      className={styles.priorityBadge}
                      style={{
                        backgroundColor: `${getPriorityColor(task.priority)}20`,
                        borderColor: getPriorityColor(task.priority),
                        color: getPriorityColor(task.priority),
                      }}
                    >
                      {getPriorityText(task.priority)}
                    </div>
                    {/* Кнопки редактирования и удаления задачи */}
                    <div className={styles.taskActions}>
                      <button
                        className={styles.taskActionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTask(task.id);
                        }}
                        title="Редактировать задачу"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className={styles.taskActionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        title="Удалить задачу"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 className={styles.taskTitle}>{task.title}</h3>
                  <div className={styles.taskFooter}>
                    <div className={styles.taskAssignee}>
                      <div className={styles.assigneeAvatar}>
                        {task.assigneeAvatar ||
                          task.assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                      </div>
                      <span>{task.assignee}</span>
                    </div>
                    {task.dueDate && (
                      <span className={styles.taskDueDate}>
                        {new Date(task.dueDate).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
