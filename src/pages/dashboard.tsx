import { useEffect, useState } from "react";
import Clock from "../components/Clock";
import { NavigationBar } from "../components/NavigationBar";
import Streak from "../components/Streak";
import { useAuth } from "../contexts/AuthContext";
import {
  Calendar,
  FlameIcon,
  GoalIcon,
  PencilIcon,
  PencilLine,
  Plus,
  Trash2,
} from "lucide-react";
import { api } from "../services/api";
import type {
  DailyData,
  Goal,
  PertinentData,
  StreaksData,
} from "../types/general";
import { data, useNavigate } from "react-router-dom";
import { ErrorPage, useError } from "./error";
import { LoadingPage } from "./loading";
import { IoAnalytics, IoAnalyticsSharp } from "react-icons/io5";
import { GiObservatory } from "react-icons/gi";
import { BiDownArrow } from "react-icons/bi";
import { useContent } from "../contexts/ContentContext";
import GoalWidget from "../components/goalwidget";
import Calendarr from "../components/Calendar";
import DailyAnalysis from "../components/DailyAnalysis";

function getHalfStreaks(strData?: StreaksData, second?: boolean) {
  const { handleError } = useError();
  if (strData?.streaks.length === 0) {
    handleError("No streaks found");
  }
  try {
    if (!second) {
      return strData?.streaks.slice(0, strData?.streaks.length / 2);
    }
    return strData?.streaks.slice(
      strData?.streaks.length / 2,
      strData?.streaks.length
    );
    //
  } catch (error) {
    handleError(error);
  }
}

