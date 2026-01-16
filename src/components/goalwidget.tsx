import React, { useEffect, useState } from "react";
import type { Goal } from "../types/general";

const GoalWidget = ({ goal }: { goal: Goal }) => {
  const [mounted, setMounted] = useState(false);

  const targetNum = parseFloat(goal.target.replace(/,/g, ".")) || 1;
  const percentage = Math.min(
    100,
    Math.max(0, (goal.progress / targetNum) * 100)
  );
  const isCompleted = percentage >= 100;

  const getStatusColor = () => {
    if (isCompleted)
      return "bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]";
    if (percentage < 30) return "bg-stone-600";
    if (percentage < 70)
      return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]";
    return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
  };

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-stone-800 bg-stone-900/40 p-4 backdrop-blur-sm transition-all hover:border-stone-700 hover:bg-stone-900/60">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-stone-200 tracking-tight">
          {goal.name}
        </h3>
        <span
          className={`text-xs font-bold font-mono ${
            isCompleted ? "text-cyan-300" : "text-stone-400"
          }`}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>

      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-stone-800 shadow-inner">
        <div className="absolute inset-0 bg-stone-950/50" />

        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getStatusColor()}`}
          style={{ width: mounted ? `${percentage}%` : "0%" }}
        />

        {isCompleted && (
          <div className="absolute inset-0 animate-pulse bg-white/20" />
        )}
      </div>

      <div className="flex items-end justify-between text-xs">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-mono text-lg font-bold ${
              isCompleted ? "text-cyan-100" : "text-white"
            }`}
          >
            {goal.progress}
          </span>
          <span className="text-stone-500 font-medium">
            / {goal.target} {goal.unit}
          </span>
        </div>

        <span
          className={`uppercase tracking-wider font-bold text-[10px] ${
            isCompleted ? "text-cyan-400" : "text-stone-600"
          }`}
        >
          {isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>
    </div>
  );
};

export default GoalWidget;
