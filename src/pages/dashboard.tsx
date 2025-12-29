import Clock from "../components/Clock";
import { NavigationBar } from "../components/NavigationBar";
import Streak, { type StreakActivity } from "../components/Streak";
import { useAuth} from "../contexts/AuthContext";

export function Dashboard() {
  const {authState} = useAuth();
  const user = authState.user;

  const streaks: StreakActivity[] = ['sleep', 'wakeUpTime', 'workedOut', 'meals', 'water', 'detox', 'reading', 'studying', 'focus', 'leetCodeSolved', 'duoSolved'];
  const count: number[] = [5,10,50,100,500,1000,0,0,0,0,0];
  
  return (
    <div className="flex p-1 flex-col items-center bg-gray-900 min-h-screen">
      <NavigationBar />
      <div className="h-fit w-11/12 p-2 flex-col flex items-center gap-3">
        <div className="w-full h-full bg-black p-10 rounded-xl flex flex-col shadow-2xl shadow-blue-500/20">
          <Clock />
          <div className="flex gap-5 w-fit">
            <div className="flex flex-col gap-3 w-fit">
              <p className=" text-white font-extrabold text-2xl">Streaks</p>
              {streaks.map ((streak, index) => (
                <Streak type={streak} count={count[index]} completedToday={true} />
              ))}

            </div>
            <div className="w-px h-7xl bg-slate-200 dark:bg-white/10 mx-1" />
          </div>
        </div>
      <input type="text" className="w-1/3 h-full bg-transparent border-0 outline-none text-white" placeholder="Today's thoughts..?"/>
      </div>
    </div>
  );
}