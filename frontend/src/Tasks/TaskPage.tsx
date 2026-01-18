import React, { useEffect, useState, useMemo } from 'react';
import styles from './TaskPage.module.scss';
import PageHeader from '../common/PageHeader';
import { SearchIcon } from '../UI/Icons';
import { Tasks } from '../MockData/Tasks.mockData';
import { ProjectsData } from '../MockData/Projects.Mockdata';
import { mockUsers } from '../MockData/UsersMock';

export default function TaskPage() {
  const [tasks, setTasks] = useState(Tasks);
  const [activeFilter, setActiveFilter] = useState<string>(() => {
    return localStorage.getItem('activeFilter') || 'All Tasks';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Due Date');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const currentUserId = 0; // Assuming current user ID is 0

  const btns = [
    { name: 'All Tasks' },
    { name: 'My Tasks' },
    { name: 'Overdue' },
    { name: 'Active' },
    { name: 'Blocked' },
    { name: 'Complete' },
  ];

  useEffect(() => {
    localStorage.setItem('activeFilter', activeFilter);
  }, [activeFilter]);

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // фильтры для задач
    if (activeFilter === 'All Tasks') {
      filtered = tasks;
    } else if (activeFilter === 'My Tasks') {
      filtered = tasks.filter((task) => task.assigneeId === currentUserId);
    } else if (activeFilter === 'Overdue') {
      filtered = tasks.filter((task) => task.status === 'overdue');
    } else if (activeFilter === 'Active') {
      filtered = tasks.filter((task) => task.status === 'active');
    } else if (activeFilter === 'Blocked') {
      filtered = tasks.filter((task) => task.status === 'blocked');
    } else if (activeFilter === 'Complete') {
      filtered = tasks.filter((task) => task.status === 'completed');
    }

    // поиск задач
    if (searchQuery) {
      filtered = filtered.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply sorting
    if (sortBy === 'Due Date') {
      filtered.sort((a, b) => {
        const dateA = typeof a.deadline === 'string' ? new Date(a.deadline).getTime() : 0;
        const dateB = typeof b.deadline === 'string' ? new Date(b.deadline).getTime() : 0;
        return dateA - dateB;
      });
    }

    return filtered;
  }, [tasks, activeFilter, searchQuery, sortBy, currentUserId]);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    return filteredTasks.slice(startIndex, startIndex + tasksPerPage);
  }, [filteredTasks, currentPage]);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  function Filter(name: string) {
    setActiveFilter(name);
    setCurrentPage(1);
  }

  const getProjectName = (projectId: number) => {
    const project = ProjectsData.find((p) => p.id === projectId);
    return project ? project.title : 'Unknown';
  };

  const getAssigneeName = (assigneeId?: number) => {
    if (assigneeId === undefined || assigneeId === null) return null;
    const user = mockUsers.find((u) => u.userid === assigneeId);
    return user ? user.name : null;
  };

  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      // если это строка с датой в формате YYYY-MM-DD
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      // если это строка с датой в другом формате
      if (date.includes('T') || date.includes('-')) {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
          return d.toISOString().split('T')[0];
        }
      }
      // если это не дата,просто возвращаем
      return date; // Return as-is for relative dates
    }
    return date.toISOString().split('T')[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'blocked':
        return styles.statusBlocked;
      case 'completed':
        return styles.statusComplete;
      case 'overdue':
        return styles.statusOverdue;
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return '';
    }
  };

  return (
    <div className={styles.TaskContainer}>
      <PageHeader />
      <section className={styles.dashboard}>
        <h1>Tasks</h1>
        <div className={styles.headerTasks}>
          <div className={styles.filterall}>
            {btns.map((btn) => (
              <button
                key={btn.name}
                className={`${styles.AllTasks} ${activeFilter === btn.name ? styles.active : ''}`}
                onClick={() => Filter(btn.name)}>
                <p>{btn.name}</p>
                <p className={styles.countTasks}>
                  {btn.name === 'All Tasks'
                    ? tasks.length
                    : btn.name === 'My Tasks'
                      ? tasks.filter((task) => task.assigneeId === currentUserId).length
                      : btn.name === 'Complete'
                        ? tasks.filter((task) => task.status === 'completed').length
                        : tasks.filter((task) => task.status === btn.name.toLowerCase()).length}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tasksControls}>
          <div className={styles.tasksInfo}>
            <span className={styles.totalTasks}>Total: {filteredTasks.length}</span>
            <div className={styles.sortContainer}>
              <span className={styles.sortLabel}>Sort By:</span>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value="Due Date">Due Date</option>
                <option value="Priority">Priority</option>
                <option value="Status">Status</option>
              </select>
            </div>
          </div>
          <div className={styles.tasksActions}>
            <div className={styles.searchContainer}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.createTaskBtn}>Create Task</button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.tasksTable}>
            <thead>
              <tr>
                <th className={styles.checkboxCol}>
                  <input type="checkbox" className={styles.checkbox} />
                </th>
                <th className={styles.titleCol}>Title</th>
                <th className={styles.statusCol}>
                  Status <span className={styles.sortArrow}>▼</span>
                </th>
                <th className={styles.priorityCol}>
                  Priority <span className={styles.sortArrow}>▼</span>
                </th>
                <th className={styles.assigneeCol}>Assignee</th>
                <th className={styles.dueDateCol}>
                  Due Date <span className={styles.sortArrow}>▼</span>
                </th>
                <th className={styles.projectCol}>Project</th>
                <th className={styles.actionsCol}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.map((task) => {
                const assigneeName = getAssigneeName(task.assigneeId);
                const projectName = getProjectName(task.projectId);
                const formattedDate = formatDate(task.deadline);

                return (
                  <tr key={task.id} className={styles.tableRow}>
                    <td className={styles.checkboxCol}>
                      <input type="checkbox" className={styles.checkbox} />
                    </td>
                    <td className={styles.titleCol}>
                      <span className={styles.taskTitle}>{task.name}</span>
                    </td>
                    <td className={styles.statusCol}>
                      <span className={`${styles.statusBadge} ${getStatusColor(task.status)}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </td>
                    <td className={styles.priorityCol}>
                      <span
                        className={`${styles.priorityBadge} ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </td>
                    <td className={styles.assigneeCol}>
                      {assigneeName ? (
                        <div className={styles.assigneeInfo}>
                          <div className={styles.assigneeAvatar}>
                            {assigneeName.charAt(0).toUpperCase()}
                          </div>
                          <span>{assigneeName}</span>
                        </div>
                      ) : (
                        <div className={styles.unassigned}>
                          <span className={styles.unassignedBadge}>2</span>
                          <span>Unassigned</span>
                        </div>
                      )}
                    </td>
                    <td className={styles.dueDateCol}>
                      <span className={styles.dueDate}>{formattedDate}</span>
                    </td>
                    <td className={styles.projectCol}>
                      <span className={styles.projectName}>{projectName}</span>
                    </td>
                    <td className={styles.actionsCol}>
                      <button className={styles.actionsBtn}>⋯</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.paginationBtn}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}>
              ‹
            </button>
            <span className={styles.paginationInfo}>
              {currentPage} / {totalPages}
            </span>
            <button
              className={styles.paginationBtn}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}>
              ›
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
