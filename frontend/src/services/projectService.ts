import { httpClient } from "./httpClient";

export interface Project {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
  progress?: number;
  members?: number;
  tasks?: number;
  status?: string;
  owner?: User;
  users?: User[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  avatar?: string;
  position?: string;
  department?: string;
  online?: boolean;
}

export interface GitHubRepo {
  id: number;
  github_id: string;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  clone_url?: string;
  ssh_url?: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  owner_login: string;
  owner_name?: string;
  owner_avatar_url?: string;
  owner_html_url?: string;
  default_branch: string;
  github_created_at: string;
  github_updated_at: string;
  github_pushed_at?: string;
  status: "active" | "archived" | "hidden";
  tags: string[];
  topics?: string[];
  license?: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  };
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  template: boolean;
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubSearchResult {
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
    html_url: string;
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

export interface GitHubStats {
  total_projects: number;
  total_stars: number;
  total_forks: number;
  total_issues: number;
  avg_stars_per_project: number;
}

export interface LanguageStat {
  language: string;
  project_count: number;
  total_stars: number;
}

export interface ActivityStats {
  recently_updated_projects: number;
  new_projects_last_30_days: number;
}

class ProjectService {
  // Создать проект
  async createProject(projectData: {
    title: string;
    description: string;
    owner_id: number;
  }): Promise<Project> {
    return httpClient.post<Project>("/projects/create", projectData);
  }

  // Получить проекты пользователя
  async getUserProjects(userId: number): Promise<Project[]> {
    return httpClient.get<Project[]>("/projects", {
      params: { user_id: userId },
    });
  }

  // Получить проект по ID
  async getProjectById(projectId: number): Promise<Project> {
    return httpClient.get<Project>(`/projects/${projectId}`);
  }

  // Обновить проект
  async updateProject(
    projectId: number,
    data: Partial<Project>,
  ): Promise<Project> {
    return httpClient.put<Project>(`/projects/${projectId}`, data);
  }

  // Удалить проект
  async deleteProject(projectId: number): Promise<void> {
    return httpClient.delete(`/projects/${projectId}`);
  }

  // Получить участников проекта
  async getProjectMembers(projectId: number): Promise<User[]> {
    return httpClient.get<User[]>(`/projects/${projectId}/members`);
  }

  // Добавить участника в проект
  async addMember(projectId: number, userId: number): Promise<void> {
    return httpClient.post(`/projects/${projectId}/members`, {
      user_id: userId,
    });
  }

  // Удалить участника из проекта
  async removeMember(projectId: number, userId: number): Promise<void> {
    return httpClient.delete(`/projects/${projectId}/members/${userId}`);
  }

  // ========== GitHub методы ==========

  // Получить GitHub репозитории проекта (использует ID текущего пользователя)
  async getProjectGitHubRepos(projectId: number): Promise<GitHubRepo[]> {
    // Временное решение: используем ID текущего пользователя
    // TODO: создать endpoint для получения репозиториев по projectId
    const user = await this.getCurrentUser();
    if (!user?.id) {
      throw new Error("Пользователь не авторизован");
    }
    return this.getUserGitHubRepos(user.id);
  }

  // Получить GitHub репозитории пользователя
  async getUserGitHubRepos(userId: number): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>(
      `/github-projects/user/${userId}/projects`,
    );
  }

  // Вспомогательный метод для получения текущего пользователя
  private async getCurrentUser(): Promise<{ id: number } | null> {
    // Здесь должна быть логика получения текущего пользователя
    // Временная заглушка - возвращаем null
    return null;
  }

  // Получить конкретный GitHub репозиторий
  async getGitHubRepo(repoId: number): Promise<GitHubRepo> {
    return httpClient.get<GitHubRepo>(`/github-projects/${repoId}`);
  }

  // Создать/добавить GitHub репозиторий
  async createGitHubRepo(repoData: {
    github_id: string;
    name: string;
    full_name: string;
    owner_login: string;
    description?: string;
    html_url: string;
    clone_url?: string;
    ssh_url?: string;
    language?: string;
    stargazers_count?: number;
    forks_count?: number;
    open_issues_count?: number;
    size?: number;
    github_created_at?: string;
    github_updated_at?: string;
    github_pushed_at?: string;
    default_branch?: string;
    topics?: string[];
    license?: any;
    user_id?: number;
    tags?: string[];
  }): Promise<GitHubRepo> {
    return httpClient.post<GitHubRepo>("/github-projects", repoData);
  }

  // Обновить GitHub репозиторий
  async updateGitHubRepo(
    repoId: number,
    data: Partial<GitHubRepo>,
  ): Promise<GitHubRepo> {
    return httpClient.put<GitHubRepo>(`/github-projects/${repoId}`, data);
  }

  // Удалить GitHub репозиторий
  async deleteGitHubRepo(repoId: number): Promise<void> {
    return httpClient.delete(`/github-projects/${repoId}`);
  }

  // Массовый импорт GitHub репозиториев
  async bulkImportGitHubRepos(projectsData: any[]): Promise<{
    success: boolean;
    message: string;
    imported_count: number;
    error_count: number;
    errors: string[];
  }> {
    return httpClient.post("/github-projects/bulk-import", {
      projects: projectsData,
    });
  }

  // Синхронизировать с GitHub
  async syncGitHubRepo(repoId: number): Promise<GitHubRepo> {
    return httpClient.post<GitHubRepo>(`/github-projects/sync/${repoId}`);
  }

  // Поиск GitHub репозиториев
  async searchGitHubRepos(query: string): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>("/github-projects/search", {
      params: { q: query },
    });
  }