export function Dashboard() {
  const { authState, setLoading } = useAuth();
  const user = authState.user;
  const { handleError } = useError();
  const { waitForStreaks, waitForDailyData, waitForPertinentData } =
    useContent();

  const [planning, setPlanning] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "unsaved" | "saving" | "error"
  >("saved");

  const [showEditModal, setShowEditModal] = useState(false);
  const [tempGoals, setTempGoals] = useState<{ goals: Goal[] | undefined }>({
    goals: [],
  });

  const [streakData, setStreakData] = useState<StreaksData | null>(null);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [pertinentData, setPertinentData] = useState<PertinentData | null>(
    null
  );
  const [isLoadingData, setIsLoadingData] = useState(true);

  const handleGoalChange = (
    index: number,
    field: keyof Goal,
    value: string | number
  ) => {
    setTempGoals((prev) => {
      if (!prev.goals) return prev;
      const updatedGoals = [...prev.goals];

      updatedGoals[index] = {
        ...updatedGoals[index],
        [field]: value,
      };

      return { ...prev, goals: updatedGoals };
    });
  };

  const handleAddGoal = () => {
    setTempGoals((prev) => ({
      goals: [
        ...(prev.goals || []),
        {
          name: "",
          target: "100",
          progress: 0,
          unit: "pts",
        },
      ],
    }));
  };

  const handleRemoveGoal = (index: number) => {
    setTempGoals((prev) => {
      if (!prev.goals) return prev;
      const updatedGoals = prev.goals.filter((_, i) => i !== index);
      return { ...prev, goals: updatedGoals };
    });
  };

  const editGoals = async () => {
    setTempGoals({ goals: pertinentData?.goals });
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (!tempGoals.goals) return;

    try {
      await api.post("/api/updategoals", { goals: tempGoals.goals });

      setPertinentData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          goals: tempGoals.goals || [],
        };
      });

      setShowEditModal(false);
    } catch (error) {
      handleError(error);
    }
  };

  if (!waitForDailyData || !waitForPertinentData || !waitForStreaks) {
    return <LoadingPage />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: strData } = await waitForStreaks();
        setStreakData(strData);
        const { data: dlData } = await waitForDailyData();
        setDailyData(dlData);
        const { data: prtData } = await waitForPertinentData();
        setPertinentData(prtData);
        setPlanning(dlData?.planning);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (planning === "" || planning === dailyData?.planning) return;

    setSaveStatus("unsaved");

    const delayDebounceFn = setTimeout(async () => {
      try {
        setSaveStatus("saving");
        await api.post("/api/saveplanning", { planning });
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [planning]);

  if (isLoadingData) {
    return <LoadingPage />;
  } else if (!dailyData) {
    return <ErrorPage />;
  } else if (!streakData) {
    return <ErrorPage />;
  }

  return (
    <div className="flex p-1 flex-col items-center bg-gray-900 h-screen">
      <NavigationBar />
      <div className="w-full h-full overflow-hidden flex-1 p-2 flex-col flex items-center gap-3">
        <div className="w-full h-full bg-gray-950 p-5 gap-10 rounded-xl flex flex-col flex-1 overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="flex gap-10 h-full overflow-hidden">
            <div className="flex flex-col gap-5 items-center max-h-full flex-1">
              {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl flex flex-col max-h-[90vh]">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-[20px] font-black uppercase tracking-widest text-amber-100/50">
                        Edit Goals
                      </h2>
                    </div>

                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                      {tempGoals.goals?.map((goal, index) => (
                        <div
                          key={index}
                          className="group relative rounded-lg border border-zinc-700 bg-zinc-950/50 p-4 transition-colors hover:border-zinc-600"
                        >
                          <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-12 sm:col-span-5">
                              <label className="mb-1 block text-xs font-medium text-zinc-500">
                                Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Learn Java"
                                value={goal.name}
                                onChange={(e) =>
                                  handleGoalChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded bg-zinc-800 p-2 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-600"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label className="mb-1 block text-xs font-medium text-zinc-500">
                                Target
                              </label>
                              <input
                                type="text"
                                placeholder="100"
                                value={goal.target}
                                onChange={(e) =>
                                  handleGoalChange(
                                    index,
                                    "target",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded bg-zinc-800 p-2 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-600"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-2">
                              <label className="mb-1 block text-xs font-medium text-zinc-500">
                                Unit
                              </label>
                              <input
                                type="text"
                                placeholder="hrs"
                                value={goal.unit}
                                onChange={(e) =>
                                  handleGoalChange(
                                    index,
                                    "unit",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded bg-zinc-800 p-2 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-600"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-2">
                              <label className="mb-1 block text-xs font-medium text-zinc-500">
                                Current
                              </label>
                              <input
                                type="number"
                                value={goal.progress}
                                onChange={(e) =>
                                  handleGoalChange(
                                    index,
                                    "progress",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full rounded bg-zinc-800 p-2 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveGoal(index)}
                            className="absolute -right-2 -top-2 rounded-full bg-zinc-800 p-1 text-zinc-500 opacity-0 shadow-lg transition-all hover:bg-red-500/20 hover:text-red-500 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={handleAddGoal}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 py-3 text-sm font-medium text-zinc-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500"
                      >
                        <Plus size={16} />
                        Add New Goal
                      </button>

                      {(!tempGoals.goals || tempGoals.goals.length === 0) && (
                        <p className="text-center text-sm text-zinc-500 py-4">
                          No goals found. Add one above.
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t border-zinc-800 pt-4">
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="rounded px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                      >
                        Cancel
                      </button>

                      <div
                        onClick={handleSaveChanges}
                        className="flex items-center justify-center bg-linear-to-b cursor-pointer from-slate-500 to-slate-400 hover:to-slate-700 hover:from-slate-600 transition-colors duration-300 rounded-2xl text-slate-900 font-bold px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Changes
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GOALS WIDGET */}
              <div className="glass-card p-10 flex flex-col rounded-3xl h-1/3 w-full overflow-hidden bg-black shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <GoalIcon size={16} className="text-amber-500" /> Goal
                    Analytics
                  </h3>
                  <div
                    onClick={editGoals}
                    className="bg-linear-to-b flex cursor-pointer from-slate-500 to-slate-400 hover:to-slate-700 hover:from-slate-600 transition-colors duration-300 rounded-2xl text-slate-900 font-bold px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PencilIcon size={16} className="mr-1 my-1" />
                    Edit Goals
                  </div>
                </div>

                <div className="flex flex-col border-2 border-dashed h-full w-full border-slate-800 rounded-2xl custom-scrollbar overflow-y-auto">
                  {pertinentData?.goals.length === 0 ? (
                    <h1 className="text-center text-slate-500/90 font-bold mt-5">
                      No goals added yet
                    </h1>
                  ) : (
                    pertinentData?.goals.map((goal, index) => (
                      <GoalWidget key={index} goal={goal} />
                    ))
                  )}
                </div>
              </div>

              <div className="flex w-fit gap-3 bg-black p-3 max-h-full overflow-hidden rounded-xl">
                <div className="w-px h-7xl bg-slate-600 dark:bg-white/10 mx-1" />
                <div className="flex-col flex flex-1 overflow-auto no-scrollbar max-h-full">
                  <h3 className=" text-red-400 text-center font-extrabold text-2xl pb-5">
                    <FlameIcon className="inline mr-2 mb-1" />
                    Streaks
                  </h3>
                  <div className="flex gap-5 ">
                    <div className="flex flex-col gap-3 w-fit ">
                      {getHalfStreaks(streakData)?.map((streak, index) => (
                        <Streak
                          key={`s1-${index}`}
                          type={streak.type}
                          count={streak.count}
                          completedToday={true}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col gap-3 w-fit ">
                      {getHalfStreaks(streakData, true)?.map(
                        (streak, index) => (
                          <Streak
                            key={`s2-${index}`}
                            type={streak.type}
                            count={streak.count}
                            completedToday={streak.completedToday}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-px h-7xl bg-slate-600 dark:bg-white/10 mx-1" />
              </div>
            </div>

            {/* DAILY DATA COLUMNS */}
            <div className="lg:col-span-5 items-center gap-6 w-3/4 overflow-hidden rounded-3xl">
              <div className="glass-card p-10 flex flex-col rounded-2xl overflow-hidden bg-black h-full">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <IoAnalyticsSharp size={30} className="text-amber-500" />{" "}
                  Daily Data
                </h3>
                <DailyAnalysis
                  log={dailyData.dailyLogged}
                  config={pertinentData?.config}
                  performanceScore={
                    pertinentData == null
                      ? 0
                      : pertinentData.calendar.daysWithData[
                          new Date().getDate()
                        ]
                  }
                />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6 w-5/12 h-full overflow-hidden rounded-3xl">
              <div className="peer glass-card p-8 flex flex-col flex-1 rounded-3xl max-h-1/8 hover:max-h-6/8 duration-500 transition-all overflow-hidden bg-black shadow-2xl group">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <PencilLine size={12} className="text-amber-500" /> Daily
                    Thoughts
                  </h3>
                  <div className="text-[9px] font-bold pl-5 opacity-0 group-hover:opacity-80 uppercase tracking-widest transition-all">
                    {saveStatus}
                  </div>
                  <BiDownArrow
                    size={12}
                    className="text-amber-500 opacity-80 group-hover:opacity-0 transition-all"
                  />
                </div>
                <textarea
                  value={planning}
                  onChange={(e) => setPlanning(e.target.value)}
                  placeholder="What are you up to..?"
                  className="bg-transparent border-none outline-none resize-none text-xl w-full h-full font-medium text-slate-100 dark:text-slate-200 leading-relaxed custom-scrollbar placeholder:text-slate-200/20 dark:placeholder:text-white/10"
                />
              </div>
              <div className="peer glass-card p-8 flex flex-col flex-1 rounded-3xl max-h-1/8 hover:max-h-6/8 duration-500 transition-all overflow-hidden bg-black shadow-2xl group">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex gap-2">
                    <GiObservatory size={16} className="text-amber-500" />
                    Daily Observations
                  </h3>
                  <BiDownArrow
                    size={12}
                    className="text-amber-500 opacity-80 group-hover:opacity-0 transition-all"
                  />
                </div>
              </div>
              <div className="glass-card p-8 flex-1 rounded-3xl max-h-full transition-all overflow-hidden bg-black shadow-2xl duration-200 peer-hover:max-h-1/9">
                <div className="flex flex-col justify-between mb-8 gap-10 max-h-full">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex gap-2">
                    <Calendar size={16} className="text-amber-500" />
                    Monthly Progress
                  </h3>
                  <div className="h-full w-full">
                    <Calendarr
                      daysData={pertinentData?.calendar.daysWithData || []}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
