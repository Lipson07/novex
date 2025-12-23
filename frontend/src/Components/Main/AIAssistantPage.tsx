import React, { useState } from "react";
import styles from "../../style/Main/SimplePage.module.scss";
import { sendChatCompletion } from "../../services/ai";
import type { AiMessage } from "../../services/ai";

const presetSuggestions = [
  "Сделай краткий статус по всем активным задачам",
  "Сформируй отчет по прогрессу проектов",
  "Предложи план следующего спринта",
];

const mockTasks = [
  {
    id: 1,
    title: "Реализовать авторизацию через OAuth",
    status: "in-progress",
    assignee: "Иван Иванов",
    dueDate: "2024-01-20",
    priority: "high",
  },
  {
    id: 2,
    title: "Исправить баг с отображением карточек",
    status: "todo",
    assignee: "Петр Петров",
    dueDate: "2024-01-18",
    priority: "medium",
  },
  {
    id: 3,
    title: "Добавить тесты для API",
    status: "done",
    assignee: "Анна Сидорова",
    priority: "low",
  },
  {
    id: 4,
    title: "Обновить дизайн формы входа",
    status: "in-progress",
    assignee: "Михаил Кузнецов",
    dueDate: "2024-01-22",
    priority: "critical",
  },
  {
    id: 5,
    title: "Оптимизировать производительность базы данных",
    status: "todo",
    assignee: "Иван Иванов",
    priority: "high",
  },
  {
    id: 6,
    title: "Добавить документацию API",
    status: "todo",
    assignee: "Петр Петров",
    priority: "low",
  },
];

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (text?: string) => {
    const prompt = (text ?? input).trim();
    if (!prompt || loading) return;
    setError("");
    setLoading(true);
    const userMessage: AiMessage = { role: "user", content: prompt };
    const nextHistory: AiMessage[] = [...messages, userMessage];
    setMessages(nextHistory);
    setInput("");
    try {
      const systemMessage: AiMessage = {
        role: "system",
        content: `Ты - умный помощник в системе управления проектами.
        Твоя задача - помогать пользователю, анализируя текущие задачи и проекты.
        Вот список актуальных задач (Mock Data):
        ${JSON.stringify(mockTasks, null, 2)}
        Используй эти данные, чтобы отвечать на вопросы пользователя. Если спрашивают про статус, дедлайны или исполнителей - бери информацию отсюда.
        Отвечай вежливо, профессионально и по существу.`,
      };

      const reply = await sendChatCompletion([systemMessage, ...nextHistory]);
      const assistantMessage: AiMessage = {
        role: "assistant",
        content: reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      console.error(e);
      setError("Не удалось получить ответ от AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>AI помощник</h1>
        <p className={styles.pageSubtitle}>
          Задавайте вопросы и получайте советы по вашим проектам и задачам.
        </p>
      </div>

      {error && <div className={styles.card}>{error}</div>}

      <div className={styles.cardsGrid}>
        <div className={styles.card} style={{ gridColumn: "1 / -1" }}>
          <div className={styles.metaRow} style={{ marginBottom: 12 }}>
            {presetSuggestions.map((s) => (
              <button
                key={s}
                className={styles.badge}
                onClick={() => handleSend(s)}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>

          <div
            style={{
              maxHeight: 420,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 12,
              paddingRight: 6,
            }}
          >
            {messages.length === 0 && (
              <div className={styles.badge}>Нет сообщений — задайте вопрос</div>
            )}
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  background:
                    m.role === "user"
                      ? "rgba(102, 126, 234, 0.16)"
                      : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  color: "inherit",
                  whiteSpace: "pre-wrap",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.7,
                    marginBottom: 4,
                  }}
                >
                  {m.role === "user" ? "Вы" : "AI"}
                </div>
                {m.content}
              </div>
            ))}
          </div>

          <div className={styles.metaRow}>
            <input
              type="text"
              placeholder="Спросите AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.02)",
                color: "inherit",
              }}
              disabled={loading}
            />
            <button
              className={styles.badge}
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              {loading ? "..." : "Отправить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
