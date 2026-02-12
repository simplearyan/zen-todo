import { useEffect, useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import ListView from './components/todo/ListView';
import BoardView from './components/todo/BoardView';
import { useStore } from './store/useStore';
import { LayoutGrid, List as ListIcon, Search } from 'lucide-react';

function App() {
  const { theme, activeListId, lists } = useStore();
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const activeList = [...lists,
  { id: 'my-day', title: 'My Day' },
  { id: 'important', title: 'Important' },
  { id: 'planned', title: 'Planned' },
  { id: 'tasks', title: 'Tasks' }
  ].find(l => l.id === activeListId);

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1>{activeList?.title || 'Tasks'}</h1>
            <p className="date-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="header-right">
            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="view-toggle">
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <ListIcon size={18} />
              </button>
              <button
                className={viewMode === 'board' ? 'active' : ''}
                onClick={() => setViewMode('board')}
                title="Board View"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </header>

        <section className="content-area">
          {viewMode === 'list' ? (
            <ListView />
          ) : (
            <BoardView />
          )}
        </section>
      </main>

      <style>{`
        .app-container {
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--bg);
          overflow-x: hidden;
        }

        .main-header {
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .header-left h1 {
          font-size: 1.875rem;
          color: var(--text);
          margin-bottom: 0.25rem;
        }

        .date-subtitle {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .header-right {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--surface);
          border: 1px solid var(--border);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-lg);
          width: 240px;
          color: var(--text-muted);
          transition: var(--transition);
        }

        .search-bar:focus-within {
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .search-bar input {
          border: none;
          background: transparent;
          padding: 0;
          font-size: 0.875rem;
          width: 100%;
          color: var(--text);
        }

        .view-toggle {
          display: flex;
          background-color: var(--surface);
          padding: 0.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
        }

        .view-toggle button {
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-toggle button.active {
          background-color: var(--primary);
          color: white;
        }

        .content-area {
          flex: 1;
          padding: 0 2rem 2rem 2rem;
          display: flex;
          flex-direction: column;
        }

        .placeholder-view {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          border: 2px dashed var(--border);
          border-radius: var(--radius-xl);
          color: var(--text-muted);
          text-align: center;
          padding: 2rem;
        }

        @media (max-width: 1024px) {
          .search-bar {
            width: 180px;
          }
        }

        @media (max-width: 768px) {
          .main-header {
            padding-top: 4rem; /* For mobile menu button */
          }
          .header-right {
            width: 100%;
            justify-content: space-between;
          }
          .search-bar {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
