import React, { useEffect, useState, useRef } from 'react';

// ==========================================
// 1. TYPES & ICONS
// ==========================================

export type StreakActivity = 
  | "sleep" | "wakeUpTime" | "workedOut" | "focus" | "water"
  | "reading" | "studying" | "meals" | "detox"
  | "planning" | "leetCodeSolved" | "duoSolved";

interface StreakWidgetProps {
  type: StreakActivity;
  count: number;
  completedToday: boolean;
}

const ICONS: Record<StreakActivity, React.ReactNode> = {
  sleep: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  wakeUpTime: <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />,
  workedOut: <path d="M6.5 6.5l11 11M21 21l-1-1M3 3l1 1M18 6L6 18M21 3l-1 1M3 21l1-1" />,
  focus: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  water: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
  reading: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />,
  studying: <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" />,
  meals: <path d="M18 8c0 4.4-3.6 8-8 8s-8-3.6-8-8 8-8 8 8zm0 0c0-4.4 3.6-8 8-8v8h-8z" />,
  detox: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  planning: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />,
  leetCodeSolved: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  duoSolved: <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z M8 14v4a4 4 0 0 0 8 0v-4" />,
};

// ==========================================
// 2. CONFIGURATION
// ==========================================

type Tier = 'LOST' | 'BEGINNER' | 'SPARK' | 'FLAME' | 'BLAZE' | 'PLASMA' | 'COSMIC' | 'GOD';

const getTier = (count: number): Tier => {
  if (count === 0) return 'LOST';
  if (count < 5) return 'BEGINNER'; 
  if (count < 10) return 'SPARK';     
  if (count < 50) return 'FLAME';     
  if (count < 100) return 'BLAZE';    
  if (count < 500) return 'PLASMA';   
  if (count < 1000) return 'COSMIC';  
  return 'GOD';                       
};

