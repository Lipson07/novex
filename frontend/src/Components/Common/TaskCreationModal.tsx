import React, { useState, useRef, useEffect } from "react";
import style from "../../style/Common/TaskCreationModal.module.scss";
import { parseDeadline, deadlineOptions } from "../../utils/deadlineParser";

interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  assigned_to: number | null;
  tags: string[];
  files: File[];
}

interface UserOption {
  id: number;
  name: string;
}

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<void>;
  availableUsers: UserOption[];
  loadingUsers?: boolean;
  projectId?: number;
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableUsers,
  loadingUsers = false,
  projectId,
}) => {
  const [taskData, setTaskData] = useState<TaskFormData>({
    title: "",
    description: "",
    due_date: "",
    status: "pending",
    priority: "medium",
    assigned_to: null,
    tags: [],
    files: [],
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deadlineType, setDeadlineType] = useState<string>("");
  const [customDeadline, setCustomDeadline] = useState<string>("");

  useEffect(() => {
    let dueDate = "";
    if (deadlineType === "custom" && customDeadline.trim()) {
      const parsed = parseDeadline(customDeadline);
      if (parsed) {
        dueDate = parsed.isoString;
      } else {
        // Если не распознано, оставляем как есть (пользователь может ввести дату вручную)
        dueDate = customDeadline;
      }
    } else if (deadlineType && deadlineType !== "custom") {
      const parsed = parseDeadline(deadlineType);
      if (parsed) {
        dueDate = parsed.isoString;
      }
    }
    setTaskData((prev) => ({ ...prev, due_date: dueDate }));
  }, [deadlineType, customDeadline]);

  if (!isOpen) return null;

  const handleAddFiles = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) return;

    setTaskData((prev) => ({
      ...prev,
      files: [...prev.files, ...imageFiles],
    }));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer?.files) {
      handleAddFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleAddFiles(event.target.files);
      event.target.value = "";
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setTaskData((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.name !== fileName),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit(taskData);
      // Сброс формы после успешной отправки
      setTaskData({
        title: "",
        description: "",
        due_date: "",
        status: "pending",
        priority: "medium",
        assigned_to: null,
        tags: [],
        files: [],
      });
      onClose();
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
      // Ошибка должна обрабатываться в родительском компоненте
    }
  };

  const handleTagsChange = (value: string) => {
    setTaskData({
      ...taskData,
      tags: value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    });
  };

  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={style.modalTitle}>Создать новую задачу</h2>

        <form onSubmit={handleSubmit} className={style.modalForm}>
          <div className={style.formGroup}>
            <label htmlFor="task-title">Название задачи *</label>
            <input
              id="task-title"
              type="text"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
              placeholder="Введите название задачи"
              required
            />
          </div>

          <div className={style.formGroup}>
            <label htmlFor="task-description">Описание задачи</label>
            <textarea
              id="task-description"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
              placeholder="Опишите задачу подробно..."
              rows={4}
            />
          </div>

          <div className={style.formGroup}>
            <label>
              Фото задачи
              <span className={style.optionalLabel}> (png/jpg)</span>
            </label>
            <div
              className={`${style.dropZone} ${
                isDragOver ? style.dragOver : ""
              }`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={style.dropZoneContent}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={style.dropZoneIcon}
                >
                  <path d="M12 5v14M5 12h14" />
                  <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                </svg>
                <p>Перетащите фото сюда или нажмите, чтобы выбрать</p>
                <span className={style.dropZoneHint}>
                  Поддерживаются изображения (PNG, JPG)
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className={style.fileInput}
                onChange={handleFileChange}
              />
            </div>

            {taskData.files.length > 0 && (
              <div className={style.fileList}>
                {taskData.files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className={style.fileItem}>
                    <div className={style.fileInfo}>
                      <div className={style.fileName}>{file.name}</div>
                      <div className={style.fileSize}>
                        {(file.size / 1024).toFixed(1)} КБ
                      </div>
                    </div>
                    <button
                      type="button"
                      className={style.removeFileButton}
                      onClick={() => handleRemoveFile(file.name)}
                      aria-label={`Удалить файл ${file.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={style.formGroup}>
            <label htmlFor="task-due-date-type">Дата выполнения</label>
            <select
              id="task-due-date-type"
              value={deadlineType}
              onChange={(e) => {
                setDeadlineType(e.target.value);
                if (e.target.value !== "custom") {
                  setCustomDeadline("");
                }
              }}
            >
              <option value="">Не указано</option>
              {deadlineOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              <option value="custom">Другое (ввести вручную)</option>
            </select>
            {deadlineType === "custom" && (
              <div className={style.customDeadlineInput}>
                <input
                  type="text"
                  value={customDeadline}
                  onChange={(e) => setCustomDeadline(e.target.value)}
                  placeholder="Например: 3 дня, 2 недели, 2026-01-10"
                  className={style.textInput}
                />
                <div className={style.hint}>
                  Можно ввести относительное время (2 дня) или конкретную дату (ГГГГ-ММ-ДД)
                </div>
              </div>
            )}
            {taskData.due_date && (
              <div className={style.deadlinePreview}>
                <strong>Будет установлено:</strong> {new Date(taskData.due_date).toLocaleString('ru-RU')}
              </div>
            )}
          </div>

          <div className={style.formGroup}>
            <label htmlFor="task-status">Статус</label>
            <select
              id="task-status"
              value={taskData.status}
              onChange={(e) =>
                setTaskData({ ...taskData, status: e.target.value })
              }
            >
              <option value="pending">Ожидание</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершено</option>
              <option value="cancelled">Отменено</option>
            </select>
          </div>

          <div className={style.formGroup}>
            <label htmlFor="task-priority">Приоритет</label>
            <select
              id="task-priority"
              value={taskData.priority}
              onChange={(e) =>
                setTaskData({ ...taskData, priority: e.target.value })
              }
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
              <option value="urgent">Срочный</option>
            </select>
          </div>

          <div className={style.formGroup}>
            <label htmlFor="task-assigned-to">Назначить на</label>
            <select
              id="task-assigned-to"
              value={taskData.assigned_to || ""}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  assigned_to: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              disabled={loadingUsers}
            >
              <option value="">Не назначено</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {loadingUsers && (
              <div className={style.loadingIndicator}>
                Загрузка пользователей...
              </div>
            )}
          </div>

          <div className={style.formGroup}>
            <label htmlFor="task-tags">Теги (через запятую)</label>
            <input
              id="task-tags"
              type="text"
              value={taskData.tags.join(", ")}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="например, frontend, bug, urgent"
            />
          </div>

          <div className={style.modalButtons}>
            <button
              type="button"
              className={style.cancelButton}
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className={style.submitButton}>
              Создать задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationModal;
