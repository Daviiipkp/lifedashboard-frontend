import { useEffect, useState } from "react";
import { NavigationBar } from "../components/NavigationBar";
import { useAuth } from "../contexts/AuthContext";
import {
  BookCheck,
  BookIcon,
  GlassesIcon,
  GlassWaterIcon,
  LogsIcon,
  PhoneIcon,
  PhoneOffIcon,
  SunMedium,
} from "lucide-react";
import type { DailyLog } from "../types/general";
import { ErrorPage, useError } from "./error";
import { LoadingPage } from "./loading";
import { GiGymBag, GiHamShank, GiOfficeChair } from "react-icons/gi";
import { useContent } from "../contexts/ContentContext";
import { LogComponent } from "../components/LogComponent";
import { FcMindMap } from "react-icons/fc";
import { SiStudyverse } from "react-icons/si";
import { HiOfficeBuilding } from "react-icons/hi";

export function Log() {
  const { handleError } = useError();

  const [logData, setLogData] = useState<DailyLog | null>(null);
  const [saving, setSaving] = useState(false);

  const { waitForLog, saveLog } = useContent();

  if (!waitForLog || !saveLog) {
    return <ErrorPage />;
  }

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

  const handleUpdateLog = (field: keyof DailyLog, value: number | boolean) => {
    setLogData((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const saveLogData = async () => {
    if (!logData) return;
    try {
      setSaving(true);
      await saveLog(logData);
      setSaving(false);
    } catch (error) {
      setSaving(false);
      handleError(error);
    }
  };

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
                  <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Log your activity
                  </span>
                </h3>

                <div className="flex gap-5 w-full h-full">
                  {/**/}
                  <div className="w-2/4 items-center flex flex-col gap-5 h-11/12">
                    <h1 className="text-[10px] text-center font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      Biological Telemetry
                    </h1>
                    <div className="flex w-full gap-2 h-full">
                      <div className="w-full flex flex-col h-full justify-evenly gap-4">
                        {/* WATER */}
                        <LogComponent
                          intaked={logData.waterIntake?.valueOf() || 0}
                          goal={2000}
                          icon={<GlassWaterIcon size={16} />}
                          name="Water Intake"
                          inputType="slider"
                          unit="ml"
                          onUpdate={(val) =>
                            handleUpdateLog("waterIntake", val as number)
                          }
                        />

                        {/* MEALS */}
                        <LogComponent
                          intaked={logData.meals?.valueOf() || 0}
                          goal={5}
                          icon={<GiHamShank size={16} />}
                          name="Food Intake"
                          inputType="stepper"
                          unit="meals"
                          onUpdate={(val) =>
                            handleUpdateLog("meals", val as number)
                          }
                        />

                        {/* SLEEP*/}
                        <LogComponent
                          intaked={logData.sleepTime?.valueOf() || 0}
                          goal={8}
                          icon={<GlassWaterIcon size={16} />}
                          name="Hours Slept"
                          inputType="stepper"
                          unit="h"
                          onUpdate={(val) =>
                            handleUpdateLog("sleepTime", val as number)
                          }
                        />
                      </div>

                      <div className="w-full flex flex-col h-full justify-evenly gap-4">
                        {/* WAKE UP */}
                        <LogComponent
                          intaked={logData.wakeUpTime?.valueOf() || 0}
                          goal={6.5}
                          icon={<SunMedium size={16} />}
                          name="Wake Up Time"
                          inputType="time"
                          unit=""
                          onUpdate={(val) =>
                            handleUpdateLog("wakeUpTime", val as number)
                          }
                        />

                        {/* WORKOUT*/}
                        <LogComponent
                          intaked={logData.workedOut?.valueOf() || false}
                          goal={1}
                          icon={<GiGymBag size={16} />}
                          name="Worked Out"
                          inputType="checkbox"
                          unit=""
                          onUpdate={(val) =>
                            handleUpdateLog("workedOut", !!val)
                          }
                        />

                        {/* FOCUS LEVEL */}
                        <LogComponent
                          intaked={logData.focusLevel?.valueOf() || 0}
                          goal={10}
                          icon={<FcMindMap size={16} />}
                          name="Focus Level"
                          inputType="slider"
                          unit="/10"
                          onUpdate={(val) =>
                            handleUpdateLog("focusLevel", val as number)
                          }
                        />
                      </div>
                    </div>
                    {/**/}
                  </div>
                  {/*                  {/**                        */}

                  <div className="h-full bg-amber-100/10 w-0.5" />
                  <div className="w-2/4 items-center flex flex-col gap-5 h-11/12">
                    <h1 className="text-[10px] text-center font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      Logistics Telemetry
                    </h1>
                    <div className="flex w-full h-full">
                      <div className="w-full flex flex-col h-full justify-between gap-4">
                        <div className="w-full flex justify-evenly h-full gap-2">
                          {/* READING */}
                          <LogComponent
                            intaked={logData.reading?.valueOf() || 0}
                            goal={30}
                            icon={<BookIcon size={16} />}
                            name="Reading Pages"
                            inputType="slider"
                            unit="pages"
                            onUpdate={(val) =>
                              handleUpdateLog("reading", val as number)
                            }
                          />

                          {/* STUDYING */}
                          <LogComponent
                            intaked={logData.studying?.valueOf() || 0}
                            goal={30}
                            icon={<SiStudyverse size={16} />}
                            name="Studying Time"
                            inputType="slider"
                            unit="minutes"
                            onUpdate={(val) =>
                              handleUpdateLog("studying", val as number)
                            }
                          />
                        </div>
                        {/* WORKING */}
                        <div className="w-full flex h-full justify-evenly gap-2">
                          <LogComponent
                            intaked={logData.working?.valueOf() || 0}
                            goal={8}
                            icon={<HiOfficeBuilding size={16} />}
                            name="Working Time"
                            inputType="slider"
                            unit="hours"
                            onUpdate={(val) => handleUpdateLog("working", val)}
                          />
                        </div>

                        {/* DETOX */}
                        <div className="w-full flex h-full justify-evenly gap-2">
                          <LogComponent
                            intaked={logData.detox?.valueOf() || false}
                            goal={1}
                            icon={<PhoneOffIcon size={16} />}
                            name="Social Media Detox"
                            inputType="checkbox"
                            unit=""
                            onUpdate={(val) => handleUpdateLog("detox", val)}
                          />
                        </div>
                      </div>
                    </div>
                    {/**/}
                  </div>
                  <button
                    onClick={saveLogData}
                    disabled={saving}
                    className="bg-linear-to-b from-slate-500 to-slate-400 hover:to-slate-700 hover:from-slate-600 transition-colors duration-300 absolute right-20 bottom-15 rounded-2xl text-slate-900 font-bold py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
