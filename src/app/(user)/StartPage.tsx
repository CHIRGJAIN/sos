import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

const StartPage: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  const handleOtp = () => {
    if (mobile.length >= 10) {
      navigate('/user/verify', { state: { mobile } });
    }
  };

  return (
    <div className="portal-shell-center">
      <div className="portal-panel phone-container relative overflow-hidden lg:grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative h-[38vh] min-h-[260px] overflow-hidden lg:h-full">
          <img src={heroBg} alt="Temple sunset" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(24_95%_53%_/_0.85)] lg:bg-gradient-to-r lg:from-[hsl(24_95%_53%_/_0.2)] lg:to-[hsl(24_95%_53%_/_0.75)]" />
          <div className="absolute bottom-0 left-0 right-0 hidden p-10 text-white lg:block">
            <h2 className="font-serif text-4xl font-semibold leading-tight">Emergency Support</h2>
            <p className="mt-3 max-w-md text-sm text-white/90">
              Rapid distress reporting, local services, and social outreach in one place.
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[620px] flex-1 flex-col items-center px-6 pt-6 pb-10 -mt-8 lg:mt-0 lg:justify-center lg:px-12">
          <h1 className="mb-2 text-center font-serif text-2xl font-bold leading-tight text-foreground lg:text-4xl">
            Santakmochan
          </h1>
          <p className="mb-1 text-center font-serif text-lg text-foreground/80 lg:text-2xl">
            Outreach Service
          </p>
          <p className="mb-8 text-center text-xs text-muted-foreground lg:text-sm">
            Santakmochan Outreach Seva
          </p>

          <div className="w-full space-y-4 lg:space-y-5">
            <div className="flex items-center gap-3 rounded-pill bg-popover/80 px-5 py-3 shadow-card lg:px-6 lg:py-4">
              <span className="text-sm text-muted-foreground lg:text-base">+91</span>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground lg:text-base"
              />
            </div>

            <button
              onClick={handleOtp}
              className="w-full rounded-pill bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-neumorphic transition-all hover:opacity-90 active:scale-95 lg:py-4 lg:text-base"
            >
              Get OTP
            </button>
          </div>

          <div className="mt-auto flex flex-col items-center gap-2 pt-6">
            <p className="text-xs text-muted-foreground">Or login with email</p>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-accent underline"
            >
              Dashboard Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
