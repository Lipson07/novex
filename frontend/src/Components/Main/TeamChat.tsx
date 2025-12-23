import React, { useState, useRef, useEffect } from "react";
import style from "../../style/Main/TeamChat.module.scss";

interface Message {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  avatar?: string;
}

interface TeamChatProps {
  projectId: number;
  projectTitle?: string;
  onBack?: () => void;
}

function TeamChat({ projectId, projectTitle, onBack }: TeamChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "Иван Иванов",
      text: "Привет всем! Как дела с проектом?",
      timestamp: "10:30",
    },
    {
      id: 2,
      author: "Анна Сидорова",
      text: "Всё отлично, работаю над новой функцией",
      timestamp: "10:32",
    },
    {
      id: 3,
      author: "Петр Петров",
      text: "Отлично! Когда планируем деплой?",
      timestamp: "10:35",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        author: "Вы",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={style.teamChat}>
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
            <h1 className={style.title}>Командный чат</h1>
            {projectTitle && (
              <p className={style.subtitle}>Проект: {projectTitle}</p>
            )}
          </div>
        </div>

        {/* Участники */}
        <div className={style.membersSection}>
          <div className={style.membersLabel}>Участники:</div>
          <div className={style.membersList}>
            {["Иван Иванов", "Петр Петров", "Анна Сидорова", "Михаил Кузнецов"].map(
              (member, index) => (
                <div key={index} className={style.member}>
                  <div className={style.memberAvatar}>
                    {getInitials(member)}
                  </div>
                  <span className={style.memberName}>{member}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Сообщения */}
        <div className={style.messagesContainer}>
          <div className={style.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${style.message} ${
                  message.author === "Вы" ? style.ownMessage : ""
                }`}
              >
                <div className={style.messageAvatar}>
                  {getInitials(message.author)}
                </div>
                <div className={style.messageContent}>
                  <div className={style.messageHeader}>
                    <span className={style.messageAuthor}>{message.author}</span>
                    <span className={style.messageTime}>{message.timestamp}</span>
                  </div>
                  <div className={style.messageText}>{message.text}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Форма отправки сообщения */}
        <form onSubmit={handleSendMessage} className={style.messageForm}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Написать сообщение..."
            className={style.messageInput}
          />
          <button type="submit" className={style.sendButton}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeamChat;

