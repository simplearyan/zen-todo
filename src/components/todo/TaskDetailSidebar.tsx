import { X, Star, Sun, Calendar, Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Subtask } from '../../store/useStore';

const TaskDetailSidebar: React.FC = () => {
    const { selectedTaskId, tasks, setSelectedTaskId, updateTask, removeTask, toggleImportant, toggleMyDay } = useStore();

    const task = tasks.find(t => t.id === selectedTaskId);

    if (!selectedTaskId || !task) return null;

    const handleAddSubtask = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            const newSubtask: Subtask = {
                id: crypto.randomUUID(),
                title: e.currentTarget.value.trim(),
                completed: false
            };
            updateTask(task.id, { subtasks: [...(task.subtasks || []), newSubtask] });
            e.currentTarget.value = '';
        }
    };

    const toggleSubtask = (subtaskId: string) => {
        const updatedSubtasks = (task.subtasks || []).map(s =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        updateTask(task.id, { subtasks: updatedSubtasks });
    };

    const removeSubtask = (subtaskId: string) => {
        const updatedSubtasks = (task.subtasks || []).filter(s => s.id !== subtaskId);
        updateTask(task.id, { subtasks: updatedSubtasks });
    };

    return (
        <aside className="task-detail-sidebar">
            <div className="detail-header">
                <button className="close-btn" onClick={() => setSelectedTaskId(null)}>
                    <X size={20} />
                </button>
                <div className="task-main-info">
                    <div className="title-row">
                        <button
                            className={`complete-btn ${task.completed ? 'completed' : ''}`}
                            onClick={() => updateTask(task.id, { completed: !task.completed })}
                        >
                            {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                        <textarea
                            className="task-title-input"
                            value={task.title}
                            onChange={(e) => updateTask(task.id, { title: e.target.value })}
                            rows={1}
                        />
                        <button
                            className={`important-btn ${task.important ? 'active' : ''}`}
                            onClick={() => toggleImportant(task.id)}
                        >
                            <Star size={20} fill={task.important ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="detail-content">
                <div className="detail-section subtasks-section">
                    <div className="subtasks-list">
                        {(task.subtasks || []).map(subtask => (
                            <div key={subtask.id} className="subtask-item">
                                <button onClick={() => toggleSubtask(subtask.id)}>
                                    {subtask.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                </button>
                                <span className={subtask.completed ? 'completed' : ''}>{subtask.title}</span>
                                <button className="delete-subtask" onClick={() => removeSubtask(subtask.id)}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="add-subtask">
                        <Plus size={16} />
                        <input
                            type="text"
                            placeholder="Add subtask"
                            onKeyDown={handleAddSubtask}
                        />
                    </div>
                </div>

                <div className="detail-section actions-section">
                    <button
                        className={`action-btn ${task.myDay ? 'active' : ''}`}
                        onClick={() => toggleMyDay(task.id)}
                    >
                        <Sun size={18} />
                        <span>{task.myDay ? 'Added to My Day' : 'Add to My Day'}</span>
                    </button>
                    <button className="action-btn">
                        <Calendar size={18} />
                        <span>Add due date</span>
                    </button>
                </div>

                <div className="detail-section note-section">
                    <textarea
                        placeholder="Add note"
                        value={task.description}
                        onChange={(e) => updateTask(task.id, { description: e.target.value })}
                    />
                </div>
            </div>

            <div className="detail-footer">
                <button className="delete-task-btn" onClick={() => {
                    removeTask(task.id);
                    setSelectedTaskId(null);
                }}>
                    <Trash2 size={18} />
                    <span>Delete task</span>
                </button>
                <div className="created-at">
                    Created on {new Date(task.createdAt).toLocaleDateString()}
                </div>
            </div>

            <style>{`
                .task-detail-sidebar {
                    width: 360px;
                    background-color: var(--surface);
                    border-left: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    right: 0;
                    z-index: 100;
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                .detail-header {
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .close-btn {
                    align-self: flex-end;
                    padding: 0.5rem;
                    color: var(--text-muted);
                    border-radius: var(--radius-sm);
                }

                .close-btn:hover {
                    background-color: var(--surface-hover);
                }

                .task-main-info {
                    padding: 0 0.5rem;
                }

                .title-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                }

                .complete-btn {
                    color: var(--text-muted);
                    padding-top: 0.25rem;
                }

                .complete-btn.completed {
                    color: var(--primary);
                }

                .task-title-input {
                    flex: 1;
                    font-size: 1.25rem;
                    font-weight: 600;
                    background: transparent;
                    border: none;
                    color: var(--text);
                    resize: none;
                    padding: 0.25rem 0;
                    line-height: 1.4;
                }

                .task-title-input:focus {
                    outline: none;
                }

                .important-btn {
                    color: var(--text-muted);
                    padding-top: 0.25rem;
                }

                .important-btn.active {
                    color: var(--accent);
                }

                .detail-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .detail-section {
                    background-color: var(--bg);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }

                .subtasks-section {
                    padding: 0.5rem;
                }

                .subtask-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                    border-radius: var(--radius-md);
                }

                .subtask-item:hover {
                    background-color: var(--surface-hover);
                }

                .subtask-item button {
                    color: var(--text-muted);
                    display: flex;
                }

                .subtask-item span {
                    flex: 1;
                    font-size: 0.875rem;
                    color: var(--text);
                }

                .subtask-item span.completed {
                    text-decoration: line-through;
                    color: var(--text-muted);
                }

                .delete-subtask {
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .subtask-item:hover .delete-subtask {
                    opacity: 1;
                }

                .add-subtask {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                    color: var(--primary);
                }

                .add-subtask input {
                    background: transparent;
                    border: none;
                    font-size: 0.875rem;
                    color: var(--text);
                    width: 100%;
                }

                .action-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    color: var(--text);
                    transition: background 0.2s;
                    border-bottom: 1px solid var(--border);
                }

                .action-btn:last-child {
                    border-bottom: none;
                }

                .action-btn:hover {
                    background-color: var(--surface-hover);
                }

                .action-btn.active {
                    color: var(--primary);
                }

                .note-section textarea {
                    width: 100%;
                    min-height: 120px;
                    background: transparent;
                    border: none;
                    padding: 1rem;
                    color: var(--text);
                    font-size: 0.875rem;
                    resize: vertical;
                }

                .detail-footer {
                    padding: 1.5rem;
                    border-top: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .delete-task-btn {
                    color: var(--error);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }

                .created-at {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                @media (max-width: 768px) {
                    .task-detail-sidebar {
                        position: fixed;
                        top: 0;
                        right: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </aside>
    );
};

export default TaskDetailSidebar;
