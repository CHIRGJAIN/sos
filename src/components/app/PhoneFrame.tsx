import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="portal-panel phone-container relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default PhoneFrame;
