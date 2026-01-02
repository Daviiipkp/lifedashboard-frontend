import { useEffect, useState } from "react";
import Clock from "../components/Clock";
import { NavigationBar } from "../components/NavigationBar";
import Streak from "../components/Streak";
import { useAuth } from "../contexts/AuthContext";
import { Calendar, FlameIcon, GoalIcon, PencilLine } from "lucide-react";
import { api, getStreaks } from "../services/api";
import type { StreaksData } from "../types/general";
import { useNavigate } from "react-router-dom";
import { useError } from "./error";
import { LoadingPage } from "./loading";
import { IoAnalytics, IoAnalyticsSharp } from "react-icons/io5";
import { GiObservatory } from "react-icons/gi";
import { BiDownArrow } from "react-icons/bi";

function getHalfStreaks(strData: StreaksData, second?: boolean) {
  const { handleError } = useError();
  if (strData?.streaks.length === 0) {
    handleError("No streaks found");
  }
  try {
    if (!second) {
      return strData.streaks.slice(0, strData?.streaks.length / 2);
    }
    return strData.streaks.slice(
      strData?.streaks.length / 2,
      strData?.streaks.length
    );
  } catch (error) {
    handleError(error);
  }
}

export function Dashboard() {
  const { authState, setLoading } = useAuth();
  const user = authState.user;
  const { handleError } = useError();

  const [planning, setPlanning] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">(
    "saved"
  );

  const [streakData, setStreakData] = useState<StreaksData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get<StreaksData>("/api/streaksdata");
        setStreakData(data);
      } catch (error) {
        handleError(error);
        return;
      }
    };
    fetchData();
  }, []);

  if (streakData == null) {
    return <LoadingPage />;
  }
  console.log(streakData);
  return (
    <div className="flex p-1 flex-col items-center bg-gray-900 h-screen">
      <NavigationBar />
      <div className="w-12/12 h-full overflow-hidden flex-1 p-2 flex-col flex items-center gap-3">
        <div className="w-full h-full bg-gray-950/200 p-5 gap-10 rounded-xl flex flex-col flex-1 overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="flex gap-10 h-full overflow-hidden">
            <div className="flex flex-col gap-5 items-center max-h-full flex-1">
              {/* GOALS */}
              <div className="glass-card p-10 flex flex-col rounded-3xl h-1/3 w-full overflow-hidden bg-black shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <GoalIcon size={16} className="text-amber-500" /> Goal
                    Analytics
                  </h3>
                </div>

                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl">
                  <h1 className="text-slate-500">---GOALS GO HERE---</h1>
                </div>
              </div>
              {/*  */}
              {/* STREAKS */}
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
                            type={streak.type}
                            count={streak.count}
                            completedToday={true}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-px h-7xl bg-slate-600 dark:bg-white/10 mx-1" />
              </div>
              {/*  */}
            </div>
            <div className="lg:col-span-5 items-center gap-6 w-3/4 overflow-hidden rounded-3xl">
              <div className="glass-card p-10 flex flex-col rounded-2xl overflow-hidden bg-black h-full">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <IoAnalyticsSharp size={30} className="text-amber-500" />{" "}
                  Daily Data
                </h3>
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
                  className="bg-transparent border-none outline-none resize-none text-xl font-medium text-slate-100 dark:text-slate-200 leading-relaxed custom-scrollbar placeholder:text-slate-200/20 dark:placeholder:text-white/10"
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
              <div className="glass-card p-8 flex-1 rounded-3xl max-h-full transition-all overflow-hidden bg-black shadow-2xl duration-200 peer-hover:max-h-1/8">
                <div className="flex items-center justify-between mb-8 max-h-full">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex gap-2">
                    <Calendar size={16} className="text-amber-500" />
                    Monthly Progress
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
