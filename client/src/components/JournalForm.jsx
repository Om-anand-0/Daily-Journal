import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      className="bg-primary-light/50 backdrop-blur-sm border border-accent-blue/20 rounded-xl p-8 shadow-xl max-w-3xl mx-auto"
    >
      {/* Date */}
      <label className="block font-semibold mb-3 text-text-light text-lg">📅 Date</label>
      <div className="relative">
        <input
          type="date"
          value={state.date}
          onChange={(e) => setField('date', e.target.value)}
          className="w-full border-2 border-accent-blue/30 rounded-lg px-4 py-3 text-lg font-medium bg-gradient-to-r from-primary-dark/50 to-primary-light/50 text-text-light focus:ring-4 focus:ring-accent-blue/50 focus:border-accent-blue transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          style={{
            colorScheme: 'dark'
          }}
        />
      </div>

      {/* Top 3 Goals */}
      <div className="mt-6">
        <label className="block font-semibold mb-3 text-text-light text-lg">🎯 Top 3 Goals</label>
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
            className="w-full border border-accent-blue/30 rounded-lg px-4 py-3 mb-3 bg-primary-dark/30 text-text-light placeholder-secondary-gray focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-200"
          />
        ))}
      </div>

      {/* Focus Areas */}
      <div className="mt-6">
        <label className="block font-semibold mb-3 text-text-light text-lg">🎯 Focus Areas</label>
        <div className="flex flex-wrap gap-3">
          {(user?.focusAreas || FOCUS_OPTIONS).map((opt) => (
            <label key={opt} className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.focusAreas.includes(opt)}
                onChange={() => toggleFocus(opt)}
                className="h-5 w-5 text-indigo-500"
              />
              <span className="text-text-light">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Today's Intention */}
      <div className="mt-6">
        <label className="block font-semibold mb-3 text-text-light text-lg">💭 Today's Intention</label>
        <input
          value={state.intention}
          onChange={(e) => setField('intention', e.target.value)}
          className="w-full border border-accent-blue/30 rounded-lg px-4 py-3 bg-primary-dark/30 text-text-light placeholder-secondary-gray focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-200"
          placeholder="What's your main focus for today?"
        />
      </div>

      {/* Midday Check-in */}
      <div className="mt-6 bg-accent-blue/10 p-4 rounded-lg border border-accent-blue/20">
        <label className="block font-semibold mb-3 text-text-light text-lg">🕐 Midday Check-in (optional)</label>
        <input
          placeholder="Progress so far"
          value={state.midday.progress}
          onChange={(e) => setField('midday.progress', e.target.value)}
          className="w-full border border-accent-blue/30 rounded-lg px-4 py-3 mb-3 bg-primary-dark/30 text-text-light placeholder-secondary-gray focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-200"
        />
        <input
          placeholder="Biggest distraction"
          value={state.midday.biggestDistraction}
          onChange={(e) => setField('midday.biggestDistraction', e.target.value)}
          className="w-full border border-accent-blue/30 rounded-lg px-4 py-3 bg-primary-dark/30 text-text-light placeholder-secondary-gray focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-200"
        />
      </div>

      {/* Evening Reflection */}
      <div className="mt-6 bg-primary-dark/20 p-4 rounded-lg border border-accent-blue/20 space-y-4">
        <label className="block font-semibold mb-3 text-text-light text-lg">🌙 Evening Reflection</label>
        <textarea
          placeholder="Wins of the day"
          value={state.evening.wins}
          onChange={(e) => setField('evening.wins', e.target.value)}
          className="w-full border border-accent-blue/30 rounded-lg px-4 py-3 bg-primary-dark/30 text-text-light placeholder-secondary-gray focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-200 resize-none"
          rows="3"
        />
        <textarea
          placeholder="What could be improved"
          value={state.evening.improvements}
          onChange={(e) => setField('evening.improvements', e.target.value)}
          className="w-full border border-accent-blue/30 rounded-lg px-4 py-3 bg-primary-dark/30 text-text-light placeholder-secondary-gray focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-200 resize-none"
          rows="3"
        />
        <textarea
          placeholder="Key learnings (one per line, max 3)"
          value={(state.evening.learnings || []).join('\n')}
          onChange={(e) => {
            const lines = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 3);
            setField('evening.learnings', lines);
          }}
          className="w-full border border-accent-blue/30 rounded-lg px-4 py-3 bg-primary-dark/30 text-text-light placeholder-secondary-gray focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-200 resize-none"
          rows="3"
        />
        <input
          placeholder="One thing I'm grateful for"
          value={state.evening.gratitude}
          onChange={(e) => setField('evening.gratitude', e.target.value)}
          className="w-full border border-accent-blue/30 rounded-lg px-4 py-3 bg-primary-dark/30 text-text-light placeholder-secondary-gray focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-200"
        />
      </div>

      {/* Stuck to Plan */}
      <div className="mt-6">
        <label className="block font-semibold mb-3 text-text-light text-lg">📊 Did I stick to my plan?</label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full border border-accent-blue/30 rounded-lg px-4 py-3 bg-primary-dark/30 text-text-light focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-all duration-200 text-left flex justify-between items-center"
          >
            <span>{state.stuckToPlan}</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-primary-dark border border-accent-blue/30 rounded-lg shadow-xl z-10 overflow-hidden">
              {STUCK_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setField('stuckToPlan', option);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-text-light hover:bg-accent-blue/20 transition-colors duration-200 ${
                    state.stuckToPlan === option ? 'bg-accent-blue/30' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-accent-blue hover:bg-accent-dark text-primary-dark font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {editing ? '✏️ Update Entry' : '💾 Save Entry'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-secondary-gray/20 hover:bg-secondary-gray/30 text-text-light font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-secondary-gray/30"
          >
            ❌ Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default JournalForm;
