import { Check, Star, Sun } from 'lucide-react';
import type { Task } from '../../store/useStore';
import { useStore } from '../../store/useStore';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleComplete, toggleImportant, selectedTaskId, setSelectedTaskId } = useStore();
  const isSelected = selectedTaskId === task.id;

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => setSelectedTaskId(task.id)}
      style={{ cursor: 'pointer' }}
    >
      <button
        className={`complete-btn ${task.completed ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleComplete(task.id);
        }}
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
          {(task.subtasks || []).length > 0 && (
            <span className="meta-badge">
              {task.subtasks!.filter(s => s.completed).length}/{task.subtasks!.length} subtasks
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          className={`action-btn star ${task.important ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleImportant(task.id);
          }}
          title={task.important ? "Remove importance" : "Mark as important"}
        >
          <Star size={16} fill={task.important ? "currentColor" : "none"} />
        </button>
      </div>

      <style>{`
        .task-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: var(--surface);
          border: 1px solid var(--border);
          padding: 0.875rem 1rem;
          border-radius: var(--radius-lg);
          margin-bottom: 0.5rem;
          transition: var(--transition);
          position: relative;
          user-select: none;
        }

        .task-item:hover {
          background-color: var(--surface-hover);
          border-color: var(--primary-rgb);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .task-item.selected {
          border-color: var(--primary);
          background-color: rgba(var(--primary-rgb), 0.05);
          box-shadow: 0 0 0 1px var(--primary);
        }

        .complete-btn {
          width: 20px;
          height: 20px;
          border: 2px solid var(--text-muted);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .complete-btn.active {
          background-color: var(--success);
          border-color: var(--success);
        }

        .task-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .task-title {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text);
          transition: var(--transition);
        }

        .task-item.completed .task-title {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .task-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .meta-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .meta-badge.my-day {
          color: var(--primary);
        }

        .action-btn {
          padding: 0.5rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .action-btn:hover {
          background-color: rgba(var(--primary-rgb), 0.1);
          color: var(--text);
        }

        .action-btn.star.active {
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