  // Фильтрация GitHub репозиториев
  async filterGitHubRepos(filters: {
    language?: string;
    min_stars?: number;
    owner_login?: string;
    status?: string;
  }): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>("/github-projects/filter", {
      params: filters,
    });
  }

  // Получить репозитории по языку
  async getGitHubReposByLanguage(language: string): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>(
      `/github-projects/language/${language}`,
    );
  }

  // Получить репозитории по владельцу
  async getGitHubReposByOwner(ownerLogin: string): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>(`/github-projects/owner/${ownerLogin}`);
  }

  // Получить популярные репозитории
  async getPopularGitHubRepos(minStars: number = 100): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>("/github-projects/popular", {
      params: { min_stars: minStars },
    });
  }

  // Получить недавно обновленные репозитории
  async getRecentlyUpdatedGitHubRepos(
    days: number = 30,
  ): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>("/github-projects/recent", {
      params: { days },
    });
  }

  // Получить трендовые репозитории
  async getTrendingGitHubRepos(): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>("/github-projects/trending");
  }

  // Получить пользователей GitHub репозитория
  async getGitHubRepoUsers(repoId: number): Promise<User[]> {
    return httpClient.get<User[]>(`/github-projects/${repoId}/users`);
  }

  // Добавить пользователя в GitHub репозиторий
  async addUserToGitHubRepo(
    repoId: number,
    userId: number,
    role: string,
  ): Promise<void> {
    return httpClient.post(`/github-projects/${repoId}/users`, {
      user_id: userId,
      role,
    });
  }

  // Удалить пользователя из GitHub репозитория
  async removeUserFromGitHubRepo(
    repoId: number,
    userId: number,
  ): Promise<void> {
    return httpClient.delete(`/github-projects/${repoId}/users/${userId}`);
  }

  // Обновить роль пользователя в GitHub репозитории
  async updateUserRoleInGitHubRepo(
    repoId: number,
    userId: number,
    role: string,
  ): Promise<void> {
    return httpClient.put(`/github-projects/${repoId}/users/${userId}/role`, {
      role,
    });
  }

  // Получить теги GitHub репозитория
  async getGitHubRepoTags(repoId: number): Promise<string[]> {
    return httpClient.get<string[]>(`/github-projects/${repoId}/tags`);
  }

  // Добавить тег к GitHub репозиторию
  async addTagToGitHubRepo(repoId: number, tag: string): Promise<string[]> {
    return httpClient.post<string[]>(`/github-projects/${repoId}/tags`, {
      tag,
    });
  }

  // Удалить тег из GitHub репозитория
  async removeTagFromGitHubRepo(
    repoId: number,
    tag: string,
  ): Promise<string[]> {
    return httpClient.delete<string[]>(
      `/github-projects/${repoId}/tags/${tag}`,
    );
  }

  // Получить репозитории по тегу
  async getGitHubReposByTag(tag: string): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>(`/github-projects/tag/${tag}`);
  }

  // Получить общую статистику
  async getGitHubOverallStats(): Promise<GitHubStats> {
    return httpClient.get<GitHubStats>("/github-projects/stats/overall");
  }

  // Получить статистику по языкам
  async getGitHubLanguageStats(): Promise<LanguageStat[]> {
    return httpClient.get<LanguageStat[]>("/github-projects/stats/languages");
  }

  // Получить топ проектов
  async getTopGitHubProjects(limit: number = 10): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>("/github-projects/stats/top-projects", {
      params: { limit },
    });
  }

  // Получить статистику активности
  async getGitHubActivityStats(): Promise<ActivityStats> {
    return httpClient.get<ActivityStats>("/github-projects/stats/activity");
  }

  // Архивировать GitHub репозиторий
  async archiveGitHubRepo(repoId: number): Promise<GitHubRepo> {
    return httpClient.post<GitHubRepo>(`/github-projects/${repoId}/archive`);
  }

  // Восстановить GitHub репозиторий
  async restoreGitHubRepo(repoId: number): Promise<GitHubRepo> {
    return httpClient.post<GitHubRepo>(`/github-projects/${repoId}/restore`);
  }

  // ========== Внешние GitHub API методы ==========

  // Вспомогательная функция для очистки имени репозитория
  private cleanRepoName(repoName: string): string {
    // Убираем .git в конце, если есть
    return repoName.replace(/\.git$/, "");
  }

  // Поиск репозиториев на GitHub (через публичное API)
  async searchGitHubReposExternal(
    query: string,
  ): Promise<GitHubSearchResult[]> {
    try {
      const cleanQuery = query.replace(/\.git$/, "");
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(cleanQuery)}&sort=stars&order=desc&per_page=10`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // При необходимости добавьте токен авторизации:
          // 'Authorization': `token ${yourToken}`
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `GitHub API error 404: Repository not found. Check query: ${query}`,
          );
        }
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error("Error searching GitHub repos:", error);
      throw error;
    }
  }

  // Получить детальную информацию о репозитории с GitHub
  async getGitHubRepoDetailsExternal(
    owner: string,
    repo: string,
  ): Promise<any> {
    try {
      const cleanRepo = this.cleanRepoName(repo);
      const cleanOwner = owner.trim();

      if (!cleanOwner || !cleanRepo) {
        throw new Error("Owner and repository name are required");
      }

      const url = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}`;
      console.log("Fetching from GitHub API:", url); // Для отладки

      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // При необходимости добавьте токен авторизации:
          // 'Authorization': `token ${yourToken}`
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Repository not found: ${cleanOwner}/${cleanRepo}. Check if the repository exists and is public.`,
          );
        }
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching GitHub repo details:", error);
      throw error;
    }
  }

  // Получить коммиты репозитория
  async getGitHubRepoCommits(
    owner: string,
    repo: string,
    branch: string = "main",
    perPage: number = 5,
  ): Promise<any[]> {
    try {
      const cleanRepo = this.cleanRepoName(repo);
      const cleanOwner = owner.trim();

      if (!cleanOwner || !cleanRepo) {
        throw new Error("Owner and repository name are required");
      }

      const url = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/commits?sha=${branch}&per_page=${perPage}`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Repository or branch not found: ${cleanOwner}/${cleanRepo}#${branch}`,
          );
        }
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching GitHub commits:", error);
      throw error;
    }
  }

  // Получить ветки репозитория
  async getGitHubRepoBranches(owner: string, repo: string): Promise<any[]> {
    try {
      const cleanRepo = this.cleanRepoName(repo);
      const cleanOwner = owner.trim();

      if (!cleanOwner || !cleanRepo) {
        throw new Error("Owner and repository name are required");
      }

      const url = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/branches`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Repository not found: ${cleanOwner}/${cleanRepo}`);
        }
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching GitHub branches:", error);
      throw error;
    }
  }

  // Новый метод: Добавить GitHub репозиторий по URL
  async addGitHubRepoByUrl(
    githubUrl: string,
    userId?: number,
  ): Promise<GitHubRepo> {
    try {
      // Извлекаем owner и repo из URL
      const urlPatterns = [
        /github\.com\/([^\/]+)\/([^\/\.]+)(?:\.git)?$/,
        /github\.com\/([^\/]+)\/([^\/]+)\/?$/,
      ];

      let owner = "";
      let repo = "";

      for (const pattern of urlPatterns) {
        const match = githubUrl.match(pattern);
        if (match) {
          owner = match[1];
          repo = this.cleanRepoName(match[2]);
          break;
        }
      }

      if (!owner || !repo) {
        throw new Error(
          `Invalid GitHub URL: ${githubUrl}. Expected format: https://github.com/owner/repo`,
        );
      }

      // Получаем данные с GitHub
      const githubData = await this.getGitHubRepoDetailsExternal(owner, repo);

      // Преобразуем в нашу модель
      const repoData = this.convertGitHubApiToModel(githubData);

      // Добавляем user_id если передан
      if (userId) {
        repoData.user_id = userId;
      }

      // Сохраняем в нашу базу
      return await this.createGitHubRepo(repoData as any);
    } catch (error) {
      console.error("Error adding GitHub repo by URL:", error);
      throw error;
    }
  }

  // ========== Вспомогательные методы ==========

  // Получить все мои GitHub проекты
  async getMyGitHubProjects(userId: number): Promise<GitHubRepo[]> {
    return httpClient.get<GitHubRepo[]>(`/github-projects/my/${userId}`);
  }

  // Проверить, есть ли репозиторий уже добавлен
  async checkGitHubRepoExists(githubId: string): Promise<boolean> {
    try {
      // Попробуем найти репозиторий через поиск
      const repos = await this.searchGitHubRepos(`github_id:${githubId}`);
      return repos.length > 0;
    } catch (error) {
      console.error("Error checking repo existence:", error);
      return false;
    }
  }

  // Проверить, доступен ли репозиторий на GitHub
  async checkGitHubRepoAccessible(
    owner: string,
    repo: string,
  ): Promise<boolean> {
    try {
      await this.getGitHubRepoDetailsExternal(owner, repo);
      return true;
    } catch (error) {
      console.log(`Repository ${owner}/${repo} is not accessible:`, error);
      return false;
    }
  }

  // Преобразовать GitHub API ответ в нашу модель
  convertGitHubApiToModel(githubData: any): Partial<GitHubRepo> {
    return {
      github_id: githubData.id.toString(),
      name: githubData.name,
      full_name: githubData.full_name,
      description: githubData.description || "",
      html_url: githubData.html_url,
      clone_url: githubData.clone_url,
      ssh_url: githubData.ssh_url,
      language: githubData.language || null,
      stargazers_count: githubData.stargazers_count || 0,
      forks_count: githubData.forks_count || 0,
      open_issues_count: githubData.open_issues_count || 0,
      size: githubData.size || 0,
      owner_login: githubData.owner.login,
      owner_name: githubData.owner.name || githubData.owner.login,
      owner_avatar_url: githubData.owner.avatar_url,
      owner_html_url: githubData.owner.html_url,
      default_branch: githubData.default_branch || "main",
      github_created_at: githubData.created_at,
      github_updated_at: githubData.updated_at,
      github_pushed_at: githubData.pushed_at,
      topics: githubData.topics || [],
      license: githubData.license || null,
      fork: githubData.fork || false,
      archived: githubData.archived || false,
      disabled: githubData.disabled || false,
      template: githubData.template || false,
      status: "active",
      tags: [],
    };
  }

  // Получить репозитории с пагинацией
  async getGitHubReposPaginated(
    page: number = 1,
    perPage: number = 20,
  ): Promise<{
    data: GitHubRepo[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  }> {
    return httpClient.get("/github-projects", {
      params: { page, per_page: perPage },
    });
  }

  // Получить репозитории с фильтрацией и пагинацией
  async getGitHubReposWithFilters(filters: {
    language?: string;
    min_stars?: number;
    owner_login?: string;
    status?: string;
    q?: string;
    page?: number;
    per_page?: number;
  }): Promise<{
    data: GitHubRepo[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  }> {
    const endpoint = filters.q
      ? "/github-projects/search"
      : "/github-projects/filter";
    return httpClient.get(endpoint, { params: filters });
  }

  // Парсинг GitHub URL
  parseGitHubUrl(githubUrl: string): { owner: string; repo: string } | null {
    try {
      const url = new URL(githubUrl);
      if (url.hostname !== "github.com") {
        return null;
      }

      const pathParts = url.pathname
        .split("/")
        .filter((part) => part.length > 0);
      if (pathParts.length < 2) {
        return null;
      }

      const owner = pathParts[0];
      const repo = this.cleanRepoName(pathParts[1]);

      return { owner, repo };
    } catch (error) {
      console.error("Error parsing GitHub URL:", error);
      return null;
    }
  }
}

export const projectService = new ProjectService();
export default projectService;
