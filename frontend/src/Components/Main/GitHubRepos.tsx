import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user.js";
import DeleteConfirmationModal from "../Common/DeleteConfirmationModal";
import style from "../../style/Main/GitHubRepos.module.scss";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  default_branch: string;
  owner_login: string;
  status?: string;
  tags?: string[];
}

interface GitHubReposProps {
  projectId: number;
}

const GitHubRepos: React.FC<GitHubReposProps> = ({ projectId }) => {
  const user = useSelector(selectUser);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [syncLoading, setSyncLoading] = useState<number | null>(null);
  const [addingRepo, setAddingRepo] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    repoId: number | null;
    repoName: string;
  }>({
    isOpen: false,
    repoId: null,
    repoName: "",
  });

  // Базовый URL для API (должен совпадать с backend)
  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    fetchRepos();
  }, [projectId, user?.id]);

  const fetchRepos = async () => {
    try {
      setLoading(true);

      // Используем ID текущего пользователя вместо projectId
      const userId = user?.id;
      if (!userId) {
        setError("Пользователь не авторизован");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/github-projects/user/${userId}/projects`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Обрабатываем как пагинированный ответ, так и обычный массив
        const reposData = data.data?.data || data.data || data.projects || [];
        setRepos(reposData);
      } else {
        setError(data.message || "Ошибка при загрузке репозиториев");
      }
    } catch (err) {
      console.error("Error fetching repos:", err);
      setError("Не удалось загрузить репозитории");
    } finally {
      setLoading(false);
    }
  };

  // Вспомогательная функция для очистки имени репозитория
  const cleanRepoName = (repoName: string): string => {
    return repoName.replace(/\.git$/, "");
  };

  // Функция для парсинга GitHub URL
  const parseGitHubUrl = (
    url: string
  ): { owner: string; repo: string } | null => {
    try {
      // Добавляем протокол, если его нет
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      const urlObj = new URL(url);
      if (urlObj.hostname !== "github.com") {
        return null;
      }

      const pathParts = urlObj.pathname
        .split("/")
        .filter((part) => part.length > 0);
      if (pathParts.length < 2) {
        return null;
      }

      const owner = pathParts[0];
      const repo = cleanRepoName(pathParts[1]);

      return { owner, repo };
    } catch (error) {
      console.error("Error parsing GitHub URL:", error);
      return null;
    }
  };

  const handleAddRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl.trim()) {
      alert("Введите URL репозитория");
      return;
    }

    // Проверяем авторизацию пользователя
    if (!user?.id) {
      alert("Ошибка: пользователь не авторизован");
      return;
    }

    setAddingRepo(true);
    setError("");

    try {
      // Парсим URL
      const parsed = parseGitHubUrl(newRepoUrl);
      if (!parsed) {
        throw new Error(
          "Некорректный URL GitHub репозитория. Ожидается: https://github.com/username/repository"
        );
      }

      const { owner, repo } = parsed;

      // Получаем данные о репозитории через наш backend API
      console.log(`Fetching from GitHub API via backend: ${owner}/${repo}`);
      const githubResponse = await fetch(
        `${API_BASE_URL}/github-projects/github/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!githubResponse.ok) {
        const errorData = await githubResponse.json().catch(() => ({}));
        const errorMessage = errorData.message || `GitHub API error: ${githubResponse.status}`;
        const solution = errorData.solution || '';
        const details = errorData.details || '';
        
        if (githubResponse.status === 404) {
          throw new Error(`Репозиторий не найден: ${owner}/${repo}. Проверьте:
          1. Существует ли репозиторий
          2. Является ли он публичным
          3. Правильно ли указаны имя владельца и название репозитория`);
        } else if (githubResponse.status === 403) {
          let errorMsg = `Ошибка доступа к GitHub API (403). Возможные причины:
          1. Превышен лимит запросов к GitHub API (60 запросов в час для неавторизованных запросов)
          2. Репозиторий является приватным и требует авторизации
          3. Проблемы с сетевым доступом`;
          
          if (solution) {
            errorMsg += `\n\nРешение: ${solution}`;
          }
          if (details) {
            errorMsg += `\n\nДетали: ${details}`;
          }
          
          errorMsg += `\n\nКак исправить:
          1. Добавьте GitHub токен в файл backend/.env как GITHUB_API_TOKEN
          2. Или подождите час для сброса лимита
          3. Или используйте ручной ввод данных репозитория`;
          
          throw new Error(errorMsg);
        }
        throw new Error(errorMessage);
      }

      const githubResponseData = await githubResponse.json();
      
      if (!githubResponseData.success) {
        throw new Error(githubResponseData.message || "Ошибка при получении данных репозитория");
      }
      
      const repoData = githubResponseData.data;

      // Создаем проект в нашей системе
      const payload = {
        github_id: repoData.id.toString(),
        name: repoData.name,
        full_name: repoData.full_name,
        owner_login: repoData.owner.login,
        owner_name: repoData.owner.name || repoData.owner.login,
        owner_avatar_url: repoData.owner.avatar_url,
        owner_html_url: repoData.owner.html_url,
        description: repoData.description || "",
        html_url: repoData.html_url,
        clone_url: repoData.clone_url,
        ssh_url: repoData.ssh_url,
        language: repoData.language || null,
        stargazers_count: repoData.stargazers_count || 0,
        forks_count: repoData.forks_count || 0,
        open_issues_count: repoData.open_issues_count || 0,
        size: repoData.size || 0,
        github_created_at: repoData.created_at,
        github_updated_at: repoData.updated_at,
        github_pushed_at: repoData.pushed_at,
        default_branch: repoData.default_branch || "main",
        topics: repoData.topics || [],
        license: repoData.license
          ? {
              key: repoData.license.key,
              name: repoData.license.name,
              spdx_id: repoData.license.spdx_id,
              url: repoData.license.url,
            }
          : null,
        fork: repoData.fork || false,
        archived: repoData.archived || false,
        disabled: repoData.disabled || false,
        template: repoData.template || false,
        user_id: user.id,
        status: "active",
        tags: [],
      };

      console.log("Sending to backend:", payload);

      const response = await fetch(`${API_BASE_URL}/github-projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      // Сначала проверяем, есть ли тело ответа
      const responseText = await response.text();
      console.log("Response text:", responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error(
          `Invalid JSON response from server: ${responseText.substring(0, 100)}`
        );
      }

      if (!response.ok) {
        throw new Error(
          responseData.message || `HTTP error! status: ${response.status}`
        );
      }

      if (responseData.success) {
        setRepos([...repos, responseData.data]);
        setNewRepoUrl("");
        setShowAddModal(false);
        alert("Репозиторий успешно добавлен!");
      } else {
        throw new Error(
          responseData.message || "Ошибка при добавлении репозитория"
        );
      }
    } catch (err: any) {
      console.error("Error adding repo:", err);
      alert(
        err instanceof Error ? err.message : "Ошибка при добавлении репозитория"
      );
    } finally {
      setAddingRepo(false);
    }
  };

  const openDeleteModal = (repoId: number, repoName: string) => {
    setDeleteModal({
      isOpen: true,
      repoId,
      repoName,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      repoId: null,
      repoName: "",
    });
  };

  const handleRemoveRepo = async (repoId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/github-projects/${repoId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRepos(repos.filter((repo) => repo.id !== repoId));
        alert("Репозиторий удален");
      } else {
        alert(data.message || "Ошибка при удалении репозитория");
      }
    } catch (err) {
      console.error("Error removing repo:", err);
      alert("Ошибка при удалении репозитория");
    } finally {
      closeDeleteModal();
    }
  };

  const handleSyncRepo = async (repoId: number) => {
    try {
      setSyncLoading(repoId);
      const response = await fetch(
        `${API_BASE_URL}/github-projects/sync/${repoId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Обновляем данные репозитория в списке
        setRepos(
          repos.map((repo) =>
            repo.id === repoId ? { ...repo, ...data.data } : repo
          )
        );
        alert("Репозиторий синхронизирован!");
      } else {
        alert(data.message || "Ошибка синхронизации");
      }
    } catch (err) {
      console.error("Error syncing repo:", err);
      alert("Ошибка при синхронизации репозитория");
    } finally {
      setSyncLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleOpenInGitHub = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className={style.githubCard}>
        <div className={style.loadingRepos}>
          <div className={style.spinnerSmall}></div>
          <p>Загрузка репозиториев...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.githubCard}>
      <div className={style.cardHeader}>
        <div className={style.cardHeaderLeft}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <h3 className={style.cardTitle}>GitHub репозитории</h3>
          <span className={style.reposCount}>({repos.length})</span>
        </div>
        <button
          className={style.repoLink}
          onClick={() => setShowAddModal(true)}
        >
          + Добавить репозиторий
        </button>
      </div>

      {error ? (
        <div className={style.errorMessage}>
          <p>{error}</p>
          <button onClick={fetchRepos}>Повторить</button>
        </div>
      ) : repos.length === 0 ? (
        <div className={style.noRepos}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <h4>Нет привязанных репозиториев</h4>
          <p>Привяжите GitHub репозиторий для отслеживания коммитов и веток</p>
          <button
            className={style.addRepoButton}
            onClick={() => setShowAddModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Добавить GitHub репозиторий
          </button>
        </div>
      ) : (
        <div className={style.reposGrid}>
          {repos.map((repo) => (
            <div key={repo.id} className={style.repoCard}>
              <div className={style.repoHeader}>
                <div className={style.repoName} title={repo.full_name}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  <span>{repo.name}</span>
                  {repo.status && (
                    <span
                      className={`${style.statusBadge} ${style[repo.status]}`}
                    >
                      {repo.status === "active"
                        ? "Активен"
                        : repo.status === "archived"
                        ? "Архивирован"
                        : "Скрыт"}
                    </span>
                  )}
                </div>
                <div className={style.repoActions}>
                  <button
                    className={style.repoLinkSmall}
                    onClick={() => handleOpenInGitHub(repo.html_url)}
                    title="Открыть в GitHub"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <polyline
                        points="15 3 21 3 21 9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="10"
                        y1="14"
                        x2="21"
                        y2="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                  <button
                    className={style.syncButton}
                    onClick={() => handleSyncRepo(repo.id)}
                    disabled={syncLoading === repo.id}
                    title="Синхронизировать с GitHub"
                  >
                    {syncLoading === repo.id ? (
                      <div className={style.spinnerMini}></div>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M23 4v6h-6M1 20v-6h6"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    className={style.removeRepoButton}
                    onClick={() => openDeleteModal(repo.id, repo.name)}
                    title="Удалить репозиторий"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className={style.repoOwner}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>{repo.owner_login}</span>
              </div>

              {repo.description && (
                <p className={style.repoDescription}>{repo.description}</p>
              )}

              <div className={style.repoStats}>
                <div className={style.repoStat} title="Звёзды">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{repo.stargazers_count.toLocaleString()}</span>
                </div>
                <div className={style.repoStat} title="Форки">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>{repo.forks_count.toLocaleString()}</span>
                </div>
                {repo.language && (
                  <div className={style.repoStat}>
                    <span className={style.languageBadge}>{repo.language}</span>
                  </div>
                )}
              </div>

              {repo.tags && repo.tags.length > 0 && (
                <div className={style.repoTags}>
                  {repo.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className={style.repoTag}>
                      {tag}
                    </span>
                  ))}
                  {repo.tags.length > 3 && (
                    <span className={style.moreTags}>
                      +{repo.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className={style.repoFooter}>
                <span
                  className={style.repoUpdateDate}
                  title="Последнее обновление"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {formatDate(repo.updated_at)}
                </span>
                <span className={style.repoBranch} title="Основная ветка">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 3v12a4 4 0 0 0 4 4 4 4 0 0 0 4-4V3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {repo.default_branch}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно добавления репозитория */}
      {showAddModal && (
        <div
          className={style.modalOverlay}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className={style.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={style.modalHeader}>
              <h3 className={style.modalTitle}>Добавить GitHub репозиторий</h3>
              <button
                className={style.modalCloseButton}
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRepo} className={style.modalForm}>
              <div className={style.formGroup}>
                <label htmlFor="repo-url">
                  URL репозитория GitHub
                  <span className={style.requiredLabel}> *</span>
                </label>
                <input
                  id="repo-url"
                  type="url"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  required
                  autoFocus
                />
                <small className={style.inputHint}>
                  Примеры:
                  <br />• https://github.com/facebook/react
                  <br />• github.com/vuejs/vue
                  <br />• https://github.com/tensorflow/tensorflow.git
                </small>
              </div>

              <div className={style.formGroup}>
                <div className={style.note}>
                  <strong>Примечание:</strong> Будет добавлен публичный
                  репозиторий. Для приватных репозиториев потребуется настройка
                  OAuth.
                </div>
              </div>

              <div className={style.modalButtons}>
                <button
                  type="button"
                  className={style.cancelButton}
                  onClick={() => setShowAddModal(false)}
                  disabled={addingRepo}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className={style.submitButton}
                  disabled={addingRepo}
                >
                  {addingRepo ? (
                    <>
                      <div className={style.spinnerMini}></div>
                      Добавление...
                    </>
                  ) : (
                    "Добавить репозиторий"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => {
          if (deleteModal.repoId) {
            handleRemoveRepo(deleteModal.repoId);
          }
        }}
        title="Удалить репозиторий?"
        message={`Вы уверены, что хотите удалить репозиторий "${deleteModal.repoName}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        type="default"
      />
    </div>
  );
};

export default GitHubRepos;
