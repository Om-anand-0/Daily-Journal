import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import JournalForm from './components/JournalForm';
import JournalList from './components/JournalList';
import Modal from './components/Modal';
import InstallPrompt from './components/InstallPrompt';
import FocusAreasManager from './components/FocusAreasManager';
import './index.css';


// Main App Component with Authentication
function AuthenticatedApp() {
  const { user, logout, getAuthHeaders, isAuthenticated } = useAuth();
  const [entries, setEntries] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, entryId: null });
  const [focusAreasOpen, setFocusAreasOpen] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || 'https://daily-journal-2yyp.onrender.com/api';

  async function load() {
    try {
      const res = await fetch(`${API_BASE}/entries`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(entry, id = null) {
    try {
      if (id) {
        const res = await fetch(`${API_BASE}/entries/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(entry),
        });
        if (res.ok) {
          const updated = await res.json();
          setEntries((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
          setEditing(null);
        }
      } else {
        const res = await fetch(`${API_BASE}/entries`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(entry),
        });
        if (res.ok) {
          const created = await res.json();
          setEntries((prev) => [created, ...prev]);
        }
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  }

  function handleDelete(id) {
    setDeleteModal({ isOpen: true, entryId: id });
  }

  async function confirmDelete() {
    try {
      const id = deleteModal.entryId;
      const res = await fetch(`${API_BASE}/entries/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e._id !== id));
      }
      setDeleteModal({ isOpen: false, entryId: null });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      setDeleteModal({ isOpen: false, entryId: null });
    }
  }

  function cancelDelete() {
    setDeleteModal({ isOpen: false, entryId: null });
  }

  async function handleExport() {
    try {
      const res = await fetch(`${API_BASE}/entries/export`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `journal-entries-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export entries:', error);
    }
  }

  async function handleImport(file) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const res = await fetch(`${API_BASE}/entries/import`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ entries: parsed }),
      });
      if (res.ok) {
        await load();
        alert(`Import complete`);
      }
    } catch (error) {
      console.error('Failed to import entries:', error);
      alert('Import failed');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-light to-primary-dark">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-primary-light/30 backdrop-blur-sm border border-accent-blue/20 rounded-xl p-6 mb-8 shadow-xl">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-text-light flex items-center gap-3">
              📖 Daily Power Journal
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-accent-light font-medium">
                Welcome, <span className="text-text-light">{user?.username}</span>! 👋
              </span>
              <button
                onClick={() => setFocusAreasOpen(true)}
                className="bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue font-semibold px-4 py-2 rounded-lg transition-all duration-200 border border-accent-blue/30"
                title="Manage Focus Areas"
              >
                🎯 Focus Areas
              </button>
              <button
                onClick={logout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold px-4 py-2 rounded-lg transition-all duration-200 border border-red-400/30"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

      <JournalForm 
        onSave={handleSave} 
        editing={editing} 
        onCancel={() => setEditing(null)}
        userFocusAreas={user?.focusAreas || []}
      />

        {/* Export/Import Section */}
        <div className="mt-8 flex flex-wrap items-center gap-4 justify-center">
          <button
            onClick={handleExport}
            className="bg-accent-blue hover:bg-accent-dark text-primary-dark font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            📤 Export JSON
          </button>

          <label className="cursor-pointer bg-secondary-gray/20 hover:bg-secondary-gray/30 text-text-light font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-secondary-gray/30 transform hover:scale-105">
            📥 Import JSON
            <input
              type="file"
              accept=".json,application/json"
              onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent"></div>

        <JournalList entries={entries} onEdit={setEditing} onDelete={handleDelete} />

        <Modal
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Entry"
          message="Are you sure you want to delete this journal entry? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />

        <FocusAreasManager 
          isOpen={focusAreasOpen} 
          onClose={() => setFocusAreasOpen(false)} 
        />

        <InstallPrompt />
      </div>
    </div>
  );
}

// Main App Wrapper with Authentication Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// App Content Component that handles auth state
function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedApp /> : <Auth />;
}

export default App;
