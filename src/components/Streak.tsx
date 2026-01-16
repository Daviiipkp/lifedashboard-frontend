import React, { useEffect, useState, useRef } from "react";

export type DefaultStreak =
  | "sleep"
  | "wakeUpTime"
  | "workedOut"
  | "focus"
  | "water"
  | "reading"
  | "studying"
  | "meals"
  | "detox"
  | "planning"
  | "leetCodeSolved"
  | "duoSolved";

export interface StreakWidgetProps {
  type: DefaultStreak | string;
  count: number;
  completedToday: boolean;
  customThemeColor?: string;
}

const ICONS: Record<string, React.ReactNode> = {
  sleep: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  wakeUpTime: (
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  ),
  workedOut: (
    <path d="M6.5 6.5l11 11M21 21l-1-1M3 3l1 1M18 6L6 18M21 3l-1 1M3 21l1-1" />
  ),
  focus: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  water: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
  reading: (
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  ),
  studying: <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" />,
  meals: (
    <path d="M18 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 8-8 8 8zm0 0c0-4.4 3.6-8 8-8v8h-8z" />
  ),
  detox: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  planning: (
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  ),
  leetCodeSolved: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  duoSolved: (
    <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z M8 14v4a4 4 0 0 0 8 0v-4" />
  ),
  default: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
};

type ThemeConfig = {
  primary: string;
  secondary: string;
  border: string;
  shadow: string;
  gradient: string;
};

const STREAK_THEMES: Record<string, ThemeConfig> = {
  sleep: {
    primary: "text-indigo-200",
    secondary: "text-indigo-400",
    border: "border-indigo-500/50",
    shadow: "shadow-indigo-500/40",
    gradient: "from-indigo-950/50 to-stone-950",
  },
  wakeUpTime: {
    primary: "text-amber-100",
    secondary: "text-amber-300",
    border: "border-amber-400/60",
    shadow: "shadow-amber-400/40",
    gradient: "from-amber-950/50 to-stone-950",
  },
  workedOut: {
    primary: "text-rose-200",
    secondary: "text-rose-400",
    border: "border-rose-500/60",
    shadow: "shadow-rose-500/50",
    gradient: "from-rose-950/50 to-stone-950",
  },
  focus: {
    primary: "text-cyan-100",
    secondary: "text-cyan-300",
    border: "border-cyan-400/60",
    shadow: "shadow-cyan-400/40",
    gradient: "from-cyan-950/50 to-stone-950",
  },
  water: {
    primary: "text-sky-200",
    secondary: "text-sky-400",
    border: "border-sky-500/50",
    shadow: "shadow-sky-500/40",
    gradient: "from-sky-950/50 to-stone-950",
  },
  reading: {
    primary: "text-emerald-100",
    secondary: "text-emerald-300",
    border: "border-emerald-500/50",
    shadow: "shadow-emerald-500/30",
    gradient: "from-emerald-950/50 to-stone-950",
  },
  studying: {
    primary: "text-violet-200",
    secondary: "text-violet-400",
    border: "border-violet-500/60",
    shadow: "shadow-violet-500/40",
    gradient: "from-violet-950/50 to-stone-950",
  },
  leetCodeSolved: {
    primary: "text-yellow-200",
    secondary: "text-yellow-500",
    border: "border-yellow-500/60",
    shadow: "shadow-yellow-500/40",
    gradient: "from-yellow-950/50 to-stone-950",
  },
  duoSolved: {
    primary: "text-green-300",
    secondary: "text-green-500",
    border: "border-green-500/60",
    shadow: "shadow-green-500/40",
    gradient: "from-green-950/50 to-stone-950",
  },
  default: {
    primary: "text-stone-200",
    secondary: "text-stone-400",
    border: "border-stone-500/50",
    shadow: "shadow-stone-500/20",
    gradient: "from-stone-800/50 to-stone-950",
  },
  lost: {
    primary: "text-stone-600",
    secondary: "text-stone-700",
    border: "border-stone-800",
    shadow: "none",
    gradient: "from-transparent to-stone-950",
  },
};

type TierLabel =
  | "BEGINNER"
  | "SPARK"
  | "FLAME"
  | "BLAZE"
  | "PLASMA"
  | "COSMIC"
  | "GOD";

const TIER_LEVELS: Record<
  TierLabel,
  { animation: string; particles: boolean; label: string }
> = {
  BEGINNER: { animation: "none", particles: false, label: "Beginner" },
  SPARK: { animation: "animate-pulse", particles: false, label: "Spark" },
  FLAME: {
    animation: "hover:animate-tremble",
    particles: false,
    label: "Heating Up",
  },
  BLAZE: {
    animation: "animate-tremble-slow",
    particles: true,
    label: "On Fire",
  },
  PLASMA: {
    animation: "animate-glitch",
    particles: true,
    label: "Unstoppable",
  },
  COSMIC: { animation: "animate-tremble", particles: true, label: "Galactic" },
  GOD: { animation: "animate-god-mode", particles: true, label: "Immortal" },
};

const getTierLevel = (count: number): TierLabel => {
  if (count < 5) return "BEGINNER";
  if (count < 10) return "SPARK";
  if (count < 50) return "FLAME";
  if (count < 100) return "BLAZE";
  if (count < 500) return "PLASMA";
  if (count < 1000) return "COSMIC";
  return "GOD";
};

