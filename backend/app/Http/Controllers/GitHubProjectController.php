<?php

namespace App\Http\Controllers;

use App\Models\Github_project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class GitHubProjectController
{
    public function index(Request $request): JsonResponse
    {
        $query = Github_project::query();
        $perPage = $request->get("per_page", 20);
        $projects = $query->orderByDesc("stargazers_count")->paginate($perPage);
        return response()->json([
            "success" => true,
            "data" => $projects,
        ]);
    }

    public function show($id): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }
        return response()->json([
            "success" => true,
            "data" => $project,
        ]);
    }

    /**
     * Получить данные репозитория из GitHub API
     */
    public function getRepoFromGitHub(Request $request): JsonResponse
    {
        $owner = $request->get('owner');
        $repo = $request->get('repo');
        
        if (!$owner || !$repo) {
            return response()->json([
                "success" => false,
                "message" => "Owner and repo parameters are required.",
            ], 400);
        }

        $githubToken = env('GITHUB_API_TOKEN');
        $url = "https://api.github.com/repos/{$owner}/{$repo}";
        
        $headers = [
            'Accept' => 'application/vnd.github.v3+json',
            'User-Agent' => 'Novexx-App/1.0',
        ];
        
        if ($githubToken) {
            $headers['Authorization'] = "token {$githubToken}";
        }

        try {
            $client = new \GuzzleHttp\Client();
            $response = $client->get($url, [
                'headers' => $headers,
                'timeout' => 15,
            ]);
            
            $statusCode = $response->getStatusCode();
            $data = json_decode($response->getBody(), true);
            
            if ($statusCode === 200) {
                return response()->json([
                    "success" => true,
                    "data" => $data,
                    "source" => "github_api",
                ]);
            } else {
                return response()->json([
                    "success" => false,
                    "message" => "GitHub API returned status: {$statusCode}",
                    "status" => $statusCode,
                ], $statusCode);
            }
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $statusCode = $e->getResponse()->getStatusCode();
            
            // Если это 403 и нет токена, предлагаем решение
            if ($statusCode === 403 && !$githubToken) {
                return response()->json([
                    "success" => false,
                    "message" => "GitHub API rate limit exceeded for unauthenticated requests.",
                    "status" => $statusCode,
                    "solution" => "Add a GitHub personal access token to your .env file as GITHUB_API_TOKEN",
                    "details" => "Unauthenticated requests to GitHub API are limited to 60 requests per hour. Please add a GitHub token or try again later.",
                ], $statusCode);
            }
            
            return response()->json([
                "success" => false,
                "message" => "GitHub API error: {$statusCode}",
                "status" => $statusCode,
                "details" => $statusCode === 403 ? "Rate limit exceeded or access denied. Try again later or add GitHub token." : "Repository not found or access denied.",
            ], $statusCode);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Failed to fetch repository data: " . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "github_id" => "required|string|unique:github_projects,github_id",
            "full_name" => "required|string|unique:github_projects,full_name",
            "name" => "required|string",
            "owner_login" => "required|string",
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    "success" => false,
                    "errors" => $validator->errors(),
                ],
                422,
            );
        }

        $project = Github_project::create([
            "user_id" => $request->user_id,
            "owner_github_id" => $request->owner_id ?? null,
            "owner_login" => $request->owner_login,
            "owner_name" => $request->owner_name ?? null,
            "owner_avatar_url" => $request->owner_avatar_url ?? null,
            "owner_html_url" => $request->owner_html_url ?? null,
            "owner_type" => $request->owner_type ?? "User",
            "github_id" => $request->github_id,
            "name" => $request->name,
            "full_name" => $request->full_name,
            "private" => $request->boolean("private", false),
            "description" => $request->description,
            "html_url" => $request->html_url,
            "clone_url" => $request->clone_url,
            "ssh_url" => $request->ssh_url,
            "homepage" => $request->homepage,
            "language" => $request->language,
            "stargazers_count" => $request->stargazers_count ?? 0,
            "watchers_count" => $request->watchers_count ?? 0,
            "forks_count" => $request->forks_count ?? 0,
            "open_issues_count" => $request->open_issues_count ?? 0,
            "size" => $request->size ?? 0,
            "github_created_at" =>
                $request->github_created_at ?? ($request->created_at ?? now()),
            "github_updated_at" =>
                $request->github_updated_at ?? $request->updated_at,
            "github_pushed_at" =>
                $request->github_pushed_at ?? $request->pushed_at,
            "fork" => $request->boolean("fork", false),
            "archived" => $request->boolean("archived", false),
            "disabled" => $request->boolean("disabled", false),
            "template" => $request->boolean("template", false),
            "default_branch" => $request->default_branch ?? "main",
            "topics" => $request->topics ?? [],
            "license" => $request->license,
            "raw_data" => $request->all(),
            "status" => "active",
            "tags" => $request->tags ?? [],
        ]);

        return response()->json(
            [
                "success" => true,
                "data" => $project,
                "message" => "Project created successfully.",
            ],
            201,
        );
    }

    public function bulkImport(Request $request): JsonResponse
    {
        $projectsData = $request->input("projects", []);
        if (empty($projectsData)) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "No projects data provided.",
                ],
                400,
            );
        }

        $imported = 0;
        $errors = [];

        foreach ($projectsData as $index => $projectData) {
            try {
                if (
                    !isset(
                        $projectData["github_id"],
                        $projectData["full_name"],
                        $projectData["name"],
                    )
                ) {
                    $errors[] = "Project at index {$index} missing required fields";
                    continue;
                }

                Github_project::updateOrCreate(
                    ["github_id" => $projectData["github_id"]],
                    [
                        "user_id" => $projectData["user_id"] ?? null,
                        "owner_login" => $projectData["owner_login"],
                        "owner_name" => $projectData["owner_name"] ?? null,
                        "owner_avatar_url" =>
                            $projectData["owner_avatar_url"] ?? null,
                        "owner_html_url" =>
                            $projectData["owner_html_url"] ?? null,
                        "owner_type" => $projectData["owner_type"] ?? "User",
                        "name" => $projectData["name"],
                        "full_name" => $projectData["full_name"],
                        "description" => $projectData["description"] ?? null,
                        "html_url" => $projectData["html_url"] ?? null,
                        "clone_url" => $projectData["clone_url"] ?? null,
                        "language" => $projectData["language"] ?? null,
                        "stargazers_count" =>
                            $projectData["stargazers_count"] ?? 0,
                        "forks_count" => $projectData["forks_count"] ?? 0,
                        "open_issues_count" =>
                            $projectData["open_issues_count"] ?? 0,
                        "size" => $projectData["size"] ?? 0,
                        "github_created_at" =>
                            $projectData["github_created_at"] ?? now(),
                        "github_updated_at" =>
                            $projectData["github_updated_at"] ?? null,
                        "default_branch" =>
                            $projectData["default_branch"] ?? "main",
                        "topics" => $projectData["topics"] ?? [],
                        "status" => "active",
                    ],
                );

                $imported++;
            } catch (\Exception $e) {
                $errors[] =
                    "Error importing project at index {$index}: " .
                    $e->getMessage();
            }
        }

        return response()->json([
            "success" => true,
            "message" => "Imported {$imported} projects successfully.",
            "imported_count" => $imported,
            "error_count" => count($errors),
            "errors" => $errors,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }

        $validated = $request->validate([
            "description" => "sometimes|string|nullable",
            "language" => "sometimes|string|nullable",
            "status" => "sometimes|in:active,archived,hidden",
            "tags" => "sometimes|array",
        ]);

        $project->update($validated);

        return response()->json([
            "success" => true,
            "data" => $project->fresh(),
            "message" => "Project updated successfully.",
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }

        $project->delete();

        return response()->json([
            "success" => true,
            "message" => "Project deleted successfully.",
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $search = $request->get("q", "");
        if (empty($search)) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Search query is required.",
                ],
                400,
            );
        }

        $projects = Github_project::where("name", "like", "%{$search}%")
            ->orWhere("full_name", "like", "%{$search}%")
            ->orWhere("description", "like", "%{$search}%")
            ->orWhere("owner_login", "like", "%{$search}%")
            ->orderByDesc("stargazers_count")
            ->paginate(20);

        return response()->json([
            "success" => true,
            "data" => $projects,
        ]);
    }

    public function filter(Request $request): JsonResponse
    {
        $query = Github_project::query();
        if ($request->has("language")) {
            $query->where("language", $request->language);
        }
        if ($request->has("min_stars")) {
            $query->where("stargazers_count", ">=", $request->min_stars);
        }
        if ($request->has("owner_login")) {
            $query->where("owner_login", $request->owner_login);
        }
        if ($request->has("status")) {
            $query->where("status", $request->status);
        }

        $projects = $query->orderByDesc("stargazers_count")->paginate(20);
        return response()->json([
            "success" => true,
            "data" => $projects,
        ]);
    }

    public function byLanguage($language): JsonResponse
    {
        $projects = Github_project::where("language", $language)
            ->orderByDesc("stargazers_count")
            ->paginate(20);
        return response()->json([
            "success" => true,
            "data" => $projects,
            "language" => $language,
        ]);
    }

    public function byOwner($ownerLogin): JsonResponse
    {
        $projects = Github_project::where("owner_login", $ownerLogin)
            ->orderByDesc("stargazers_count")
            ->paginate(20);
        return response()->json([
            "success" => true,
            "data" => $projects,
            "owner" => $ownerLogin,
        ]);
    }

    public function popular(Request $request): JsonResponse
    {
        $minStars = $request->get("min_stars", 100);
        $projects = Github_project::where("stargazers_count", ">=", $minStars)
            ->orderByDesc("stargazers_count")
            ->paginate(20);
        return response()->json([
            "success" => true,
            "data" => $projects,
            "min_stars" => $minStars,
        ]);
    }

    public function recentlyUpdated(Request $request): JsonResponse
    {
        $days = $request->get("days", 30);
        $date = now()->subDays($days);
        $projects = Github_project::where("github_updated_at", ">=", $date)
            ->orderByDesc("github_updated_at")
            ->paginate(20);
        return response()->json([
            "success" => true,
            "data" => $projects,
            "days" => $days,
        ]);
    }

    public function trending(): JsonResponse
    {
        $date = now()->subDays(7);
        $projects = Github_project::where("github_updated_at", ">=", $date)
            ->orderByDesc("stargazers_count")
            ->paginate(10);
        return response()->json([
            "success" => true,
            "data" => $projects,
        ]);
    }

    public function getUsers($id): JsonResponse
    {
        $project = Github_project::with("users")->find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }
        return response()->json([
            "success" => true,
            "data" => $project->users,
        ]);
    }

    public function addUser(Request $request, $id): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }

        $request->validate([
            "user_id" => "required|exists:users,id",
            "role" => "required|in:owner,contributor,watcher",
        ]);

        if ($project->users()->where("user_id", $request->user_id)->exists()) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "User already added to project.",
                ],
                400,
            );
        }

        $project->users()->attach($request->user_id, [
            "role" => $request->role,
            "permissions" => json_encode([]),
        ]);

        return response()->json([
            "success" => true,
            "message" => "User added to project.",
        ]);
    }

    public function removeUser($id, $userId): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }

        $project->users()->detach($userId);

        return response()->json([
            "success" => true,
            "message" => "User removed from project.",
        ]);
    }

    public function updateUserRole(Request $request, $id, $userId): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }

        $request->validate([
            "role" => "required|in:owner,contributor,watcher",
        ]);

        $project->users()->updateExistingPivot($userId, [
            "role" => $request->role,
        ]);

        return response()->json([
            "success" => true,
            "message" => "User role updated.",
        ]);
    }

    public function getTags($id): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }
        return response()->json([
            "success" => true,
            "data" => $project->tags ?? [],
        ]);
    }

    public function addTag(Request $request, $id): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }

        $request->validate([
            "tag" => "required|string",
        ]);

        $tags = $project->tags ?? [];
        if (!in_array($request->tag, $tags)) {
            $tags[] = $request->tag;
            $project->update(["tags" => $tags]);
        }

        return response()->json([
            "success" => true,
            "message" => "Tag added to project.",
            "tags" => $tags,
        ]);
    }

    public function removeTag($id, $tag): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }

        $tags = $project->tags ?? [];
        $key = array_search($tag, $tags);
        if ($key !== false) {
            unset($tags[$key]);
            $tags = array_values($tags);
            $project->update(["tags" => $tags]);
        }

        return response()->json([
            "success" => true,
            "message" => "Tag removed from project.",
            "tags" => $tags,
        ]);
    }

    public function byTag($tag): JsonResponse
    {
        $projects = Github_project::whereJsonContains("tags", $tag)
            ->orderByDesc("stargazers_count")
            ->paginate(20);
        return response()->json([
            "success" => true,
            "data" => $projects,
            "tag" => $tag,
        ]);
    }

    public function overallStats(): JsonResponse
    {
        $totalProjects = Github_project::count();
        $totalStars = Github_project::sum("stargazers_count");
        $totalForks = Github_project::sum("forks_count");
        $totalIssues = Github_project::sum("open_issues_count");

        return response()->json([
            "success" => true,
            "data" => [
                "total_projects" => $totalProjects,
                "total_stars" => $totalStars,
                "total_forks" => $totalForks,
                "total_issues" => $totalIssues,
                "avg_stars_per_project" =>
                    $totalProjects > 0
                        ? round($totalStars / $totalProjects, 2)
                        : 0,
            ],
        ]);
    }

    public function languageStats(): JsonResponse
    {
        $languages = Github_project::whereNotNull("language")
            ->select(
                "language",
                DB::raw("count(*) as project_count"),
                DB::raw("sum(stargazers_count) as total_stars"),
            )
            ->groupBy("language")
            ->orderByDesc("total_stars")
            ->limit(10)
            ->get();

        return response()->json([
            "success" => true,
            "data" => $languages,
        ]);
    }

    public function topProjects(Request $request): JsonResponse
    {
        $limit = $request->get("limit", 10);
        $projects = Github_project::orderByDesc("stargazers_count")
            ->limit($limit)
            ->get();

        return response()->json([
            "success" => true,
            "data" => $projects,
        ]);
    }

    public function activityStats(): JsonResponse
    {
        $recentProjects = Github_project::where(
            "github_updated_at",
            ">=",
            now()->subDays(30),
        )->count();

        $newProjects = Github_project::where(
            "github_created_at",
            ">=",
            now()->subDays(30),
        )->count();

        return response()->json([
            "success" => true,
            "data" => [
                "recently_updated_projects" => $recentProjects,
                "new_projects_last_30_days" => $newProjects,
            ],
        ]);
    }

    public function getUserProjects($userId): JsonResponse
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "User not found.",
                ],
                404,
            );
        }

        $projects = Github_project::where("user_id", $userId)
            ->orWhereHas("users", function ($query) use ($userId) {
                $query->where("user_id", $userId);
            })
            ->orderByDesc("stargazers_count")
            ->paginate(20);

        return response()->json([
            "success" => true,
            "user" => $user,
            "data" => $projects,
        ]);
    }

    public function myProjects($userId): JsonResponse
    {
        return $this->getUserProjects($userId);
    }

    public function syncWithGitHub($id): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }

        $project->update([
            "github_updated_at" => now(),
        ]);

        return response()->json([
            "success" => true,
            "message" => "Project synchronized with GitHub (simulated).",
            "data" => $project,
        ]);
    }

    public function archive($id): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }

        $project->update(["status" => "archived"]);

        return response()->json([
            "success" => true,
            "message" => "Project archived.",
            "data" => $project,
        ]);
    }

    public function restore($id): JsonResponse
    {
        $project = Github_project::find($id);
        if (!$project) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Project not found.",
                ],
                404,
            );
        }

        $project->update(["status" => "active"]);

        return response()->json([
            "success" => true,
            "message" => "Project restored.",
            "data" => $project,
        ]);
    }
}
