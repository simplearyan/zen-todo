import { Check, Star, Trash2, Sun } from 'lucide-react';
import type { Task } from '../../store/useStore';
import { useStore } from '../../store/useStore';

interface TaskItemProps {
    task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const { toggleComplete, toggleImportant, toggleMyDay, removeTask } = useStore();

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            <button
                className={`checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => toggleComplete(task.id)}
            >
                {task.completed && <Check size={14} />}
            </button>

            <div className="task-info">
                <span className="task-title">{task.title}</span>
                <div className="task-meta">
                    {task.myDay && (
                        <span className="meta-badge my-day">
                            <Sun size={10} /> My Day
                        </span>
                    )}
                    {task.dueDate && <span className="meta-badge">Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
            </div>

            <div className="task-actions">
                <button
                    className={`action-btn star ${task.important ? 'active' : ''}`}
                    onClick={() => toggleImportant(task.id)}
                    title="Mark as important"
                >
                    <Star size={18} fill={task.important ? 'var(--accent)' : 'none'} />
                </button>
                <button
                    className="action-btn delete"
                    onClick={() => removeTask(task.id)}
                    title="Delete task"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <style>{`
        .task-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          background-color: var(--surface);
          border-radius: var(--radius-md);
          margin-bottom: 0.5rem;
          border: 1px solid var(--border);
          transition: var(--transition);
        }

        .task-item:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
          transform: translateY(-1px);
        }

        .task-item.completed {
          opacity: 0.7;
        }

        .checkbox {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: var(--transition);
          cursor: pointer;
        }

        .checkbox.checked {
          background-color: var(--success);
          border-color: var(--success);
        }

        .task-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .task-title {
          font-weight: 500;
          color: var(--text);
          transition: var(--transition);
        }

        .completed .task-title {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .task-meta {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        .meta-badge {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .meta-badge.my-day {
          color: var(--primary);
        }

        .task-actions {
          display: flex;
          gap: 0.5rem;
          opacity: 0;
          transition: var(--transition);
        }

        .task-item:hover .task-actions {
          opacity: 1;
        }

        .action-btn {
          padding: 0.25rem;
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .action-btn:hover {
          background-color: var(--bg);
          color: var(--text);
        }

        .star.active {
          color: var(--accent);
        }

        .delete:hover {
          color: var(--error);
        }
      `}</style>
        </div>
    );
};

export default TaskItem;
