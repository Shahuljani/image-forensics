import React from "react";

export default function ResultCard({ result }){
  if (result.error) return <div className="p-4 bg-red-50 text-red-700 rounded">{result.error}</div>;

  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Verdict: <span className="ml-2">{result.overall_label}</span></div>
          <div className="text-sm text-gray-500">Ensemble score: {(result.ensemble_score || 0).toFixed(3)}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {result.scores && result.scores.map((s, idx) => (
          <div key={idx} className="p-2 border rounded">
            <div className="font-medium">{s.sector}</div>
            <div className="text-sm">Score: {s.score?.toFixed ? s.score.toFixed(3) : s.score}</div>
            <div className="text-xs text-gray-500 mt-1">{s.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
