import React, { useState, useEffect } from 'react';

const TimeCard = ({ value, label }: { value: string | number; label: string }) => {
  return (
    <div className="flex flex-col items-center">
    <div className="relative flex h-20 w-16 items-center justify-center rounded-xl bg-gray-800/50 text-3xl font-bold text-yellow-200 shadow-xl backdrop-blur-md border border-white/10 sm:h-24 sm:w-20 sm:text-5xl">
        
        {/* Mudei inset-5 para inset-0 para o brilho ocupar o card todo */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
    
        <span className="tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {value}
        </span>
        
    </div>
    
    {/* Mudei mt-4 para mt-2 e text-sm para text-xs */}
    <span className="mt-2 text-xs font-medium tracking-widest text-yellow-600 uppercase">
        {label}
    </span>
</div>
  );
};

const Separator = () => (
  <div className="flex flex-col gap-4 pb-4">
    <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
    <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
  </div>
);

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  if (!mounted) return null;

  return (
    // border-gray-700 bg-gray-900/40 border
      <div className="bg-black self-center relative w-fit flex-col gap-3 sm:gap-4 rounded-3xl p-3 backdrop-blur-xl sm:p-2">
        <div className="flex p-3 sm:p-5 items-center gap-4 sm:gap-4 align-middle justify-center">
            <TimeCard value={formatNumber(time.getHours())} label="Hours" />
            <Separator />
            <TimeCard value={formatNumber(time.getMinutes())} label="Minutes" />
            <Separator />
            <div className="group">
            <TimeCard value={formatNumber(time.getSeconds())} label="Seconds" />
            </div>
        </div>

        <div className="text-center text-gray-500 font-mono text-sm tracking-widest">
            {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

      </div>
      
  );
};

export default DigitalClock;