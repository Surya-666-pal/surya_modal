import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Landmark, Globe2, ShieldAlert, Sparkles } from 'lucide-react';

function Counter({ targetValue, prefix = "", suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Extract numeric part from targetValue
  const numTarget = parseInt(targetValue.toString().replace(/[^0-9]/g, ''), 10) || 0;

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = numTarget;
    const totalFrames = Math.round((duration * 1000) / 16);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = 1 - Math.pow(2, -10 * progress);
      const current = Math.min(Math.round(start + (end - start) * easeProgress), end);
      
      setCount(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(end);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, numTarget, duration]);

  // Format count with comma separator if >= 1000
  const formatted = count >= 1000 ? count.toLocaleString('en-IN') : count;

  return (
    <span ref={ref} className="font-serif font-bold tabular-nums">
      {prefix}{formatted}{suffix}
    </span>
  );
}

export default function StatsStrip() {
  const stats = [
    {
      icon: Landmark,
      number: 3600,
      suffix: "+",
      label: "Heritage Sites",
      subtext: "ASI protected & cultural points",
      color: "text-amber-400",
      bgColor: "bg-amber-500/20"
    },
    {
      icon: Globe2,
      number: 15,
      suffix: "+",
      label: "Languages Supported",
      subtext: "Including regional dialects",
      color: "text-teal-300",
      bgColor: "bg-teal-500/20"
    },
    {
      icon: ShieldAlert,
      specialValue: "24/7",
      label: "SOS Safety",
      subtext: "Police & medical network",
      color: "text-rose-400",
      bgColor: "bg-rose-500/20"
    },
    {
      icon: Sparkles,
      specialValue: "Tour Guide",
      label: "Gemini AI",
      subtext: "",
      color: "text-saffron",
      bgColor: "bg-saffron/20",
      hasPulse: true
    },
  ];

  return (
    <section 
      id="stats-strip" 
      className="relative bg-forest-900/90 backdrop-blur-2xl border-y border-white/15 py-7 lg:py-9 z-20 shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className={`flex items-center gap-4 pt-4 sm:pt-0 ${idx !== 0 ? 'sm:pl-6 lg:pl-8' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`p-3 rounded-2xl ${stat.bgColor} border border-white/20 flex items-center justify-center shadow-md backdrop-blur-md relative z-10`}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                  </div>
                  {stat.hasPulse && (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-saffron/40 animate-ping opacity-60 pointer-events-none scale-105" />
                      <div className="absolute -inset-1 rounded-[18px] border border-saffron/30 animate-pulse pointer-events-none" />
                    </>
                  )}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-none mb-1 drop-shadow-sm">
                    {stat.specialValue ? (
                      <span className="font-serif font-bold">{stat.specialValue}</span>
                    ) : (
                      <Counter targetValue={stat.number} suffix={stat.suffix} />
                    )}
                  </div>
                  <div className="text-sm font-semibold text-stone-200 tracking-wide">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-stone-400 font-normal hidden sm:block">
                    {stat.subtext}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
