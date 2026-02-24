import React from 'react';
import { Heart, Twitter, Home, ClipboardList, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Heart, path: '/ngo/feed', label: 'NGO' },
  { icon: Twitter, path: '/user/social', label: 'Social' },
  { icon: Home, path: '/user/home', label: 'Home', isCenter: true },
  { icon: ClipboardList, path: '/user/contributions', label: 'Resources' },
  { icon: MapPin, path: '/user/services', label: 'Services' },
];

const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 pt-2 sm:px-5 lg:inset-y-0 lg:left-0 lg:right-auto lg:w-24 lg:px-4 lg:py-6">
      <div className="pointer-events-auto grid grid-cols-5 gap-1.5 rounded-2xl border border-white/20 bg-navbar/95 px-2 py-2 shadow-neumorphic backdrop-blur lg:h-full lg:grid-cols-1 lg:gap-2 lg:rounded-3xl lg:px-2 lg:py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 transition-all lg:gap-1 lg:px-1 lg:py-3 ${
                isActive
                  ? 'bg-popover/20 text-navbar-foreground shadow-soft'
                  : 'text-navbar-foreground/70 hover:bg-popover/10 hover:text-navbar-foreground'
              }`}
              aria-label={item.label}
            >
              <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-[11px] font-medium lg:text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;
