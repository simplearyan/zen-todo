import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Task } from '../../store/useStore';
import TaskItem from './TaskItem';

const ListView: React.FC = () => {
  const { tasks, activeListId, addTask, updateTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (activeListId === 'my-day') return task.myDay;
    if (activeListId === 'important') return task.important;
    if (activeListId === 'planned') return !!task.dueDate;
    if (activeListId === 'tasks') return task.listId === 'tasks';
    return task.listId === activeListId;
  }).sort((a, b) => a.order - b.order);

  const completedTasks = filteredTasks.filter(t => t.completed);
  const pendingTasks = filteredTasks.filter(t => !t.completed);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, activeListId);
      setNewTaskTitle('');
    }
  };

  const handleReorder = (newOrder: Task[]) => {
    // Map back to global tasks and update their order
    newOrder.forEach((task, index) => {
      if (task.order !== index) {
        updateTask(task.id, { order: index });
      }
    });
  };

  return (
    <div className="list-view">
      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="add-task-bar"
        onSubmit={handleAddTask}
      >
        <div className="add-icon">
          <Plus size={20} />
        </div>
        <input
          type="text"
          placeholder="Add a task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        {newTaskTitle && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            type="submit"
            className="add-btn"
          >
            Add
          </motion.button>
        )}
      </motion.form>

      <div className="tasks-scroll-area">
        <Reorder.Group
          axis="y"
          values={pendingTasks}
          onReorder={handleReorder}
          className="task-section"
        >
          <AnimatePresence mode="popLayout">
            {pendingTasks.map(task => (
              <Reorder.Item
                key={task.id}
                value={task}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <TaskItem task={task} />
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {completedTasks.length > 0 && (
          <div className="task-section completed-section">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-title"
            >
              Completed
            </motion.h3>
            <AnimatePresence mode="popLayout">
              {completedTasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: 10 }}
                  layout
                >
                  <TaskItem task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <p>No tasks here yet. Add one above!</p>
          </motion.div>
        )}
      </div>

      <style>{`
        .list-view {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .add-task-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: var(--surface);
          border: 1px solid var(--border);
          padding: 1rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }

        .add-icon {
          color: var(--primary);
          display: flex;
        }

        .add-task-bar input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0;
          font-size: 1rem;
          color: var(--text);
        }

        .add-task-bar input:focus {
          box-shadow: none;
        }

        .add-btn {
          padding: 0.5rem 1rem;
          background-color: var(--primary);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .tasks-scroll-area {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.5rem;
          padding-top: 2rem;
        }

        .task-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          padding-left: 0.5rem;
        }

        .empty-state {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          padding-bottom: 5rem;
        }
      `}</style>
    </div>
  );
};

export default ListView;
