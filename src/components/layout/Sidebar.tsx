import React, { useState } from 'react';
import {
    Sun,
    Star,
    Calendar,
    Home,
    Plus,
    Hash,
    Trash2,
    Menu,
    X,
    Moon
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const Sidebar: React.FC = () => {
    const {
        theme,
        setTheme,
        lists,
        addList,
        removeList,
        activeListId,
        setActiveListId
    } = useStore();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [newListTitle, setNewListTitle] = useState('');

    const handleAddList = (e: React.FormEvent) => {
        e.preventDefault();
        if (newListTitle.trim()) {
            addList(newListTitle, '#3b82f6', 'list');
            setNewListTitle('');
        }
    };

    const navItems = [
        { id: 'my-day', label: 'My Day', icon: Sun, color: 'var(--primary)' },
        { id: 'important', label: 'Important', icon: Star, color: '#ef4444' },
        { id: 'planned', label: 'Planned', icon: Calendar, color: '#10b981' },
        { id: 'tasks', label: 'Tasks', icon: Home, color: 'var(--primary)' },
    ];

    return (
        <>
            <button
                className="mobile-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 100,
                    display: 'none', // Managed by CSS media query
                    padding: '0.5rem',
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)'
                }}
            >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">ZT</div>
                        <span>ZenTask</span>
                    </div>
                    <button
                        className="theme-toggle"
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                className={`nav-item ${activeListId === item.id ? 'active' : ''}`}
                                onClick={() => setActiveListId(item.id)}
                            >
                                <item.icon size={18} style={{ color: item.color }} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="nav-divider"></div>

                    <div className="nav-group">
                        <div className="group-header">Custom Lists</div>
                        {lists.map((list) => (
                            <div key={list.id} className={`nav-item-container ${activeListId === list.id ? 'active' : ''}`}>
                                <button
                                    className="nav-item"
                                    onClick={() => setActiveListId(list.id)}
                                >
                                    <Hash size={18} style={{ color: list.color }} />
                                    <span>{list.title}</span>
                                </button>
                                <button
                                    className="list-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeList(list.id);
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </nav>

                <form className="add-list-form" onSubmit={handleAddList}>
                    <Plus size={18} />
                    <input
                        type="text"
                        placeholder="New list"
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                    />
                </form>

                <style>{`
          .sidebar {
            width: 280px;
            background-color: var(--surface);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            height: 100vh;
            transition: transform 0.3s ease;
            position: relative;
            z-index: 50;
          }

          .sidebar-header {
            padding: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 700;
            font-size: 1.25rem;
            color: var(--primary);
          }

          .logo-icon {
            width: 32px;
            height: 32px;
            background: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
          }

          .theme-toggle {
            padding: 0.5rem;
            border-radius: var(--radius-md);
            color: var(--text-muted);
          }

          .theme-toggle:hover {
            background-color: var(--bg);
            color: var(--text);
          }

          .sidebar-nav {
            flex: 1;
            overflow-y: auto;
            padding: 0 1rem;
          }

          .nav-group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            margin-bottom: 1.5rem;
          }

          .group-header {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-muted);
            letter-spacing: 0.05em;
          }

          .nav-item-container {
            display: flex;
            align-items: center;
            border-radius: var(--radius-md);
            transition: var(--transition);
          }

          .nav-item-container:hover .list-delete {
            opacity: 1;
          }

          .nav-item {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            border-radius: var(--radius-md);
            color: var(--text);
            font-weight: 500;
            text-align: left;
            transition: var(--transition);
          }

          .nav-item:hover {
            background-color: var(--surface-hover);
          }

          .nav-item.active {
            background-color: rgba(59, 130, 246, 0.1);
            color: var(--primary);
          }

          .active .nav-item {
            color: var(--primary);
          }

          .list-delete {
            opacity: 0;
            padding: 0.5rem;
            color: var(--text-muted);
            transition: var(--transition);
          }

          .list-delete:hover {
            color: var(--error);
          }

          .nav-divider {
            height: 1px;
            background-color: var(--border);
            margin: 1rem 0;
          }

          .add-list-form {
            padding: 1.25rem;
            border-top: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-muted);
          }

          .add-list-form input {
            background: transparent;
            border: none;
            padding: 0;
            font-size: 0.875rem;
            width: 100%;
          }

          .add-list-form input:focus {
            box-shadow: none;
          }

          @media (max-width: 768px) {
            .mobile-toggle {
              display: block !important;
            }
            .sidebar {
              position: fixed;
              transform: translateX(-100%);
            }
            .sidebar.open {
              transform: translateX(0);
            }
          }
        `}</style>
            </aside>
        </>
    );
};

export default Sidebar;
