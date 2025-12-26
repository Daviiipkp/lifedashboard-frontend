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
      <NavigationBar/>
      <div className="h-fit w-11/12 p-2 flex-col flex items-center gap-3">
          <div className="w-full h-full bg-black p-10 rounded-xl flex flex-col shadow-2xl shadow-blue-500/20">
            {/*<span className={user?.userRole=="ADMIN"?"text-red-700 pb-10 text-center font-bold":"text-white"}>{user?.userRole=="ADMIN"?"You are an Admin":""}.</span>*/}
            <Clock />
            <div className="flex">
              
              <div className="flex flex-col p-5 gap-5">
                <p className=" text-white font-extrabold text-2xl">Streaks</p>
                {streaks.map ((streak, index) => (
                  <Streak type={streak} count={count[index]} completedToday={true} />
                ))}
                
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}