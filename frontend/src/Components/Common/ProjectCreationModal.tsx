import React, { useState } from "react";
import style from "../../style/Common/ProjectCreationModal.module.scss";

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: { title: string; description: string }) => Promise<void>;
  isCreating?: boolean;
}

const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isCreating = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Пожалуйста, введите название проекта");
      return;
    }

    setError("");
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      // Сброс формы после успешной отправки
      setTitle("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error("Ошибка создания проекта:", err);
      setError("Ошибка создания проекта");
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <div className={style.modalOverlay} onClick={handleClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        <div className={style.modalHeader}>
          <h3>Создать новый проект</h3>
          <button onClick={handleClose} className={style.closeButton}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={style.modalForm}>
          {error && <div className={style.formError}>{error}</div>}

          <div className={style.formGroup}>
            <label>Название проекта *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="Введите название проекта"
              className={style.formInput}
              required
              autoFocus
              disabled={isCreating}
            />
          </div>

          <div className={style.formGroup}>
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите ваш проект..."
              rows={4}
              className={style.formTextarea}
              disabled={isCreating}
            />
          </div>

          <div className={style.modalActions}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className={style.cancelButton}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isCreating}
              className={style.submitButton}
            >
              {isCreating ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Создание...
                </>
              ) : (
                "Создать проект"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreationModal;