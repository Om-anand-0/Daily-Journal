import React from 'react';

function JournalList({ entries = [], onEdit, onDelete }) {
  if (!entries.length)
    return <p className="text-center text-gray-500 mt-8">No entries yet.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-10">
      {entries.map((e) => (
        <div
          key={e._id}
          className="bg-primary-light/50 backdrop-blur-sm border border-accent-blue/20 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <strong className="text-xl text-accent-blue">📅 {new Date(e.date).toLocaleDateString()}</strong>
              </div>
              <div className="space-y-2 mb-3">
                <h4 className="text-text-light font-semibold">🎯 Goals:</h4>
                {e.top3Goals?.map((g, i) => (
                  <div key={i} className="text-text-light/90 ml-4">• {g}</div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {(e.focusAreas || []).map((area, i) => (
                  <span key={i} className="px-3 py-1 bg-accent-blue/20 text-accent-light text-xs rounded-full border border-accent-blue/30">
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(e)}
                className="bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue font-semibold px-4 py-2 rounded-lg transition-all duration-200 border border-accent-blue/30"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(e._id)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold px-4 py-2 rounded-lg transition-all duration-200 border border-red-400/30"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div><strong>Today's Intention:</strong> {e.intention}</div>
            
            {/* Midday Check-in */}
            {(e.midday?.progress || e.midday?.biggestDistraction) && (
              <div className="bg-accent-blue/10 p-4 rounded-lg border border-accent-blue/20">
                <h4 className="font-semibold text-accent-blue mb-3 flex items-center gap-2">🕐 Midday Check-in</h4>
                {e.midday?.progress && <div className="text-text-light/90 mb-2"><strong className="text-text-light">Progress so far:</strong> {e.midday.progress}</div>}
                {e.midday?.biggestDistraction && <div className="text-text-light/90"><strong className="text-text-light">Biggest distraction:</strong> {e.midday.biggestDistraction}</div>}
              </div>
            )}
            
            {/* Evening Reflection */}
            <div className="bg-primary-dark/20 p-4 rounded-lg border border-accent-blue/20">
              <h4 className="font-semibold text-accent-light mb-3 flex items-center gap-2">🌙 Evening Reflection</h4>
              {e.evening?.wins && <div className="text-text-light/90 mb-3"><strong className="text-text-light">Wins of the day:</strong> {e.evening.wins}</div>}
              {e.evening?.improvements && <div className="text-text-light/90 mb-3"><strong className="text-text-light">What could be improved:</strong> {e.evening.improvements}</div>}
              {(e.evening?.learnings || []).length > 0 && (
                <div className="mb-3">
                  <strong className="text-text-light">Key learnings:</strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    {e.evening.learnings.map((l, idx) => (
                      <li key={idx} className="text-text-light/90">{l}</li>
                    ))}
                  </ul>
                </div>
              )}
              {e.evening?.grateful && <div className="text-text-light/90"><strong className="text-text-light">One thing I'm grateful for:</strong> {e.evening.grateful}</div>}
            </div>
            
            <div className="bg-secondary-gray/10 p-3 rounded-lg border border-secondary-gray/20">
              <strong className="text-text-light">📊 Did I stick to my plan?</strong> 
              <span className="text-accent-light ml-2">{e.stuckToPlan}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JournalList;
