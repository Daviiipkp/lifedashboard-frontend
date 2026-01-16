import React, { useMemo } from "react";
import {
  Activity,
  BookOpen,
  Brain,
  Clock,
  Droplets,
  Moon,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { DailyLog } from "../types/general";

export interface HabitsConfig {
  sleepGoal?: number;
  maxWakeUpTime?: number;
  waterIntakeGoal?: number;
  readingGoal?: number;
  studyingGoal?: number;
  mealsPerDayGoal?: number;
  weekTrainingDays?: number;
  detox?: boolean;
}

interface DailyAnalysisProps {
  log?: DailyLog;
  config?: HabitsConfig;
  performanceScore: number;
}

const DailyAnalysis: React.FC<DailyAnalysisProps> = ({
  log,
  config,
  performanceScore,
}) => {
  const analysis = useMemo(() => {
    const check = (condition: boolean) => condition;

    const sleepGoal = config?.sleepGoal || 8;
    const sleepActual = log?.sleepTime || 0;
    const sleepMet = check(sleepActual >= sleepGoal);

    const maxWake = config?.maxWakeUpTime || 8;
    const wakeActual = log?.wakeUpTime || 0;
    const wakeMet = check(wakeActual > 0 && wakeActual <= maxWake);

    const waterGoal = config?.waterIntakeGoal || 2500;
    const waterActual = log?.waterIntake || 0;
    const waterMet = check(waterActual >= waterGoal);
    const waterPercentage = Math.min(100, (waterActual / waterGoal) * 100);

    const mindGoal = (config?.readingGoal || 0) + (config?.studyingGoal || 0);
    const mindActual = (log?.reading || 0) + (log?.studying || 0);
    const mindMet = check(mindActual >= mindGoal);

    const workedOut = check(!!log?.workedOut);

    const displayScore = Math.round(performanceScore * 20);

    let statusMsg = "";
    let statusColor = "text-gray-400";

    if (performanceScore >= 4.5) {
      statusMsg = "Elite Performance";
      statusColor = "text-emerald-400";
    } else if (performanceScore >= 3.5) {
      statusMsg = "Productive Day";
      statusColor = "text-blue-400";
    } else if (performanceScore >= 2.5) {
      statusMsg = "Average Day";
      statusColor = "text-zinc-400";
    } else {
      statusMsg = "Needs Attention";
      statusColor = "text-red-400";
    }

    return {
      score: displayScore,
      statusMsg,
      statusColor,
      sleep: { met: sleepMet, val: sleepActual, goal: sleepGoal },
      wake: { met: wakeMet, val: wakeActual },
      water: { met: waterMet, val: waterActual, pct: waterPercentage },
      mind: { met: mindMet, val: mindActual, goal: mindGoal },
      workout: workedOut,
      focus: log?.focusLevel || 0,
    };
  }, [log, config, performanceScore]);

  const ProgressBar = ({
    pct,
    colorClass,
  }: {
    pct: number;
    colorClass: string;
  }) => (
    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mt-1">
      <div
        className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, subtext, accent }: any) => (
    <div className="bg-zinc-900/50 border border-white/5 p-3 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-zinc-950 ${accent}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
            {label}
          </p>
          <p className="text-sm font-semibold text-zinc-100">{value}</p>
        </div>
      </div>
      {subtext && <span className="text-xs text-zinc-500">{subtext}</span>}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 text-zinc-100 font-sans overflow-y-auto">
      <div className="flex flex-col items-center justify-center relative">
        <div
          className={`absolute w-32 h-32 rounded-full blur-3xl opacity-20 ${
            analysis.score >= 60 ? "bg-emerald-500" : "bg-rose-500"
          }`}
        />

        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            {analysis.score}
            <span className="text-2xl text-zinc-500">%</span>
          </h2>
          <p
            className={`text-sm font-medium tracking-widest uppercase mt-2 ${analysis.statusColor}`}
          >
            {analysis.statusMsg}
          </p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
            <Activity size={12} /> Physiology
          </div>

          <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <Droplets size={16} className="text-cyan-400" />
                <span className="text-sm font-medium">Water Intake</span>
              </div>
              <span className="text-xs text-zinc-400">
                {analysis.water.val} / {config?.waterIntakeGoal} ml
              </span>
            </div>
            <ProgressBar
              pct={analysis.water.pct}
              colorClass="bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-4 rounded-xl border flex flex-col gap-2 ${
                analysis.sleep.met
                  ? "bg-emerald-950/20 border-emerald-500/20"
                  : "bg-zinc-900 border-white/5"
              }`}
            >
              <div className="flex justify-between items-start">
                <Moon
                  size={16}
                  className={
                    analysis.sleep.met ? "text-emerald-400" : "text-zinc-500"
                  }
                />
                {analysis.sleep.met ? (
                  <CheckCircle2 size={14} className="text-emerald-500" />
                ) : (
                  <span className="text-xs text-rose-400">
                    {analysis.sleep.val}h
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs text-zinc-400 block">Sleep</span>
                <span className="text-sm font-semibold">
                  {analysis.sleep.val}h
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex flex-col gap-2 ${
                analysis.workout
                  ? "bg-emerald-950/20 border-emerald-500/20"
                  : "bg-rose-950/10 border-rose-500/20"
              }`}
            >
              <div className="flex justify-between items-start">
                <Zap
                  size={16}
                  className={
                    analysis.workout ? "text-emerald-400" : "text-rose-400"
                  }
                />
                {analysis.workout ? (
                  <CheckCircle2 size={14} className="text-emerald-500" />
                ) : (
                  <XCircle size={14} className="text-rose-500" />
                )}
              </div>
              <div>
                <span className="text-xs text-zinc-400 block">Workout</span>
                <span className="text-sm font-semibold">
                  {analysis.workout ? "Done" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
            <Brain size={12} /> Cognitive
          </div>

          <StatCard
            icon={BookOpen}
            label="Learning"
            value={`${analysis.mind.val} min`}
            subtext={`Target: ${analysis.mind.goal}m`}
            accent="text-violet-400"
          />

          <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-amber-400" />
                <span className="text-sm font-medium">Focus Level</span>
              </div>
              <span className="text-xl font-bold text-amber-400">
                {analysis.focus}/10
              </span>
            </div>
            <div className="flex gap-1 h-2 mt-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full ${
                    i < analysis.focus ? "bg-amber-500" : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-white/10 pt-4 flex justify-between items-center text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Clock size={12} />
          Woke up at {analysis.wake.val}h
        </div>
        <div
          className={analysis.wake.met ? "text-emerald-500" : "text-rose-500"}
        >
          {analysis.wake.met ? "On time!" : "Late..."}
        </div>
      </div>
    </div>
  );
};

export default DailyAnalysis;
