import React, { useEffect, useRef, useCallback } from "react";
import style from "../../style/Common/DeleteConfirmationModal.module.scss";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Название элемента для удаления (например, "Мой проект") */
  itemName?: string;
  /** Тип элемента: project, task, repository, default */
  type?: "project" | "task" | "repository" | "default";
  /** Заголовок модального окна (если не указан, будет сгенерирован автоматически) */
  title?: string;
  /** Сообщение в теле модального окна (если не указано, будет сгенерировано автоматически) */
  message?: string;
  /** Текст на кнопке подтверждения */
  confirmText?: string;
  /** Текст на кнопке отмены */
  cancelText?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  type = "default",
  title,
  message,
  confirmText = "Удалить",
  cancelText = "Отмена",
}) => {
  if (!isOpen) return null;

  const getDefaultTitle = () => {
    switch (type) {
      case "project":
        return "Удалить проект?";
      case "task":
        return "Удалить задачу?";
      case "repository":
        return "Удалить репозиторий?";
      default:
        return "Подтверждение удаления";
    }
  };

  const getDefaultMessage = () => {
    const base = "Вы уверены, что хотите удалить";
    let itemText = "";
    switch (type) {
      case "project":
        itemText = "проект";
        break;
      case "task":
        itemText = "задачу";
        break;
      case "repository":
        itemText = "репозиторий";
        break;
      default:
        itemText = "этот элемент";
    }
    const namePart = itemName ? ` "${itemName}"` : "";
    const suffix = "? Это действие нельзя отменить.";
    return `${base} ${itemText}${namePart}${suffix}`;
  };

  const modalTitle = title || getDefaultTitle();
  const modalMessage = message || getDefaultMessage();

  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  // Фокус на первую кнопку при открытии
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      // Даем время на отрисовку, затем фокусируемся на кнопке отмены
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 10);
    }

    return () => {
      // Возвращаем фокус при закрытии
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen]);

  // Обработка нажатия Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Enter" && e.ctrlKey) {
        handleConfirm();
      }
    },
    [isOpen, onClose, handleConfirm]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Генерация уникальных ID для ARIA
  const titleId = "delete-modal-title";
  const descId = "delete-modal-description";

  return (
    <div
      className={style.modalOverlay}
      onClick={onClose}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        className={style.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
      >
        <div className={style.modalHeader}>
          <div className={style.modalIcon} aria-hidden="true">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="1280.000000pt"
              height="1126.000000pt"
              viewBox="0 0 1280.000000 1126.000000"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
              focusable="false"
            >
              <g
                transform="translate(0.000000,1126.000000) scale(0.100000,-0.100000)"
                fill="#e90000ff"
                stroke="none"
              >
                <path
                  d="M6214 11235 c-203 -51 -368 -178 -506 -386 -71 -107 -845 -1468
-2488 -4374 -715 -1264 -1174 -2077 -2245 -3970 -489 -863 -901 -1601 -915
-1640 -15 -38 -35 -111 -45 -162 -18 -91 -18 -93 3 -189 31 -137 72 -214 162
-305 88 -89 164 -134 302 -178 l97 -31 5823 0 5824 0 94 21 c251 54 400 195
460 434 25 100 25 124 0 231 -41 175 72 -29 -1500 2714 -731 1276 -1681 2934
-3024 5280 -648 1130 -1207 2100 -1244 2155 -114 171 -271 309 -412 365 -70
28 -212 60 -258 59 -20 0 -78 -11 -128 -24z m590 -1635 c238 -415 850 -1484
1361 -2375 1551 -2708 3290 -5744 3529 -6162 70 -123 125 -227 121 -233 -4 -7
-1768 -10 -5431 -10 -4926 0 -5424 1 -5424 16 0 8 116 221 259 472 273 483
985 1741 2331 4122 1224 2165 1302 2302 1777 3140 900 1586 1018 1791 1031
1788 7 -2 208 -343 446 -758z"
                />
                <path
                  d="M6230 7851 c-172 -37 -334 -125 -469 -255 -91 -88 -150 -170 -201
-279 -80 -169 -86 -271 -40 -618 16 -123 70 -534 120 -914 50 -379 113 -859
140 -1065 27 -206 72 -548 100 -760 54 -416 73 -502 135 -605 52 -87 110 -141
194 -183 65 -32 84 -37 166 -40 202 -9 346 81 436 273 46 100 60 164 103 500
50 380 200 1520 307 2333 58 438 90 720 90 777 0 214 -97 414 -284 591 -225
213 -518 303 -797 245z"
                />
                <path
                  d="M6320 2731 c-239 -33 -439 -205 -516 -446 -33 -101 -37 -263 -10
-364 144 -534 820 -654 1122 -200 156 234 146 543 -25 769 -131 174 -358 269
-571 241z"
                />
              </g>
            </svg>
          </div>
          <h3 id={titleId} className={style.modalTitle}>
            {modalTitle}
          </h3>
          <button
            ref={closeButtonRef}
            className={style.closeButton}
            onClick={onClose}
            aria-label="Закрыть диалог"
            title="Закрыть (Esc)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={style.modalBody}>
          <p id={descId} className={style.modalMessage}>
            {modalMessage}
          </p>
        </div>

        <div className={style.modalFooter}>
          <button
            ref={cancelButtonRef}
            className={style.cancelButton}
            onClick={onClose}
            aria-label="Отменить удаление"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            className={style.confirmButton}
            onClick={handleConfirm}
            aria-label="Подтвердить удаление"
            autoFocus={false}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
