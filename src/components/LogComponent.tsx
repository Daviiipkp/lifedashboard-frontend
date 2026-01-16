import { Plus, Minus, Check, Zap, ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const formatTime = (decimalTime: number) => {
  const hours = Math.floor(decimalTime);
  const minutes = Math.round((decimalTime - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

const TimeController = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);

  const updateTime = (h: number, m: number) => {
    let newH = h;
    let newM = m;

    if (newM >= 60) {
      newH++;
      newM = newM - 60;
    }
    if (newM < 0) {
      newH--;
      newM = 60 + newM;
    }
    if (newH >= 24) newH = 0;
    if (newH < 0) newH = 23;

    onChange(newH + newM / 60);
  };

  return (
    <div className="flex items-center justify-center gap-4 w-full h-fit bg-slate-950/40 rounded-xl border border-white/5 relative z-20">
      {/* Hours */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => updateTime(hours + 1, minutes)}
          className="p-1 text-slate-500 hover:text-blue-400 active:scale-90 transition-all"
        >
          <ChevronUp size={20} />
        </button>
        <span className="text-2xl font-mono font-bold text-white tracking-widest">
          {String(hours).padStart(2, "0")}
        </span>
        <button
          onClick={() => updateTime(hours - 1, minutes)}
          className="p-1 text-slate-500 hover:text-blue-400 active:scale-90 transition-all"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      <span className="text-xl font-bold text-slate-600 mb-1">:</span>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => updateTime(hours, minutes + 10)}
          className="p-1 text-slate-500 hover:text-blue-400 active:scale-90 transition-all"
        >
          <ChevronUp size={20} />
        </button>
        <span className="text-2xl font-mono font-bold text-white tracking-widest">
          {String(minutes).padStart(2, "0")}
        </span>
        <button
          onClick={() => updateTime(hours, minutes - 10)}
          className="p-1 text-slate-500 hover:text-blue-400 active:scale-90 transition-all"
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  );
};

const QuantityStepper = ({ value, max, onChange, unit }: any) => {
  return (
    <div className="flex items-center justify-between w-full h-12 bg-slate-950/30 rounded-xl border border-slate-800 p-1 gap-2 mt-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-full w-12 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all active:scale-90"
      >
        <Minus size={18} />
      </button>

      <div className="flex-1 flex items-center justify-center">
        <span className="text-lg font-bold text-slate-200">
          {value}
          <span className="text-xs text-slate-500 ml-1 font-normal">
            {unit}
          </span>
        </span>
      </div>

      <button
        onClick={() => onChange(value + 1)}
        className="h-full w-12 flex items-center justify-center bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-lg transition-all active:scale-90"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};

const FluidSlider = ({ value, max, onChange, unit }: any) => {
  const safeMax = max || 100;
  const percentage = Math.min((value / safeMax) * 100, 100);

  return (
    <div className="w-full">
      <div className="relative w-full h-10 flex items-center select-none group mt-1">
        <div className="absolute w-full h-1.5 bg-slate-900/80 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
          <div
            className={`h-full rounded-l-full opacity-80 transition-all duration-100 ${
              percentage >= 100
                ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                : "bg-gradient-to-r from-blue-900 to-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max={safeMax}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
        />
        <div
          className={`absolute h-5 w-5 rounded-full border-[3px] cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 flex items-center justify-center shadow-lg
            ${
              percentage >= 100
                ? "bg-emerald-100 border-emerald-600"
                : "bg-slate-200 border-slate-800"
            }`}
          style={{ left: `calc(${Math.min(percentage, 100)}% - 10px)` }}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              percentage >= 100 ? "bg-emerald-600" : "bg-blue-500"
            }`}
          />
        </div>
      </div>

      {/* botoes */}
      <div className="flex justify-between w-full px-1 mt-1">
        <button
          onClick={() =>
            onChange(Math.max(0, value - Math.round(safeMax / 10)))
          }
          className="text-[10px] text-slate-500 hover:text-white bg-slate-800/50 px-2 py-1 rounded"
        >
          -{Math.round(safeMax / 10)}
        </button>
        <button
          onClick={() => onChange(value + safeMax / 10)}
          className="text-[10px] text-blue-400 hover:text-white bg-blue-900/20 px-2 py-1 rounded"
        >
          +{Math.round(safeMax / 10)}
        </button>
      </div>
    </div>
  );
};

const StatusToggle = ({ isCompleted, onToggle }: any) => {
  return (
    <div
      onClick={() => onToggle(!isCompleted)}
      className={`w-full flex items-center justify-between px-3 py-3 mt-2 rounded-xl border cursor-pointer transition-all duration-300 group ${
        isCompleted
          ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          : "bg-slate-950/30 border-slate-800 hover:bg-slate-900 hover:border-slate-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isCompleted
              ? "bg-emerald-500 text-slate-900 rotate-0"
              : "bg-slate-800 text-slate-600 -rotate-12 group-hover:rotate-0"
          }`}
        >
          {isCompleted ? (
            <Check size={18} strokeWidth={4} />
          ) : (
            <Zap size={16} />
          )}
        </div>
        <div className="flex flex-col">
          <span
            className={`text-xs font-bold tracking-wide transition-colors ${
              isCompleted ? "text-emerald-400" : "text-slate-300"
            }`}
          >
            {isCompleted ? "COMPLETED" : "NOT DONE"}
          </span>
          <span className="text-[10px] text-slate-500">
            Click to toggle status
          </span>
        </div>
      </div>
    </div>
  );
};

interface LogProps {
  intaked: number | boolean;
  goal: number;
  icon: React.ReactNode;
  name: string;
  inputType: "slider" | "stepper" | "checkbox" | "time";
  unit: string;
  onUpdate?: (newValue: number | boolean) => void;
}

export function LogComponent({
  intaked,
  goal,
  icon,
  name,
  inputType,
  unit,
  onUpdate,
}: LogProps) {
  const handleUpdate = (val: number | boolean) => {
    if (!onUpdate) return;
    onUpdate(val);
  };

  const numericValue =
    typeof intaked === "number" ? intaked : intaked ? goal : 0;
  const progress = goal > 0 ? Math.min((numericValue / goal) * 100, 100) : 0;

  const getDisplayValue = () => {
    if (inputType === "time") return formatTime(numericValue);
    if (typeof intaked === "boolean") return intaked ? "YES" : "NO";
    return `${Math.round(numericValue)}`;
  };

  return (
    <div className="flex flex-col p-5 bg-gradient-to-b from-slate-900 to-black border border-white/5 rounded-[1.5rem] h-full w-full shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors">
      {progress >= 100 && (
        <div className="inset-0 bg-emerald-500/5 pointer-events-none transition-all duration-1000" />
      )}

      {/* h */}
      <div className="flex justify-between items-end mb-4 relative z-10">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <span
              className={`transition-colors duration-300 ${
                inputType === "time"
                  ? progress < 100
                    ? "text-emerald-400"
                    : "text-red-500/80"
                  : progress >= 100
                  ? "text-emerald-400"
                  : "text-red-500/80"
              }`}
            >
              {icon}
            </span>
            <span>{name}</span>
          </h3>
          {/* display */}
          <span
            className={`text-2xl font-mono font-medium ${
              inputType === "time"
                ? progress < 100
                  ? "text-emerald-400"
                  : "text-red-500/80"
                : progress >= 100
                ? "text-emerald-400"
                : "text-red-500/80"
            }`}
          >
            {getDisplayValue()}
            <span className="text-xs text-slate-600 ml-1 font-sans font-bold uppercase">
              {unit}
            </span>
          </span>
        </div>

        {/* goal */}
        {inputType !== "checkbox" && (
          <div className="text-[10px] font-mono text-slate-600 mb-1 bg-slate-900/50 px-2 py-1 rounded-md border border-white/5">
            GOAL: {inputType === "time" ? formatTime(goal) : goal}
          </div>
        )}
      </div>

      {/* bar */}
      {inputType !== "checkbox" &&
        inputType !== "time" &&
        inputType !== "slider" && (
          <div className="relative w-full h-1.5 bg-slate-800/50 rounded-full mb-4 overflow-hidden">
            <div
              className={`absolute h-full rounded-full transition-all duration-700 ease-out ${
                progress >= 100
                  ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                  : "bg-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

      {/* input */}
      <div className="w-full relative z-10">
        {(() => {
          switch (inputType) {
            case "slider":
              return (
                <FluidSlider
                  value={numericValue}
                  max={goal}
                  unit={unit}
                  onChange={handleUpdate}
                />
              );
            case "stepper":
              return (
                <QuantityStepper
                  value={numericValue}
                  onChange={handleUpdate}
                  unit={unit}
                />
              );
            case "time":
              return (
                <TimeController value={numericValue} onChange={handleUpdate} />
              );
            case "checkbox":
              return (
                <StatusToggle isCompleted={!!intaked} onToggle={handleUpdate} />
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}
