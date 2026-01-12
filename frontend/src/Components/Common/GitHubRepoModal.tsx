import React, { useState, useEffect, useCallback } from "react";
import style from "../../style/Common/GitHubRepoModal.module.scss";

interface GitHubRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRepo: (repo: any) => void;
}

interface SearchResult {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  license?: {
    key: string;
    name: string;
  };
}

const GitHubRepoModal: React.FC<GitHubRepoModalProps> = ({
  isOpen,
  onClose,
  onSelectRepo,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Функция для очистки имени репозитория
  const cleanRepoName = (repoName: string): string => {
    return repoName.replace(/\.git$/, "");
  };

  // Функция для поиска репозиториев
  const searchRepos = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("По вашему запросу ничего не найдено");
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.items);
    } catch (err: any) {
      console.error("Error searching repos:", err);
      setError(err.message || "Ошибка при поиске репозиториев");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Обработчик изменения поискового запроса с debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchQuery.trim()) {
      const timeout = setTimeout(() => {
        searchRepos(searchQuery);
      }, 500);
      setSearchTimeout(timeout);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchQuery, searchRepos]);

  const handleRepoSelect = async (repo: SearchResult) => {
    try {
      // Очищаем имя репозитория
      const cleanFullName = cleanRepoName(repo.full_name);

      // Получаем полную информацию о репозитории
      const response = await fetch(
        `https://api.github.com/repos/${cleanFullName}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Репозиторий "${cleanFullName}" не найден`);
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repoDetails = await response.json();
      onSelectRepo(repoDetails);
      onClose();
    } catch (err: any) {
      console.error("Error fetching repo details:", err);
      alert(err.message || "Ошибка при получении информации о репозитории");
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "сегодня";
    if (diffInDays === 1) return "вчера";
    if (diffInDays < 7) return `${diffInDays} дн. назад`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} нед. назад`;
    return `${Math.floor(diffInDays / 30)} мес. назад`;
  };

  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={style.modalHeader}>
          <h3 className={style.modalTitle}>Поиск GitHub репозиториев</h3>
          <button className={style.modalCloseButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={style.searchContainer}>
          <div className={style.searchInputWrapper}>
            <svg
              className={style.searchIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск репозиториев..."
              className={style.searchInput}
              autoFocus
            />
            {isLoading && <div className={style.spinnerSmall}></div>}
          </div>
        </div>

        {error && (
          <div className={style.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        <div className={style.searchResults}>
          {searchResults.map((repo) => (
            <div
              key={repo.id}
              className={style.searchResultItem}
              onClick={() => handleRepoSelect(repo)}
            >
              <div className={style.repoAvatar}>
                <img src={repo.owner.avatar_url} alt={repo.owner.login} />
              </div>
              <div className={style.repoInfo}>
                <div className={style.repoName}>
                  <strong title={repo.full_name}>{repo.full_name}</strong>
                </div>
                {repo.description && (
                  <p className={style.repoDescription} title={repo.description}>
                    {repo.description.length > 100
                      ? `${repo.description.substring(0, 100)}...`
                      : repo.description}
                  </p>
                )}
                <div className={style.repoMeta}>
                  <span className={style.repoMetaItem} title="Звёзды">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {formatNumber(repo.stargazers_count)}
                  </span>
                  <span className={style.repoMetaItem} title="Форки">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {formatNumber(repo.forks_count)}
                  </span>
                  {repo.language && (
                    <span className={style.repoMetaItem}>
                      <span className={style.languageDot}></span>
                      {repo.language}
                    </span>
                  )}
                  {repo.license && (
                    <span className={style.repoMetaItem} title="Лицензия">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      {repo.license.name}
                    </span>
                  )}
                  <span className={style.repoMetaItem} title="Обновлен">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(repo.updated_at)}
                  </span>
                </div>
              </div>
              <button
                className={style.selectRepoButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRepoSelect(repo);
                }}
              >
                Выбрать
              </button>
            </div>
          ))}

          {searchQuery && !isLoading && searchResults.length === 0 && (
            <div className={style.noResults}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <p>Ничего не найдено</p>
              <small>Попробуйте изменить поисковый запрос</small>
            </div>
          )}
        </div>

        <div className={style.modalFooter}>
          <p className={style.hint}>
            💡 <strong>Советы:</strong> Ищите по названию, владельцу или
            описанию. Например: "react", "vuejs/vue", "tensorflow/tensorflow"
          </p>
        </div>
      </div>
    </div>
  );
};

export default GitHubRepoModal;
