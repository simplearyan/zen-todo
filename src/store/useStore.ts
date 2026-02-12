import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    important: boolean;
    myDay: boolean;
    dueDate?: string;
    listId: string; // 'tasks' for default, or list UUID
    order: number;
    status: 'todo' | 'in-progress' | 'done';
    createdAt: number;
}

export interface List {
    id: string;
    title: string;
    color: string;
    icon: string;
}

interface AppState {
    theme: 'light' | 'dark';
    lists: List[];
    tasks: Task[];
    activeListId: string;

    // Actions
    setTheme: (theme: 'light' | 'dark') => void;
    setActiveListId: (id: string) => void;

    // List Actions
    addList: (title: string, color: string, icon: string) => void;
    removeList: (id: string) => void;

    // Task Actions
    addTask: (title: string, listId: string) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    removeTask: (id: string) => void;
    toggleComplete: (id: string) => void;
    toggleImportant: (id: string) => void;
    toggleMyDay: (id: string) => void;
    reorderTasks: (listId: string, startIndex: number, endIndex: number) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'light',
            lists: [],
            tasks: [],
            activeListId: 'my-day',

            setTheme: (theme) => {
                set({ theme });
                document.documentElement.setAttribute('data-theme', theme);
            },

            setActiveListId: (id) => set({ activeListId: id }),

            addList: (title, color, icon) => set((state) => ({
                lists: [...state.lists, { id: crypto.randomUUID(), title, color, icon }]
            })),

            removeList: (id) => set((state) => ({
                lists: state.lists.filter(l => l.id !== id),
                tasks: state.tasks.filter(t => t.listId !== id),
                activeListId: state.activeListId === id ? 'tasks' : state.activeListId
            })),

            addTask: (title, listId) => set((state) => {
                const newTask: Task = {
                    id: crypto.randomUUID(),
                    title,
                    description: '',
                    completed: false,
                    important: false, // Initially false, maybe true if in "Important" list
                    myDay: listId === 'my-day',
                    listId: (listId === 'my-day' || listId === 'important' || listId === 'planned') ? 'tasks' : listId,
                    order: state.tasks.filter(t => t.listId === listId).length,
                    status: 'todo',
                    createdAt: Date.now()
                };

                // Handle special pseudo-lists
                if (listId === 'important') newTask.important = true;

                return { tasks: [...state.tasks, newTask] };
            }),

            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
            })),

            removeTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),

            toggleComplete: (id) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? 'done' : 'todo' } : t)
            })),

            toggleImportant: (id) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, important: !t.important } : t)
            })),

            toggleMyDay: (id) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, myDay: !t.myDay } : t)
            })),

            reorderTasks: (listId, startIndex, endIndex) => set((state) => {
                const listTasks = state.tasks.filter(t => t.listId === listId).sort((a, b) => a.order - b.order);
                const [removed] = listTasks.splice(startIndex, 1);
                listTasks.splice(endIndex, 0, removed);

                const updatedListTasks = listTasks.map((t, index) => ({ ...t, order: index }));
                const otherTasks = state.tasks.filter(t => t.listId !== listId);

                return { tasks: [...otherTasks, ...updatedListTasks] };
            }),
        }),
        {
            name: 'zen-todo-storage',
        }
    )
);
