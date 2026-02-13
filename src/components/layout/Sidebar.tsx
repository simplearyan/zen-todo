import React, { useState, useEffect } from 'react';
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
  Moon,
  ChevronLeft,
  ChevronRight
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer state
  const [isMini, setIsMini] = useState(false); // Desktop mini state
  const [newListTitle, setNewListTitle] = useState('');

  // Close mobile drawer on resize if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {/* Mobile Header Overlay */}
      <div className="mobile-header">
        <button
          className="mobile-toggle"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <div className="mobile-logo">ZenTask</div>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${isSidebarOpen ? 'mobile-open' : ''} ${isMini ? 'mini' : ''}`}>
        <div className="sidebar-header">
          {!isMini && (
            <div className="logo">
              <img src="/icons/icon-v1.svg" alt="ZenTodo" style={{ width: 24, height: 24 }} />
              <span>ZenTodo</span>
            </div>
          )}

          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              className="collapse-toggle"
              onClick={() => setIsMini(!isMini)}
              title={isMini ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isMini ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <button
              className="mobile-close"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeListId === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveListId(item.id);
                  if (window.innerWidth <= 768) setIsSidebarOpen(false);
                }}
                title={isMini ? item.label : ""}
              >
                <div className="item-icon-wrapper">
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                {!isMini && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          <div className="nav-divider"></div>

          <div className="nav-group">
            {!isMini && <div className="group-header">Custom Lists</div>}
            {lists.map((list) => (
              <div
                key={list.id}
                className={`nav-item-container ${activeListId === list.id ? 'active' : ''}`}
                title={isMini ? list.title : ""}
              >
                <button
                  className="nav-item"
                  onClick={() => {
                    setActiveListId(list.id);
                    if (window.innerWidth <= 768) setIsSidebarOpen(false);
                  }}
                >
                  <div className="item-icon-wrapper">
                    <Hash size={18} style={{ color: list.color }} />
                  </div>
                  {!isMini && <span>{list.title}</span>}
                </button>
                {!isMini && (
                  <button
                    className="list-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeList(list.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </nav>

        {!isMini && (
          <form className="add-list-form" onSubmit={handleAddList}>
            <Plus size={18} />
            <input
              type="text"
              placeholder="New list"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
          </form>
        )}

        <style>{`
          .mobile-header {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background-color: var(--surface);
            border-bottom: 1px solid var(--border);
            z-index: 40;
            align-items: center;
            padding: 0 1rem;
            gap: 1rem;
          }

          .mobile-logo {
            font-weight: 700;
            color: var(--primary);
            font-size: 1.1rem;
          }

          .sidebar-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(2px);
            z-index: 45;
            animation: fadeIn 0.2s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .sidebar {
            width: 280px;
            background-color: var(--surface);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            height: 100vh;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            z-index: 50;
            flex-shrink: 0;
          }

          .sidebar.mini {
            width: 72px;
          }

          .sidebar-header {
            padding: 1.25rem 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 64px;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .sidebar.mini .header-actions {
            flex-direction: column;
            width: 100%;
            gap: 0.75rem;
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 700;
            font-size: 1.15rem;
            color: var(--text);
            overflow: hidden;
            white-space: nowrap;
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
            flex-shrink: 0;
          }

          .theme-toggle, .collapse-toggle, .mobile-toggle, .mobile-close {
            padding: 0.5rem;
            border-radius: var(--radius-md);
            color: var(--text-muted);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
          }

          .theme-toggle:hover, .collapse-toggle:hover, .mobile-toggle:hover {
            background-color: var(--surface-hover);
            color: var(--text);
          }

          .mobile-close {
            display: none;
          }

          .sidebar-nav {
            flex: 1;
            overflow-y: auto;
            padding: 0 0.75rem;
            scrollbar-width: none;
          }

          .sidebar-nav::-webkit-scrollbar {
            display: none;
          }

          .nav-group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            margin-bottom: 1.5rem;
          }

          .group-header {
            padding: 0.5rem 0.75rem;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-muted);
            letter-spacing: 0.05em;
            opacity: 0.8;
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
            overflow: hidden;
            white-space: nowrap;
          }

          .item-icon-wrapper {
            width: 24px;
            display: flex;
            justify-content: center;
            flex-shrink: 0;
          }

          .sidebar.mini .nav-item {
            justify-content: center;
            padding: 0.75rem 0;
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
            margin: 0.75rem 0.5rem;
          }

          .add-list-form {
            padding: 1rem 1.25rem;
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
            color: var(--text);
          }

          .add-list-form input:focus {
            box-shadow: none;
          }

          @media (max-width: 768px) {
            .mobile-header {
              display: flex;
            }
            .collapse-toggle {
              display: none;
            }
            .mobile-close {
              display: flex;
            }
            .sidebar {
              position: fixed;
              transform: translateX(-100%);
              width: 280px !important;
              border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
              box-shadow: 20px 0 50px rgba(0,0,0,0.1);
            }
            .sidebar.mobile-open {
              transform: translateX(0);
            }
            .sidebar-header {
               padding: 1.5rem 1rem;
            }
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