const ProgressiveStreakWidget = ({
  type,
  count,
  completedToday,
}: StreakWidgetProps) => {
  const isLost = count === 0;
  const isDormant = !isLost && !completedToday;
  const isActive = !isLost && completedToday;

  const themeKey = STREAK_THEMES[type] ? type : "default";
  const activeTheme = STREAK_THEMES[themeKey];
  const lostTheme = STREAK_THEMES["lost"];

  const currentTheme = isLost ? lostTheme : activeTheme;

  const tierLevel = getTierLevel(count);
  const tierConfig = TIER_LEVELS[tierLevel];

  const [ignitionClass, setIgnitionClass] = useState("");
  const prevCompleted = useRef(completedToday);

  useEffect(() => {
    if (!prevCompleted.current && completedToday) {
      const milestones = [5, 10, 50, 100, 500, 1000];
      const isMilestone = milestones.includes(count);

      setIgnitionClass(
        isMilestone ? "animate-milestone-pop" : "animate-ignition"
      );
      const timer = setTimeout(() => setIgnitionClass(""), 1000);
      return () => clearTimeout(timer);
    }
    prevCompleted.current = completedToday;
  }, [completedToday, count]);

  return (
    <div className="relative group w-fit select-none">
      <style>{`
        @keyframes tremble { 0% { transform: translate(1px, 1px) rotate(0deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
        @keyframes tremble-slow { 0%, 100% { transform: translate(0,0) rotate(0); } 25% { transform: translate(0.5px, 0.5px) rotate(0.5deg); } 75% { transform: translate(-0.5px, -0.5px) rotate(-0.5deg); } }
        @keyframes god-mode { 0% { transform: translate(2px, 2px) scale(1); filter: hue-rotate(0deg); } 50% { transform: translate(2px, -2px) scale(0.98); filter: hue-rotate(180deg); } 100% { transform: translate(2px, 2px) scale(1); filter: hue-rotate(360deg); } }
        @keyframes glitch { 0%, 100% { transform: skew(0deg); } 20% { transform: skew(-2deg); } 40% { transform: skew(2deg); } }
        @keyframes ignition { 0% { transform: scale(1); filter: brightness(1); } 30% { transform: scale(1.1); filter: brightness(2); } 100% { transform: scale(1); filter: brightness(1); } }
        @keyframes milestone-pop { 0% { transform: scale(0.8); filter: brightness(1); box-shadow: 0 0 0 rgba(255,255,255,0); } 40% { transform: scale(1.15); filter: brightness(3); box-shadow: 0 0 50px rgba(255,255,255,0.8); } 100% { transform: scale(1); filter: brightness(1); box-shadow: 0 0 0 rgba(255,255,255,0); } }
        
        .animate-tremble { animation: tremble 0.5s infinite; }
        .animate-tremble-slow { animation: tremble-slow 2s infinite; }
        .animate-god-mode { animation: god-mode 0.2s infinite; }
        .animate-glitch { animation: glitch 0.3s infinite; }
        .animate-ignition { animation: ignition 0.4s ease-out forwards; }
        .animate-milestone-pop { animation: milestone-pop 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>

      {isActive && (
        <div
          className={`absolute inset-0 rounded-xl opacity-40 blur-lg transition-all duration-500 group-hover:opacity-70 ${currentTheme.shadow.replace(
            "shadow-",
            "bg-"
          )}`}
        />
      )}

      <div
        className={`
          relative flex h-15 w-[165px] items-center justify-between rounded-xl border-2 px-3 py-2 
          transition-all duration-300 backdrop-blur-md z-10
          bg-gradient-to-b ${currentTheme.gradient}
          ${currentTheme.border}
          
          /* Lógica de Estado (Active vs Dormant vs Lost) */
          ${isActive ? `shadow-lg ${currentTheme.shadow}` : "shadow-none"}
          ${isDormant ? "opacity-60 grayscale-[0.3]" : ""} 
          ${isLost ? "opacity-60 grayscale" : ""}

          /* Lógica de Animação (Ignition > Tier Animation > None) */
          ${
            ignitionClass ? ignitionClass : isActive ? tierConfig.animation : ""
          }
        `}
      >
        {isActive && tierConfig.particles && (
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            <div className="absolute top-0 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-ping opacity-75"></div>
            <div className="absolute bottom-1/4 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-ping delay-300 opacity-75"></div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div
            className={`
              flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg border 
              ${
                isActive
                  ? "border-white/20 bg-white/10"
                  : "border-stone-700 bg-stone-800"
              }
            `}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={isActive ? "1.5" : "1"}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-all ${currentTheme.primary} ${
                isActive ? "drop-shadow-md" : ""
              }`}
            >
              {ICONS[type] || ICONS["default"]}
            </svg>
          </div>

          <div className="flex flex-col">
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${
                isActive ? "text-white/60" : "text-stone-500"
              }`}
            >
              {type.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span className={`text-[9px] font-bold ${currentTheme.secondary}`}>
              {isLost ? "Dormant" : tierConfig.label}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span
            className={`
              font-mono text-2xl font-black leading-none tracking-tighter transition-all
              ${currentTheme.primary}
              ${isActive ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : ""}
            `}
          >
            {count}
          </span>
          {isDormant && (
            <span className="text-[7px] font-bold uppercase opacity-60 text-stone-400">
              Continue
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressiveStreakWidget;
