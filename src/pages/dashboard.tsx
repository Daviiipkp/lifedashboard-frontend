import { useEffect, useState } from "react";
import Clock from "../components/Clock";
import { NavigationBar } from "../components/NavigationBar";
import Streak from "../components/Streak";
import { useAuth} from "../contexts/AuthContext";
import { PencilLine } from "lucide-react";
import { api, getStreaks } from "../services/api";
import type { StreaksData } from "../types/general";
import { useNavigate } from "react-router-dom";
import { Error } from "./error";
import { LoadingPage } from "./loading";

export function Dashboard() {
  const {authState, setLoading} = useAuth();
  const user = authState.user;

  const [planning, setPlanning] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  
  const [streakData, setStreakData] = useState<StreaksData | null>(null);

  const {handleError} = Error();
  
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
    
  if(streakData == null) {
    return <LoadingPage/>;
  }
  console.log(streakData);
  return (
    <div className="flex p-1 flex-col items-center bg-gray-900 min-h-screen">
      <NavigationBar />
      <div className="h-fit w-11/12 p-2 flex-col flex items-center gap-3">
        <div className="w-full h-full bg-gray-950 p-10 gap-10 rounded-xl flex flex-col shadow-2xl shadow-blue-500/20">
          <div className="flex items-center">
            <Clock />
            <div className="lg:col-span-5 flex flex-col gap-6 h-2/5 overflow-hidden rounded-3xl" >
              <div className="glass-card p-8 flex flex-col flex-1 overflow-hidden bg-black  shadow-2xl relative">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <PencilLine size={12} className="text-amber-500" /> Manifesto Diário
                  </h3>
                  <div className="text-[9px] font-bold uppercase tracking-widest opacity-80 transition-all">
                      {saveStatus}
                  </div>
                </div>
                <textarea 
                  value={planning}
                  onChange={(e) => setPlanning(e.target.value)}
                  placeholder="Defina suas intenções críticas. Este texto pode ser atualizado a qualquer momento do dia."
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-xl font-medium text-slate-600 dark:text-slate-200 leading-relaxed custom-scrollbar placeholder:text-slate-300 dark:placeholder:text-white/10"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-5 w-fit">
            <div className="flex flex-col gap-3 w-fit">
              <p className=" text-white font-extrabold text-2xl">Streaks</p>
              {streakData?.streaks.map ((streak, index) => (
                <Streak type={streak.type} count={streak.count} completedToday={true} />
              ))}

            </div>
            <div className="w-px h-7xl bg-slate-200 dark:bg-white/10 mx-1" />
          </div>
        </div>
      
      </div>
      
    </div>
  );
}