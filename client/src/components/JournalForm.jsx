import React, { useEffect, useState } from 'react';

const FOCUS_OPTIONS = [
  'MERN / JavaScript',
  'Python / NLP',
  'DSA / Coding Practice',
  'Japanese (JLPT N3)',
  'Gym / Exercise',
  'Journaling / Mindfulness',
];

const STUCK_OPTIONS = ['Yes, full focus', 'Mostly, small distractions', "No, but I’ll bounce back"];

function JournalForm({ onSave, editing, onCancel }) {
  const empty = {
    date: new Date().toISOString().slice(0, 10),
    top3Goals: ['', '', ''],
    focusAreas: [],
    intention: '',
    midday: { progress: '', biggestDistraction: '' },
    evening: { wins: '', improvements: '', learnings: [], gratitude: '' },
    stuckToPlan: 'Mostly, small distractions',
  };

  const [state, setState] = useState(empty);

  useEffect(() => {
    if (editing) {
      setState({
        ...editing,
        date: editing.date ? new Date(editing.date).toISOString().slice(0, 10) : empty.date,
        top3Goals: editing.top3Goals?.length ? editing.top3Goals : ['', '', ''],
        evening: { ...editing.evening, learnings: editing.evening?.learnings || [] },
      });
    } else {
      setState(empty);
    }
  }, [editing]);

  function setField(path, value) {
    setState((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let cur = copy;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return copy;
    });
  }

  function toggleFocus(option) {
    setState((prev) => {
      const set = new Set(prev.focusAreas || []);
      if (set.has(option)) set.delete(option);
      else set.add(option);
      return { ...prev, focusAreas: Array.from(set) };
    });
  }

  function submit(e) {
    e.preventDefault();
    const payload = {
      ...state,
      top3Goals: (state.top3Goals || []).slice(0, 3).map((s) => s || ''),
      evening: { ...state.evening, learnings: (state.evening.learnings || []).slice(0, 3) },
    };
    if (editing?._id) {
      onSave(payload, editing._id);
    } else {
      onSave(payload, null);
      setState(empty);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="border border-gray-300 rounded-md p-6 bg-white dark:bg-gray-800 shadow-md max-w-3xl mx-auto"
    >
      {/* Date */}
      <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">📅 Date</label>
      <div className="relative">
        <input
          type="date"
          value={state.date}
          onChange={(e) => setField('date', e.target.value)}
          className="w-full border-2 border-indigo-200 dark:border-indigo-700 rounded-lg px-4 py-3 text-lg font-medium bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200 shadow-sm hover:shadow-md dark:text-white cursor-pointer"
          style={{
            colorScheme: 'light dark'
          }}
        />
      </div>

      {/* Top 3 Goals */}
      <div className="mt-4">
        <label className="block font-semibold mb-1">Top 3 Goals</label>
        {[0, 1, 2].map((i) => (
          <input
            key={i}
            placeholder={`Goal ${i + 1}`}
            value={state.top3Goals[i] || ''}
            onChange={(e) => {
              const arr = [...(state.top3Goals || [])];
              arr[i] = e.target.value;
              setField('top3Goals', arr);
            }}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        ))}
      </div>

      {/* Focus Areas */}
      <div className="mt-4">
        <label className="block font-semibold mb-2">Focus Areas</label>
        <div className="flex flex-wrap gap-3">
          {FOCUS_OPTIONS.map((opt) => (
            <label key={opt} className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.focusAreas.includes(opt)}
                onChange={() => toggleFocus(opt)}
                className="h-5 w-5 text-indigo-500"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Today's Intention */}
      <div className="mt-4">
        <label className="block font-semibold mb-1">Today's Intention</label>
        <input
          value={state.intention}
          onChange={(e) => setField('intention', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Midday Check-in */}
      <div className="mt-4">
        <label className="block font-semibold mb-1">Midday Check-in (optional)</label>
        <input
          placeholder="Progress so far"
          value={state.midday.progress}
          onChange={(e) => setField('midday.progress', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          placeholder="Biggest distraction"
          value={state.midday.biggestDistraction}
          onChange={(e) => setField('midday.biggestDistraction', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Evening Reflection */}
      <div className="mt-4 space-y-3">
        <label className="block font-semibold mb-1">Evening Reflection</label>
        <textarea
          placeholder="Wins of the day"
          value={state.evening.wins}
          onChange={(e) => setField('evening.wins', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <textarea
          placeholder="What could be improved"
          value={state.evening.improvements}
          onChange={(e) => setField('evening.improvements', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <textarea
          placeholder="Key learnings (one per line, max 3)"
          value={(state.evening.learnings || []).join('\n')}
          onChange={(e) => {
            const lines = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 3);
            setField('evening.learnings', lines);
          }}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          placeholder="One thing I'm grateful for"
          value={state.evening.gratitude}
          onChange={(e) => setField('evening.gratitude', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Stuck to Plan */}
      <div className="mt-4">
        <label className="block font-semibold mb-1">Did I stick to my plan?</label>
        <select
          value={state.stuckToPlan}
          onChange={(e) => setField('stuckToPlan', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {STUCK_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-5 rounded transition-colors"
        >
          {editing ? 'Update' : 'Save'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-5 rounded transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default JournalForm;
