import React, { useState, useEffect } from "react";

interface Gridprops {
  daysData: number[];
}
const Calendarr = ({ daysData }: Gridprops) => {
  const getLevel = (level: number) => {
    const colors = [
      "bg-zinc-800/50",
      "bg-emerald-900",
      "bg-emerald-700",
      "bg-emerald-500",
      "bg-emerald-400 outline outline-1 outline-yellow-200/80",
      "bg-emerald-300 outline outline-2 outline-yellow-200/80",
    ];
    return colors[level] || colors[0];
  };

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(32px,1fr))] content-start self-center relative w-full h-full gap-5 rounded-3xl backdrop-blur-xl sm:p-2 overflow-hidden">
        {daysData.map((level, index) => (
          <div
            key={index}
            className={`aspect-square rounded-sm ${getLevel(
              level,
            )} transition-colors hover:border grid place-items-center hover:border-white/20`}
            title={`Level: ${level}`}
          >
            <h1 className="text-center text-[12px] font-bold ">{index + 1}</h1>
          </div>
        ))}
      </div>

      <div className="p-5">
        {daysData.map((level, index) =>
          level > 4 ? (
            <h1 className="text-center text-[12px] font-bold ">
              Day {index + 1} was a 5 star day!
            </h1>
          ) : null,
        )}
      </div>
    </div>
  );
};

export default Calendarr;
