import { FlameIcon, GlassWaterIcon } from "lucide-react";

export function WaterIntake() {
  return (
    <div className="flex flex-col gap-2 p-5 outline-amber-300/30 bg-linear-to-b from-slate-800/50 to-slate-600/50 outline-2 rounded-3xl w-fit">
      <h3 className="text-[10px] w-full font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
        <GlassWaterIcon size={16} className="text-blue-500" />
        <span className="pr-5">Water intake</span>
        <div className="gap-0 flex ml-auto">
          <FlameIcon size={16} className="text-amber-700/50 ml-auto pb-0.5" />
          <span className="text-amber-700/50">25</span>
        </div>
      </h3>

      <div className="bg-slate-400/80 h-px w-full my-2"></div>
      <div className="relative flex py-1 w-full">
        <div className="bg-linear-to-b from-blue-400 to-blue-800 w-10 h-5 rounded-l-2xl"></div>
        <div className="bg-blue-300/20 w-full h-5 rounded-r-2xl"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            20%
          </span>
        </div>
      </div>
      <div className="flex gap-6 justify-items-center justify-around ">
        <button className="bg-linear-to-b from-slate-800/50 to-slate-600/50 outline-amber-200/50 outline-1 px-3 py-1 rounded-3xl text-[10px] text-amber-50/80 cursor-pointer hover:bg-blue-400/50 transition-all duration-300">
          +100ml
        </button>
        <button className="bg-linear-to-b from-slate-800/50 to-slate-600/50 outline-amber-200/50 outline-1 px-3 py-1 rounded-3xl text-[10px] text-amber-50 cursor-pointer hover:bg-blue-400/50 transition-all duration-300">
          +250ml
        </button>
        <button className="bg-linear-to-b from-slate-800/50 to-slate-600/50 outline-amber-200/50 outline-1 px-3 py-1 rounded-3xl text-[10px] text-amber-50/120 cursor-pointer hover:bg-blue-400/50 transition-all duration-300">
          +500ml
        </button>
      </div>
    </div>
  );
}
