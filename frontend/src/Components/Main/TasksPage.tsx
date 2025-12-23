import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import { taskService } from "../../services/taskService.ts";
import type { Task as ApiTask } from "../../services/taskService.ts";
import styles from "../../style/Main/SimplePage.module.scss";

type StatusTone = "info" | "warning" | "success";

type TaskCard = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  due?: string;
  project?: string;
  projectId?: number;
  tone: StatusTone;
};

const STATUS_FILTERS: { id: TaskCard["status"] | "all"; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "in-progress", label: "В работе" },
  { id: "todo", label: "К выполнению" },
  { id: "done", label: "Готово" },
];

const TasksPage: React.FC = () => {
  const user = useSelector(selectUser);
  const [tasks, setTasks] = useState<TaskCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    TaskCard["status"] | "all"
  >("all");

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setError("");
      try {
        // Загружаем реальные задачи, назначенные пользователю или созданные им
        const apiTasks = await taskService.getTasks({ assigned_to: user.id });
        // Преобразуем в TaskCard
        const transformed: TaskCard[] = apiTasks.map((task: ApiTask) => {
          // Определяем статус для отображения
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

          // Определяем tone на основе статуса
          let tone: StatusTone = "info";
          if (status === "done") tone = "success";
          else if (status === "in-progress") tone = "warning";

          // Форматируем дату выполнения
          let due: string | undefined;
          if (task.due_date) {
            const dueDate = new Date(task.due_date);
            const today = new Date();
            const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 0) due = "Сегодня";
            else if (diffDays === 1) due = "Завтра";
            else if (diffDays > 1 && diffDays <= 7) due = `Через ${diffDays} дня`;
            else due = dueDate.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
          }

          // Название проекта (пока неизвестно, нужно загрузить отдельно или из задачи)
          const project = task.project_id ? `Проект ${task.project_id}` : undefined;

          return {
            id: task.id.toString(),
            title: task.title,
            description: task.description || "Описание отсутствует",
            status,
            due,
            project,
            projectId: task.project_id,
            tone,
          };
        });

        setTasks(transformed);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить ваши задания");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user?.id]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return tasks;
    return tasks.filter((t) => t.status === activeFilter);
  }, [tasks, activeFilter]);

  const getToneClass = (tone: StatusTone) => {
    if (tone === "success") return `${styles.badge} ${styles.badgeSuccess}`;
    if (tone === "warning") return `${styles.badge} ${styles.badgeWarning}`;
    return `${styles.badge} ${styles.badgeInfo}`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Мои задания</h1>
        <p className={styles.pageSubtitle}>
          Личные задачи из проектов, в которых вы участвуете.
        </p>
      </div>

      <div className={styles.filtersRow}>
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.id}
            className={`${styles.badge} ${
              activeFilter === filter.id ? styles.badgeInfo : ""
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.card}>Загружаем ваши задания...</div>
      ) : error ? (
        <div className={styles.card}>{error}</div>
      ) : filtered.length === 0 ? (
        <div className={styles.card}>Пока нет задач в этом разделе.</div>
      ) : (
        <div className={styles.cardsGrid}>
          {filtered.map((task) => (
            <div key={task.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{task.title}</h3>
              <p className={styles.cardText}>{task.description}</p>
              <div className={styles.metaRow}>
                <span className={getToneClass(task.tone)}>
                  {task.status === "in-progress"
                    ? "В работе"
                    : task.status === "todo"
                    ? "К выполнению"
                    : "Готово"}
                </span>
                {task.due && (
                  <span className={styles.badge}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M8 7V3M16 7V3M4 11h16M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                    </svg>
                    {task.due}
                  </span>
                )}
                {task.project && (
                  <span className={styles.badge}>Проект: {task.project}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;

