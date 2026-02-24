import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopHeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

const TopHeader: React.FC<TopHeaderProps> = ({ title, showBack = true, rightElement }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-primary/15 bg-popover/35 px-5 py-3 backdrop-blur-sm lg:px-8 lg:py-4">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-popover/70 shadow-soft transition-transform active:scale-90 lg:h-10 lg:w-10"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
      ) : <div className="w-9 lg:w-10" />}
      {title && <h1 className="text-lg font-serif font-semibold text-foreground lg:text-2xl">{title}</h1>}
      {rightElement || <div className="w-9 lg:w-10" />}
    </div>
  );
};

export default TopHeader;
