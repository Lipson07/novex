import React, { useState, useEffect } from "react";
import style from "../../style/Main/QuickNote.module.scss";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface QuickNoteProps {
  projectId: number;
  projectTitle?: string;
  onBack?: () => void;
}

function QuickNote({ projectId, projectTitle, onBack }: QuickNoteProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Идея для новой функции",
      content: "Добавить возможность экспорта данных в Excel",
      createdAt: "2024-01-10T10:00:00",
      updatedAt: "2024-01-10T10:00:00",
      tags: ["идея", "функция"],
    },
    {
      id: 2,
      title: "Важное замечание",
      content: "Проверить производительность на больших объемах данных",
      createdAt: "2024-01-11T14:30:00",
      updatedAt: "2024-01-11T14:30:00",
      tags: ["важно", "производительность"],
    },
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: "",
    content: "",
    tags: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [tagInput, setTagInput] = useState("");

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const handleCreateNote = () => {
    setNewNote({
      title: "",
      content: "",
      tags: [],
    });
    setSelectedNote(null);
    setIsEditMode(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.title && newNote.content) {
      const now = new Date().toISOString();
      if (selectedNote) {
        // Редактирование существующей заметки
        setNotes(
          notes.map((note) =>
            note.id === selectedNote.id
              ? {
                  ...note,
                  title: newNote.title!,
                  content: newNote.content!,
                  tags: newNote.tags || [],
                  updatedAt: now,
                }
              : note
          )
        );
      } else {
        // Создание новой заметки
        const note: Note = {
          id: notes.length + 1,
          title: newNote.title!,
          content: newNote.content!,
          tags: newNote.tags || [],
          createdAt: now,
          updatedAt: now,
        };
        setNotes([...notes, note]);
      }
      setIsEditMode(false);
      setSelectedNote(null);
      setNewNote({ title: "", content: "", tags: [] });
      setTagInput("");
    }
  };

  const handleDeleteNote = (id: number) => {
    if (window.confirm("Удалить эту заметку?")) {
      setNotes(notes.filter((note) => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setIsEditMode(false);
      }
    }
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags,
    });
    setIsEditMode(true);
    setTagInput("");
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (!newNote.tags?.includes(tag)) {
        setNewNote({
          ...newNote,
          tags: [...(newNote.tags || []), tag],
        });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={style.quickNote}>
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
            <h1 className={style.title}>Быстрые заметки</h1>
            {projectTitle && (
              <p className={style.subtitle}>Проект: {projectTitle}</p>
            )}
          </div>
          <button
            className={style.addButton}
            onClick={handleCreateNote}
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
            <span>Новая заметка</span>
          </button>
        </div>

        <div className={style.notesLayout}>
          {/* Список заметок */}
          <div className={style.notesListSection}>
            <div className={style.searchContainer}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="9" r="7" />
                <path d="M19 19l-4-4" />
              </svg>
              <input
                type="text"
                placeholder="Поиск заметок..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={style.searchInput}
              />
            </div>

            <div className={style.notesList}>
              {filteredNotes.length === 0 ? (
                <div className={style.emptyNotes}>
                  <div className={style.emptyIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <p>
                    {searchQuery
                      ? "Заметки не найдены"
                      : "Нет заметок. Создайте первую!"}
                  </p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`${style.noteItem} ${
                      selectedNote?.id === note.id ? style.active : ""
                    }`}
                    onClick={() => {
                      setSelectedNote(note);
                      setIsEditMode(false);
                    }}
                  >
                    <div className={style.noteItemHeader}>
                      <h3 className={style.noteItemTitle}>{note.title}</h3>
                      <div className={style.noteItemActions}>
                        <button
                          className={style.editButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNote(note);
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
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
                          className={style.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className={style.noteItemPreview}>
                      {note.content.length > 100
                        ? `${note.content.substring(0, 100)}...`
                        : note.content}
                    </p>
                    {note.tags.length > 0 && (
                      <div className={style.noteItemTags}>
                        {note.tags.map((tag, index) => (
                          <span key={index} className={style.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className={style.noteItemDate}>
                      {formatDate(note.updatedAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Редактор заметки */}
          <div className={style.noteEditorSection}>
            {isEditMode ? (
              <form onSubmit={handleSaveNote} className={style.noteEditor}>
                <div className={style.editorHeader}>
                  <h2 className={style.editorTitle}>
                    {selectedNote ? "Редактировать заметку" : "Новая заметка"}
                  </h2>
                  <button
                    type="button"
                    className={style.cancelButton}
                    onClick={() => {
                      setIsEditMode(false);
                      setSelectedNote(null);
                      setNewNote({ title: "", content: "", tags: [] });
                      setTagInput("");
                    }}
                  >
                    Отмена
                  </button>
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="note-title">Название</label>
                  <input
                    id="note-title"
                    type="text"
                    value={newNote.title || ""}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                    placeholder="Название заметки"
                    required
                  />
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="note-content">Содержание</label>
                  <textarea
                    id="note-content"
                    value={newNote.content || ""}
                    onChange={(e) =>
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                    placeholder="Текст заметки..."
                    rows={12}
                    required
                  />
                </div>

                <div className={style.formGroup}>
                  <label htmlFor="note-tags">Теги (нажмите Enter для добавления)</label>
                  <input
                    id="note-tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Добавить тег..."
                  />
                  {newNote.tags && newNote.tags.length > 0 && (
                    <div className={style.tagsContainer}>
                      {newNote.tags.map((tag, index) => (
                        <span key={index} className={style.tag}>
                          {tag}
                          <button
                            type="button"
                            className={style.tagRemove}
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className={style.saveButton}>
                  Сохранить
                </button>
              </form>
            ) : selectedNote ? (
              <div className={style.noteViewer}>
                <div className={style.viewerHeader}>
                  <h2 className={style.viewerTitle}>{selectedNote.title}</h2>
                  <div className={style.viewerActions}>
                    <button
                      className={style.editButton}
                      onClick={() => handleEditNote(selectedNote)}
                    >
                      Редактировать
                    </button>
                    <button
                      className={style.deleteButton}
                      onClick={() => handleDeleteNote(selectedNote.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                <div className={style.viewerMeta}>
                  <span>Создано: {formatDate(selectedNote.createdAt)}</span>
                  {selectedNote.updatedAt !== selectedNote.createdAt && (
                    <span>Обновлено: {formatDate(selectedNote.updatedAt)}</span>
                  )}
                </div>
                {selectedNote.tags.length > 0 && (
                  <div className={style.viewerTags}>
                    {selectedNote.tags.map((tag, index) => (
                      <span key={index} className={style.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className={style.viewerContent}>
                  {selectedNote.content.split("\n").map((line, index) => (
                    <p key={index}>{line || "\u00A0"}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className={style.emptyEditor}>
                <div className={style.emptyIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <p>Выберите заметку или создайте новую</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickNote;

