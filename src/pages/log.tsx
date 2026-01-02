import { useEffect, useState } from "react";
import Clock from "../components/Clock";
import { NavigationBar } from "../components/NavigationBar";
import Streak from "../components/Streak";
import { useAuth } from "../contexts/AuthContext";
import {
  Calendar,
  FlameIcon,
  GlassWaterIcon,
  GoalIcon,
  LogsIcon,
  PencilLine,
} from "lucide-react";
import { api, getStreaks } from "../services/api";
import type { DailyLog, StreaksData } from "../types/general";
import { useNavigate } from "react-router-dom";
import { useError } from "./error";
import { LoadingPage } from "./loading";
import { IoAnalytics, IoAnalyticsSharp } from "react-icons/io5";
import { GiObservatory } from "react-icons/gi";
import { BiDownArrow } from "react-icons/bi";
import { RiInputMethodLine } from "react-icons/ri";
import { WaterIntake } from "../components/WaterIntake";

function sendLog(log: DailyLog) {
  const { handleError } = useError();

  try {
  } catch (error) {
    handleError(error);
  }
}

export function Log() {
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
            <div className="flex flex-col gap-5 items-center max-h-full flex-1"></div>
            <div className="lg:col-span-5 items-center gap-6 w-full overflow-hidden rounded-3xl">
              <div className="glass-card p-10 flex flex-col rounded-2xl overflow-hidden bg-black h-full w-full">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-5">
                  <LogsIcon size={16} className="text-amber-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    Log your activity
                  </h3>
                </h3>
                <WaterIntake />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
