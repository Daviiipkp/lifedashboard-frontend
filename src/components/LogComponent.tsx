import { Plus, Check, Zap, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";

const FluidSlider = ({ value, max, onChange, unit }: any) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="relative w-full h-10 flex items-center select-none group mt-1">
      <div className="absolute w-full h-1.5 bg-slate-900/80 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
        <div
          className="h-full bg-gradient-to-r from-blue-900 to-blue-500 rounded-l-full opacity-60"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-pointer z-20"
      />
      <div
        className="absolute h-5 w-5 bg-slate-200 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[3px] border-slate-800 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 flex items-center justify-center"
        style={{ left: `calc(${percentage}% - 10px)` }}
      >
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
      </div>
    </div>
  );
};

const QuickPresets = ({ onAdd, unit }: any) => {
  const amounts = [100, 250, 500];
  return (
    <div className="grid grid-cols-3 gap-3 w-full mt-2">
      {amounts.map((amt) => (
        <button
          key={amt}
          onClick={() => onAdd(amt)}
          className="group relative py-2 bg-slate-800/50 hover:bg-blue-600/10 border border-slate-700 hover:border-blue-400/30 rounded-lg transition-all active:scale-95"
        >
          <span className="text-[10px] font-semibold text-slate-400 group-hover:text-blue-200">
            +{amt}
            {unit}
          </span>
        </button>
      ))}
    </div>
  );
};

const SmartInput = ({ onAdd, unit }: any) => {
  const [val, setVal] = useState("");
  const handleSubmit = () => {
    if (!val) return;
    onAdd(Number(val));
    setVal("");
  };
  return (
    <div className="relative w-full flex items-center mt-2 group">
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Qtd..."
        className="w-full bg-slate-950/30 border border-slate-700/50 rounded-lg py-2 pl-3 pr-9 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all placeholder:text-slate-600"
      />
      <button
        onClick={handleSubmit}
        disabled={!val}
        className="absolute right-1.5 p-1 bg-blue-600/80 hover:bg-blue-500 text-white rounded-md disabled:opacity-0 transition-all active:scale-90"
      >
        <Plus size={12} />
      </button>
    </div>
  );
};

const StatusToggle = ({ isCompleted, onToggle }: any) => {
  return (
    <div
      onClick={() => onToggle(!isCompleted)}
      className={`w-full flex items-center justify-between px-3 py-2 mt-2 rounded-lg border cursor-pointer transition-all duration-300 ${
        isCompleted
          ? "bg-emerald-500/5 border-emerald-500/30"
          : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
            isCompleted
              ? "bg-emerald-500 text-slate-900"
              : "bg-slate-700 text-slate-500"
          }`}
        >
          {isCompleted ? (
            <Check size={12} strokeWidth={4} />
          ) : (
            <Zap size={10} />
          )}
        </div>
        <span
          className={`text-[11px] font-medium tracking-wide ${
            isCompleted ? "text-emerald-400" : "text-slate-400"
          }`}
        >
          {isCompleted ? "META ATINGIDA" : "CONCLUIR"}
        </span>
      </div>
    </div>
  );
};
interface LogProps {
  intaked: number;
  goal: number;
  icon: React.ReactNode;
  name: string;
  inputType: "slider" | "button" | "checkbox" | "input";
  unit: string;
  onUpdate?: (newValue: number) => void;
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(getPercentage(intaked, goal));
  }, [intaked, goal]);

  const handleUpdate = (val: number | boolean, mode: "set" | "add") => {
    if (!onUpdate) return;
    let newValue = intaked;
    if (inputType === "checkbox" && typeof val === "boolean") {
      newValue = val ? goal : 0;
    } else if (typeof val === "number") {
      if (mode === "add") newValue = intaked + val;
      if (mode === "set") newValue = val;
    }
    onUpdate(Math.max(0, newValue));
  };

  const percentage = Math.min(progress, 100);

  return (
    <div className="flex flex-col p-5 bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-white/5 rounded-[2rem] h-fit w-full shadow-2xl backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <span className="text-blue-400/90 drop-shadow-lg">{icon}</span>
          <span>{name}</span>
        </h3>
        <span className="text-[10px] font-mono text-slate-500">
          {intaked} / {goal}
          {unit}
        </span>
      </div>

      <div className="relative w-full h-7 bg-slate-950/60 rounded-full p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] border-b border-white/5">
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute top-0.5 left-1 right-1 h-[40%] bg-gradient-to-b from-white/30 to-transparent rounded-full opacity-80" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wider">
            {progress}%
          </span>
        </div>
      </div>

      <div className="w-full mt-3 relative z-10 h-2/3">
        {(() => {
          switch (inputType) {
            case "slider":
              return (
                <FluidSlider
                  value={intaked}
                  max={goal}
                  unit={unit}
                  onChange={(val: number) => handleUpdate(val, "set")}
                />
              );
            case "button":
              return (
                <QuickPresets
                  unit={unit}
                  onAdd={(val: number) => handleUpdate(val, "add")}
                />
              );
            case "input":
              return (
                <SmartInput
                  unit={unit}
                  onAdd={(val: number) => handleUpdate(val, "add")}
                />
              );
            case "checkbox":
              return (
                <StatusToggle
                  isCompleted={progress >= 100}
                  onToggle={(val: boolean) => handleUpdate(val, "set")}
                />
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}

function getPercentage(intaked: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.floor((intaked / goal) * 100);
}
