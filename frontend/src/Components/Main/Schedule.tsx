import React, { useState } from "react";
import style from "../../style/Main/Schedule.module.scss";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  participants: string[];
  type: "meeting" | "deadline" | "milestone";
}

interface ScheduleProps {
  projectId: number;
  projectTitle?: string;
  onBack?: () => void;
}

function Schedule({ projectId, projectTitle, onBack }: ScheduleProps) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Спринт планирование",
      description: "Обсуждение задач на следующий спринт",
      date: "2024-01-15",
      time: "10:00",
      participants: ["Иван Иванов", "Анна Сидорова"],
      type: "meeting",
    },
    {
      id: 2,
      title: "Дедлайн: Релиз v1.0",
      description: "Финальный релиз первой версии",
      date: "2024-01-20",
      time: "18:00",
      participants: ["Все участники"],
      type: "deadline",
    },
    {
      id: 3,
      title: "Милестоун: Бета-тест",
      description: "Запуск бета-тестирования",
      date: "2024-01-18",
      time: "12:00",
      participants: ["Петр Петров"],
      type: "milestone",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: selectedDate,
    time: "",
    participants: [],
    type: "meeting",
  });

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date && newEvent.time) {
      const event: Event = {
        id: events.length + 1,
        title: newEvent.title!,
        description: newEvent.description || "",
        date: newEvent.date!,
        time: newEvent.time!,
        participants: newEvent.participants || [],
        type: newEvent.type || "meeting",
      };
      setEvents([...events, event]);
      setIsAddEventModalOpen(false);
      setNewEvent({
        title: "",
        description: "",
        date: selectedDate,
        time: "",
        participants: [],
        type: "meeting",
      });
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "meeting":
        return "Встреча";
      case "deadline":
        return "Дедлайн";
      case "milestone":
        return "Милестоун";
      default:
        return type;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "#2b7fff";
      case "deadline":
        return "#f87171";
      case "milestone":
        return "#10b981";
      default:
        return "#667eea";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const todayEvents = getEventsForDate(selectedDate);

  return (
    <div className={style.schedule}>
      <div className={style.content}>
        {/* Заголовок */}
        <div className={style.header}>
          {onBack && (
            <button onClick={onBack} className={style.backButton}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Назад</span>
            </button>
          )}
          <div className={style.headerInfo}>
            <h1 className={style.title}>Расписание</h1>
            {projectTitle && (
              <p className={style.subtitle}>Проект: {projectTitle}</p>
            )}
          </div>
          <button
            className={style.addButton}
            onClick={() => setIsAddEventModalOpen(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Добавить событие</span>
          </button>
        </div>

        {/* Календарь и события */}
        <div className={style.scheduleContent}>
          {/* Календарь */}
          <div className={style.calendarSection}>
            <div className={style.calendarHeader}>
              <h2 className={style.sectionTitle}>Календарь</h2>
            </div>
            <div className={style.calendar}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={style.dateInput}
              />
              <div className={style.selectedDateInfo}>
                <div className={style.dateLabel}>
                  Выбранная дата: {formatDate(selectedDate)}
                </div>
                <div className={style.eventsCount}>
                  Событий: {todayEvents.length}
                </div>
              </div>
            </div>
          </div>

          {/* События на выбранную дату */}
          <div className={style.eventsSection}>
            <div className={style.eventsHeader}>
              <h2 className={style.sectionTitle}>
                События на {formatDate(selectedDate)}
              </h2>
            </div>
            {todayEvents.length === 0 ? (
              <div className={style.emptyEvents}>
                <div className={style.emptyIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="8"
                      y1="2"
                      x2="8"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="3"
                      y1="10"
                      x2="21"
                      y2="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <p>На эту дату нет запланированных событий</p>
              </div>
            ) : (
              <div className={style.eventsList}>
                {todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={style.eventCard}
                    style={{
                      borderLeftColor: getEventTypeColor(event.type),
                    }}
                  >
                    <div className={style.eventHeader}>
                      <div className={style.eventType}>
                        <span
                          className={style.eventTypeBadge}
                          style={{
                            backgroundColor: `${getEventTypeColor(event.type)}20`,
                            color: getEventTypeColor(event.type),
                          }}
                        >
                          {getEventTypeLabel(event.type)}
                        </span>
                      </div>
                      <div className={style.eventTime}>{event.time}</div>
                    </div>
                    <h3 className={style.eventTitle}>{event.title}</h3>
                    {event.description && (
                      <p className={style.eventDescription}>
                        {event.description}
                      </p>
                    )}
                    {event.participants.length > 0 && (
                      <div className={style.eventParticipants}>
                        <span className={style.participantsLabel}>
                          Участники:
                        </span>
                        <span className={style.participantsList}>
                          {event.participants.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Модальное окно добавления события */}
        {isAddEventModalOpen && (
          <div
            className={style.modalOverlay}
            onClick={() => setIsAddEventModalOpen(false)}
          >
            <div
              className={style.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={style.modalTitle}>Добавить событие</h2>
              <form onSubmit={handleAddEvent} className={style.modalForm}>
                <div className={style.formGroup}>
                  <label htmlFor="event-title">Название события</label>
                  <input
                    id="event-title"
                    type="text"
                    value={newEvent.title || ""}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    placeholder="Введите название"
                    required
                  />
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="event-description">Описание</label>
                  <textarea
                    id="event-description"
                    value={newEvent.description || ""}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    placeholder="Описание события..."
                    rows={3}
                  />
                </div>

                <div className={style.formRow}>
                  <div className={style.formGroup}>
                    <label htmlFor="event-date">Дата</label>
                    <input
                      id="event-date"
                      type="date"
                      value={newEvent.date || ""}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, date: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className={style.formGroup}>
                    <label htmlFor="event-time">Время</label>
                    <input
                      id="event-time"
                      type="time"
                      value={newEvent.time || ""}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, time: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="event-type">Тип события</label>
                  <select
                    id="event-type"
                    value={newEvent.type || "meeting"}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        type: e.target.value as Event["type"],
                      })
                    }
                  >
                    <option value="meeting">Встреча</option>
                    <option value="deadline">Дедлайн</option>
                    <option value="milestone">Милестоун</option>
                  </select>
                </div>

                <div className={style.modalButtons}>
                  <button
                    type="button"
                    className={style.cancelButton}
                    onClick={() => setIsAddEventModalOpen(false)}
                  >
                    Отмена
                  </button>
                  <button type="submit" className={style.submitButton}>
                    Добавить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;

