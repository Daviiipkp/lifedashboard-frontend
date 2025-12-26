import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { IoAddCircleOutline } from "react-icons/io5";
import { TextLogo } from "./TextLogo";
import { Home, PlusCircle, Sun, Moon, User, BarChart2, Target } from 'lucide-react';
import { useLocation } from "react-router-dom";
import type React from "react";

function getRedirectionWidget(name: string, icon: React.ReactNode) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (<Link to={name} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive(name) ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>
                    {icon}
                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{name.replace("/", "")}</span>
                  </Link>);
}

export function NavigationBar() {
  const { authState, logout } = useAuth();

  return (
    <nav className="bg-black top-10/12 rounded-4xl max-w-8/12 w-6/12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex  items-center justify-between h-14">
          
          <div className="relative flex items-center ">
            <TextLogo />
          </div>


          <div className="flex items-center gap-3">
            
            {authState.isAuthenticated ? (
              <>

                <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl shadow-sm">
                  {getRedirectionWidget("/profile", <User size={16} />)}
                  <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                  {getRedirectionWidget("/log", <Target size={16} />)}
                  <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                  {getRedirectionWidget("/ranking", <BarChart2 size={16} />)}
                  <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                  {getRedirectionWidget("/dashboard", <Home size={16} />)}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                
                <Link 
                  to="/register" 
                  className="bg-amber-600 hover:bg-amber-400 hover:text-black text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
}