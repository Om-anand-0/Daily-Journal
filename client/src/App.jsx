import React, { useEffect, useState } from 'react';
import JournalForm from './components/JournalForm';
import JournalList from './components/JournalList';
import Modal from './components/Modal';
import InstallPrompt from './components/InstallPrompt';
import './index.css';


const API_BASE = import.meta.env.VITE_API_BASE || 'https://daily-journal-2yyp.onrender.com/api';

function App() {
  const [entries, setEntries] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, entryId: null });

  async function load() {
    const res = await fetch(`${API_BASE}/entries`);
    const data = await res.json();
    setEntries(data);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(entry, id = null) {
    if (id) {
      const res = await fetch(`${API_BASE}/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      const updated = await res.json();
      setEntries((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      setEditing(null);
    } else {
      const res = await fetch(`${API_BASE}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      const created = await res.json();
      setEntries((prev) => [created, ...prev]);
    }
  }

  function handleDelete(id) {
    setDeleteModal({ isOpen: true, entryId: id });
  }

  async function confirmDelete() {
    const id = deleteModal.entryId;
    await fetch(`${API_BASE}/entries/${id}`, { method: 'DELETE' });
    setEntries((prev) => prev.filter((e) => e._id !== id));
    setDeleteModal({ isOpen: false, entryId: null });
  }

  function cancelDelete() {
    setDeleteModal({ isOpen: false, entryId: null });
  }

  async function handleExport() {
    const res = await fetch(`${API_BASE}/entries/export`);
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daily_power_journal_export.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleImport(file) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    await fetch(`${API_BASE}/entries/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: parsed }),
    });
    await load();
    alert(`Import complete`);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Daily Power Journal</h1>

      <JournalForm onSave={handleSave} editing={editing} onCancel={() => setEditing(null)} />

      <div className="mt-6 flex flex-wrap items-center gap-4 justify-center">
        <button
          onClick={handleExport}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
        >
          Export JSON
        </button>

        <label className="cursor-pointer bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded shadow">
          Import JSON
          <input
            type="file"
            accept=".json,application/json"
            onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>

      <hr className="my-10 border-gray-300 dark:border-gray-700" />

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

      <InstallPrompt />
    </div>
  );
}

export default App;
