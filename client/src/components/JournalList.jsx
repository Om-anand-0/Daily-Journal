import React from 'react';

function JournalList({ entries = [], onEdit, onDelete }) {
  if (!entries.length)
    return <p className="text-center text-gray-500 mt-8">No entries yet.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-10">
      {entries.map((e) => (
        <div
          key={e._id}
          className="border border-gray-300 rounded-md p-5 bg-white dark:bg-gray-800 shadow"
        >
          <div className="flex justify-between">
            <div>
              <strong className="text-lg">{new Date(e.date).toLocaleDateString()}</strong>
              <div className="mt-1 space-y-1">
                {e.top3Goals?.map((g, i) => (
                  <div key={i}>• {g}</div>
                ))}
              </div>
              <div className="italic text-sm mt-2">{(e.focusAreas || []).join(', ')}</div>
            </div>
            <div>
              <button
                onClick={() => onEdit(e)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold mr-3"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(e._id)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div><strong>Intention:</strong> {e.intention}</div>
            <div><strong>Midday Progress:</strong> {e.midday?.progress}</div>
            <div><strong>Wins:</strong> {e.evening?.wins}</div>
            <div>
              <strong>Learnings:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {(e.evening?.learnings || []).map((l, idx) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
            </div>
            <div><strong>Stuck to plan:</strong> {e.stuckToPlan}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JournalList;
