import React from 'react';
import { PageRoute } from '../types';
import { Plane, Map, Gamepad2, User } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const navItems: {
    route: PageRoute;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    activeBg: string;
    activeText: string;
    activeBorder: string;
    iconColor: string;
    activeIconBg: string;
  }[] = [
    {
      route: 'home',
      label: 'Beranda',
      shortLabel: 'Beranda',
      icon: Plane,
      activeBg: 'bg-amber-100',
      activeText: 'text-amber-950',
      activeBorder: 'border-amber-400',
      iconColor: 'text-amber-600 group-hover:text-amber-700',
      activeIconBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/30',
    },
    {
      route: 'peta',
      label: 'Peta Petualangan',
      shortLabel: 'Peta',
      icon: Map,
      activeBg: 'bg-emerald-100',
      activeText: 'text-emerald-950',
      activeBorder: 'border-emerald-400',
      iconColor: 'text-emerald-600 group-hover:text-emerald-700',
      activeIconBg: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30',
    },
    {
      route: 'game',
      label: 'Mini-Game',
      shortLabel: 'Game',
      icon: Gamepad2,
      activeBg: 'bg-indigo-100',
      activeText: 'text-indigo-950',
      activeBorder: 'border-indigo-400',
      iconColor: 'text-indigo-600 group-hover:text-indigo-700',
      activeIconBg: 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30',
    },
    {
      route: 'profil',
      label: 'Profil Pilot',
      shortLabel: 'Profil',
      icon: User,
      activeBg: 'bg-rose-100',
      activeText: 'text-rose-950',
      activeBorder: 'border-rose-400',
      iconColor: 'text-rose-600 group-hover:text-rose-700',
      activeIconBg: 'bg-rose-500 text-white shadow-md shadow-rose-500/30',
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Navigasi Utama"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t-2 border-amber-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-2">
        <div className="flex items-center justify-around gap-1 sm:gap-3">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            const IconComponent = item.icon;

            return (
              <button
                key={item.route}
                id={`bottom-nav-${item.route}`}
                onClick={() => {
                  soundManager.playClick();
                  onNavigate(item.route);
                }}
                className={`group relative flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl transition-all duration-200 cursor-pointer flex-1 select-none border-2 ${
                  isActive
                    ? `${item.activeBg} ${item.activeBorder} ${item.activeText} shadow-xs font-black scale-102`
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-amber-50/80 hover:text-slate-900 font-bold'
                }`}
              >
                {/* Large Colorful Icon Badge */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? item.activeIconBg
                      : `bg-slate-100 ${item.iconColor} group-hover:scale-110`
                  }`}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Clear, Bold Text Label */}
                <span
                  className={`text-[10px] sm:text-sm font-heading tracking-tight text-center leading-tight sm:leading-normal truncate ${
                    isActive ? 'font-black' : 'font-bold'
                  }`}
                >
                  <span className="sm:hidden">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>

                {/* Subtle active indicator dot for small screens */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute -top-1 w-2 h-2 rounded-full bg-orange-500 sm:hidden"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
