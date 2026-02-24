import React from 'react';

interface TabSwitchProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const TabSwitch: React.FC<TabSwitchProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 rounded-pill bg-popover/50 p-1 shadow-soft lg:p-1.5">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => onTabChange(i)}
          className={`flex-1 rounded-pill px-4 py-2 text-sm font-medium transition-all duration-200 lg:px-6 lg:py-2.5 lg:text-base ${
            activeTab === i
              ? 'bg-accent text-accent-foreground shadow-neumorphic'
              : 'bg-transparent text-foreground hover:bg-popover/80'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSwitch;
