import React, { useEffect, useState, useRef } from "react";
import type { StreakColors } from "../types/general";
import { Icon } from "lucide-react";

export interface StreakWidgetProps {
  type: string;
  count: number;
  completedToday: boolean;
  currentTheme: StreakColors;
}

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
  currentTheme,
}: StreakWidgetProps) => {
  const isLost = count === 0;
  const isDormant = !isLost && !completedToday;
  const isActive = !isLost && completedToday;

  const tierLevel = getTierLevel(count);
  const tierConfig = TIER_LEVELS[tierLevel];

  const [ignitionClass, setIgnitionClass] = useState("");
  const prevCompleted = useRef(completedToday);

  useEffect(() => {
    if (!prevCompleted.current && completedToday) {
      const milestones = [5, 10, 50, 100, 500, 1000];
      const isMilestone = milestones.includes(count);

      setIgnitionClass(
        isMilestone ? "animate-milestone-pop" : "animate-ignition",
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
            "bg-",
          )}`}
        />
      )}

      <div
        className={`
          relative flex h-15 w-[165px] items-center justify-between rounded-xl border-2 px-3 py-2 
          transition-all duration-300 backdrop-blur-md z-10
          bg-gradient-to-b ${currentTheme.gradient}
          ${currentTheme.outline}
          
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
              className={`h-4 w-4 transition-all ${currentTheme.main} ${
                isActive ? "drop-shadow-md" : ""
              }`}
            >
              {/*  CHGANGE THIS SHIT */}
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
            <span className={`text-[9px] font-bold ${currentTheme.text}`}>
              {isLost ? "Dormant" : tierConfig.label}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span
            className={`
              font-mono text-2xl font-black leading-none tracking-tighter transition-all
              ${currentTheme.main}
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
