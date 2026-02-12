import React from 'react';
import {
    DragDropContext,
    Droppable,
    Draggable,
} from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useStore } from '../../store/useStore';
import type { Task } from '../../store/useStore';
import { Check, Star } from 'lucide-react';

const BoardView: React.FC = () => {
    const { tasks, activeListId, updateTask, toggleComplete, toggleImportant } = useStore();

    const filteredTasks = tasks.filter(task => {
        if (activeListId === 'my-day') return task.myDay;
        if (activeListId === 'important') return task.important;
        if (activeListId === 'planned') return !!task.dueDate;
        if (activeListId === 'tasks') return task.listId === 'tasks';
        return task.listId === activeListId;
    });

    const columns = [
        { id: 'todo', title: 'To Do', color: '#64748b' },
        { id: 'in-progress', title: 'In Progress', color: '#3b82f6' },
        { id: 'done', title: 'Done', color: '#10b981' }
    ];

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const newStatus = destination.droppableId as 'todo' | 'in-progress' | 'done';

        updateTask(draggableId, {
            status: newStatus,
            completed: newStatus === 'done'
        });
        // For a more robust reordering, we would also update 'order' here.
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="board-container">
                {columns.map(column => (
                    <div key={column.id} className="board-column">
                        <h3 className="column-title" style={{ borderTop: `4px solid ${column.color}` }}>
                            {column.title}
                            <span className="count">{filteredTasks.filter(t => t.status === column.id).length}</span>
                        </h3>

                        <Droppable droppableId={column.id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                >
                                    {filteredTasks
                                        .filter(t => t.status === column.id)
                                        .sort((a, b) => a.order - b.order)
                                        .map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`board-card ${snapshot.isDragging ? 'is-dragging' : ''} ${task.completed ? 'completed' : ''}`}
                                                    >
                                                        <div className="card-header">
                                                            <span className="card-title">{task.title}</span>
                                                            <button
                                                                className={`star-btn ${task.important ? 'active' : ''}`}
                                                                onClick={() => toggleImportant(task.id)}
                                                            >
                                                                <Star size={14} fill={task.important ? 'var(--accent)' : 'none'} />
                                                            </button>
                                                        </div>

                                                        <div className="card-footer">
                                                            <button
                                                                className={`complete-btn ${task.completed ? 'checked' : ''}`}
                                                                onClick={() => toggleComplete(task.id)}
                                                            >
                                                                <Check size={12} />
                                                                {task.completed ? 'Completed' : 'Mark Done'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}

                <style>{`
          .board-container {
            display: flex;
            gap: 1.5rem;
            height: 100%;
            overflow-x: auto;
            padding-bottom: 1rem;
            align-items: flex-start;
          }

          .board-column {
            flex: 0 0 320px;
            background-color: var(--surface-hover);
            border-radius: var(--radius-lg);
            display: flex;
            flex-direction: column;
            max-height: 100%;
            border: 1px solid var(--border);
          }

          .column-title {
            padding: 1rem;
            font-size: 0.875rem;
            font-weight: 700;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--surface);
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          }

          .count {
            background-color: var(--bg);
            color: var(--text-muted);
            padding: 0.125rem 0.5rem;
            border-radius: 10px;
            font-size: 0.75rem;
          }

          .column-content {
            padding: 1rem;
            flex: 1;
            overflow-y: auto;
            min-height: 100px;
            transition: var(--transition);
          }

          .column-content.dragging-over {
            background-color: rgba(59, 130, 246, 0.05);
          }

          .board-card {
            background-color: var(--surface);
            padding: 1rem;
            border-radius: var(--radius-md);
            margin-bottom: 0.75rem;
            border: 1px solid var(--border);
            box-shadow: var(--shadow-sm);
            transition: var(--transition);
          }

          .board-card:hover {
            border-color: var(--primary);
            box-shadow: var(--shadow-md);
          }

          .board-card.is-dragging {
            box-shadow: var(--shadow-lg);
            border-color: var(--primary);
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }

          .card-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text);
          }

          .board-card.completed .card-title {
            text-decoration: line-through;
            color: var(--text-muted);
          }

          .star-btn {
            color: var(--text-muted);
            padding: 0.25rem;
          }

          .star-btn.active {
            color: var(--accent);
          }

          .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .complete-btn {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.75rem;
            color: var(--text-muted);
            padding: 0.375rem 0.75rem;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border);
            background-color: var(--bg);
          }

          .complete-btn.checked {
            background-color: var(--success);
            color: white;
            border-color: var(--success);
          }

          @media (max-width: 768px) {
            .board-column {
              flex: 0 0 280px;
            }
          }
        `}</style>
            </div>
        </DragDropContext>
    );
};

export default BoardView;
