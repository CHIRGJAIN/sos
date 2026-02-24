import React from 'react';

interface PillButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const PillButton: React.FC<PillButtonProps> = ({
  children, active = false, onClick, className = '', variant = 'default', size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variantClasses = active || variant === 'accent'
    ? 'bg-accent text-accent-foreground shadow-neumorphic'
    : variant === 'outline'
    ? 'bg-popover/80 text-foreground border border-border shadow-soft'
    : 'bg-popover/90 text-foreground shadow-card';

  return (
    <button
      onClick={onClick}
      className={`rounded-pill font-medium transition-all duration-200 active:scale-95 ${sizeClasses[size]} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default PillButton;
