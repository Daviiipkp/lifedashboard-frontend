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
  SunMedium,
} from "lucide-react";
import { api, getStreaks } from "../services/api";
import type { DailyLog, StreaksData } from "../types/general";
import { useNavigate } from "react-router-dom";
import { useError } from "./error";
import { LoadingPage } from "./loading";
import { IoAnalytics, IoAnalyticsSharp } from "react-icons/io5";
import { GiGymBag, GiHamShank, GiObservatory } from "react-icons/gi";
import { BiDownArrow } from "react-icons/bi";
import { RiInputMethodLine } from "react-icons/ri";
import { useContent } from "../contexts/ContentContext";
import { LogComponent } from "../components/LogComponent";
import { FcMindMap } from "react-icons/fc";

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

  const [logData, setLogData] = useState<DailyLog | null>(null);

  const { waitForLog } = useContent();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await waitForLog();
        setLogData(data);
      } catch (error) {
        handleError(error);
        return;
      }
    };
    fetchData();
  }, []);

  if (logData == null) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col items-center bg-gray-900 h-screen">
      <NavigationBar />
      <div className="w-full h-full overflow-hidden flex-1 flex-col flex items-center gap-3">
        <div className="w-full h-full bg-gray-950/200 gap-10 rounded-xl flex flex-col flex-1 overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="flex gap-10 h-full overflow-hidden">
            <div className="lg:col-span-5 items-center gap-6 m-8 mt-1 mb-4 w-full overflow-hidden rounded-3xl">
              <div className="glass-card p-10 flex flex-col rounded-2xl overflow-hidden bg-black h-full w-full">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-5">
                  <LogsIcon size={16} className="text-amber-500" />
                  <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    Log your activity
                  </h3>
                </h3>
                {/* start stuff */}
                <div className="flex gap-5">
                  <div className="w-1/4 items-center flex flex-col gap-5 h-11/12">
                    <h1 className="text-[10px] text-center font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      Biological Telemetry
                    </h1>
                    <div className="flex w-full gap-2">
                      <div className="h-full bg-amber-100/20 w-0.5" />
                      <div className="gap-5 w-full flex flex-col h-full">
                        <LogComponent
                          intaked={logData.waterIntake?.valueOf() || 0}
                          goal={2000}
                          icon={
                            <GlassWaterIcon
                              size={16}
                              className="text-blue-500"
                            />
                          }
                          name="Water Intake"
                          inputType="slider"
                          unit="ml"
                        />
                        <LogComponent
                          intaked={logData.meals?.valueOf() || 0}
                          goal={5}
                          icon={
                            <GiHamShank size={16} className="text-yellow-600" />
                          }
                          name="Food Intake"
                          inputType="button"
                          unit=" meals"
                        />
                        <LogComponent
                          intaked={logData.sleepTime?.valueOf() || 0}
                          goal={8}
                          icon={
                            <GlassWaterIcon
                              size={16}
                              className="text-purple-600"
                            />
                          }
                          name="Hours of sleep"
                          inputType="slider"
                          unit=" hours"
                        />
                      </div>
                    </div>
                  </div>
                  {/*  */}
                  {/*  */}
                  {/*  */}
                  <div className="w-1/4 items-center flex flex-col gap-5 h-11/12">
                    <h1 className="text-[10px] text-center font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      Logistics telemetry
                    </h1>
                    <div className="flex w-full gap-2">
                      <div className="gap-5 w-full flex flex-col h-full">
                        <LogComponent
                          intaked={logData.waterIntake?.valueOf() || 0}
                          goal={2000}
                          icon={
                            <SunMedium size={16} className="text-yellow-500" />
                          }
                          name="Wake Up Time"
                          inputType="slider"
                          unit="hours"
                        />
                        <LogComponent
                          intaked={logData.meals?.valueOf() || 0}
                          goal={5}
                          icon={<GiGymBag size={16} className="text-red-400" />}
                          name="Worked Out"
                          inputType="checkbox"
                          unit=" meals"
                        />
                        <LogComponent
                          intaked={logData.sleepTime?.valueOf() || 0}
                          goal={10}
                          icon={
                            <FcMindMap size={16} className="text-purple-600" />
                          }
                          name="Focus Level"
                          inputType="slider"
                          unit=""
                        />
                      </div>
                      <div className="h-full bg-amber-100/20 w-0.5" />
                    </div>
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