const TIER_CONFIG: Record<Tier, {
  borderColor: string;
  shadowColor: string;
  textColor: string;
  bgGradient: string;
  animation: string;
  particles: boolean;
  label: string;
}> = {
  LOST: {
    borderColor: "border-stone-800",
    shadowColor: "none",
    textColor: "text-stone-600",
    bgGradient: "bg-stone-950",
    animation: "none",
    particles: false,
    label: "Dormant"
  },
  BEGINNER: {
    borderColor: "border-emerald-500/50",
    shadowColor: "shadow-emerald-500/30",
    textColor: "text-emerald-300",
    bgGradient: "bg-gradient-to-b from-emerald-950/50 to-stone-950",
    animation: "none",
    particles: false,
    label: "Begginner"
  },
  SPARK: {
    borderColor: "border-sky-400/60",
    shadowColor: "shadow-sky-400/40",
    textColor: "text-sky-200",
    bgGradient: "bg-gradient-to-b",
    animation: "animate-pulse",
    particles: false,
    label: "Spark"
  },
  FLAME: {
    borderColor: "border-orange-500",
    shadowColor: "shadow-orange-500/50",
    textColor: "text-orange-300",
    bgGradient: "bg-gradient-to-b",
    animation: "hover:animate-tremble",
    particles: false,
    label: "Heating Up"
  },
  BLAZE: {
    borderColor: "border-red-600",
    shadowColor: "shadow-red-500/60",
    textColor: "text-red-300",
    bgGradient: "bg-gradient-to-br",
    animation: "animate-tremble-slow",
    particles: true,
    label: "On Fire"
  },
  PLASMA: {
    borderColor: "border-fuchsia-500",
    shadowColor: "shadow-fuchsia-500/40",
    textColor: "text-fuchsia-200",
    bgGradient: "bg-gradient-to-r",
    animation: "animate-glitch",
    particles: true,
    label: "Unstoppable"
  },
  COSMIC: {
    borderColor: "border-cyan-400",
    shadowColor: "shadow-cyan-400/60",
    textColor: "text-cyan-100",
    bgGradient: "",
    animation: "animate-tremble",
    particles: true,
    label: "Galactic"
  },
  GOD: {
    borderColor: "border-yellow-400",
    shadowColor: "shadow-yellow-400/60",
    textColor: "text-yellow-100",
    bgGradient: "",
    animation: "animate-god-mode",
    particles: true,
    label: "Immortal"
  }
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

const ProgressiveStreakWidget = ({ type, count, completedToday }: StreakWidgetProps) => {
  // 1. Determine Tier based on Count
  const tier = getTier(count);
  
  // 2. Logic: If it's not completed today, it falls back to the "LOST" visual config (Stone Gray),
  //    regardless of how high the count is.
  //    We keep the label (e.g. "On Fire") or change it to "Reactivate"?
  //    The prompt said "look just like as if they're lost". So we use LOST styling.
  const activeConfig = TIER_CONFIG[tier];
  const lostConfig = TIER_CONFIG['LOST'];

  // We toggle between the colorful config and the gray config
  const currentConfig = completedToday ? activeConfig : lostConfig;

  // 3. Ignition System
  const [ignitionClass, setIgnitionClass] = useState('');
  const prevCompleted = useRef(completedToday);

  useEffect(() => {
    // Check if we just toggled from False -> True
    if (!prevCompleted.current && completedToday) {
      // It was dormant, now it's active. TRIGGER ANIMATION.
      
      // Check if this count is a milestone
      const milestones = [5, 10, 50, 100, 500, 1000];
      const isMilestone = milestones.includes(count);

      if (isMilestone) {
        setIgnitionClass('animate-milestone-pop');
      } else {
        setIgnitionClass('animate-ignition');
      }

      // Cleanup animation class after it runs (1s)
      const timer = setTimeout(() => {
        setIgnitionClass('');
      }, 1000);

      return () => clearTimeout(timer);
    }
    prevCompleted.current = completedToday;
  }, [completedToday, count]);

  return (
    <div className="relative group w-fit select-none">
      
      <style>{`
        /* Standard Persistent Animations */
        @keyframes tremble {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        @keyframes tremble-slow {
          0%, 100% { transform: translate(0,0) rotate(0); }
          25% { transform: translate(0.5px, 0.5px) rotate(0.5deg); }
          75% { transform: translate(-0.5px, -0.5px) rotate(-0.5deg); }
        }
        @keyframes god-mode {
          0% { transform: translate(2px, 2px) scale(1); filter: hue-rotate(0deg); }
          50% { transform: translate(2px, -2px) scale(0.98); filter: hue-rotate(180deg); }
          100% { transform: translate(2px, 2px) scale(1); filter: hue-rotate(360deg); }
        }
        @keyframes glitch {
          0%, 100% { transform: skew(0deg); }
          20% { transform: skew(-2deg); }
          40% { transform: skew(2deg); }
        }

        /* --- IGNITION ANIMATIONS --- */
        
        /* 1. Standard Ignition: Quick white flash + slight pop */
        @keyframes ignition {
          0% { transform: scale(1); filter: brightness(1); }
          30% { transform: scale(1.1); filter: brightness(2); }
          100% { transform: scale(1); filter: brightness(1); }
        }

        /* 2. Milestone Pop: Massive Shockwave */
        @keyframes milestone-pop {
          0% { transform: scale(0.8); filter: brightness(1); box-shadow: 0 0 0 rgba(255,255,255,0); }
          40% { transform: scale(1.15); filter: brightness(3); box-shadow: 0 0 50px rgba(255,255,255,0.8); }
          100% { transform: scale(1); filter: brightness(1); box-shadow: 0 0 0 rgba(255,255,255,0); }
        }

        .animate-tremble { animation: tremble 0.5s infinite; }
        .animate-tremble-slow { animation: tremble-slow 2s infinite; }
        .animate-god-mode { animation: god-mode 0.2s infinite; }
        .animate-glitch { animation: glitch 0.3s infinite; }
        
        /* Triggered Classes */
        .animate-ignition { animation: ignition 0.4s ease-out forwards; }
        .animate-milestone-pop { animation: milestone-pop 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>

      {/* OUTER GLOW / AURA */}
      {/* Only show if active. The color comes from the tier config */}
      {completedToday && (
        <div 
          className={`absolute inset-0 rounded-xl opacity-40 blur-lg transition-all duration-500 group-hover:opacity-70 ${activeConfig.shadowColor.replace('shadow-', 'bg-')}`} 
        />
      )}

      {/* WIDGET CONTAINER */}
      <div 
        className={`
          relative flex h-15 w-[165px] items-center justify-between rounded-xl border-2 px-3 py-2 
          transition-all duration-300 backdrop-blur-md z-10
          ${currentConfig.borderColor} 
          ${currentConfig.bgGradient}
          ${!completedToday ? 'opacity-60 grayscale' : 'shadow-lg'}
          ${completedToday ? activeConfig.shadowColor : 'shadow-none'}
          
          /* ANIMATION LOGIC: 
             1. If ignitionClass exists (just turned on), use that.
             2. Else if completedToday (active), use the persistent tier animation (tremble, etc).
             3. Else (inactive), no animation.
          */
          ${ignitionClass ? ignitionClass : (completedToday ? activeConfig.animation : '')}
        `}
      >

        {/* PARTICLES (Only active if completedToday + high tier) */}
        {completedToday && activeConfig.particles && (
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            <div className="absolute top-0 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-ping opacity-75"></div>
            <div className="absolute bottom-1/4 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-ping delay-300 opacity-75"></div>
          </div>
        )}

        {/* LEFT: Icon & Activity Name */}
        <div className="flex items-center gap-3">
          <div className={`
             flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg border 
             ${!completedToday ? 'border-stone-700 bg-stone-800' : 'border-white/20 bg-white/10'}
          `}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={completedToday ? "1.5" : "1"}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-all ${currentConfig.textColor} ${completedToday ? 'drop-shadow-md' : ''}`}
            >
              {ICONS[type]}
            </svg>
          </div>

          <div className="flex flex-col">
            <span className={`text-[10px] font-black uppercase tracking-widest ${!completedToday ? 'text-stone-500' : 'text-white/60'}`}>
              {type.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className={`text-[9px] font-bold ${currentConfig.textColor}`}>
              {/* If inactive, show "Dormant", else show the Tier Name */}
              {!completedToday ? 'Paused' : activeConfig.label}
            </span>
          </div>
        </div>

        {/* RIGHT: Counter & Status */}
        <div className="flex flex-col items-end">
          <span 
            className={`
              font-mono text-2xl font-black leading-none tracking-tighter transition-all
              ${currentConfig.textColor}
              ${completedToday ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : ''}
            `}
          >
            {count}
          </span>
          
          <span className="text-[9px] font-bold uppercase opacity-60 text-stone-400">
             {!completedToday ? "Tap to Ignite" : "Active"}
          </span>
        </div>

      </div>
    </div>
  );
};

export default ProgressiveStreakWidget;