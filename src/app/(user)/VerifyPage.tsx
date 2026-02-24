import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TopHeader from '@/components/app/TopHeader';

interface VerifyLocationState {
  mobile?: string;
}

const VerifyPage: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithOtp } = useAuth();
  const mobile = ((location.state as VerifyLocationState | null)?.mobile) || '9999999999';

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code === '123456' || code.length === 6) {
      loginWithOtp(mobile);
      navigate('/user/home');
    }
  };

  return (
    <div className="portal-shell-center">
      <div className="portal-panel phone-container">
        <TopHeader title="Verify OTP" />

        <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center px-6 pt-10">
          <div className="w-full rounded-2xl border-2 border-primary/25 bg-popover/90 p-6 shadow-neumorphic lg:p-8">
            <h2 className="mb-1 text-center font-serif text-lg font-semibold lg:text-2xl">
              Mobile Number linked
            </h2>
            <p className="mb-6 text-center text-sm text-muted-foreground lg:text-base">
              Aadhar OTP verification
            </p>

            <div className="mb-6 flex justify-center gap-2 lg:gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="h-12 w-10 rounded-md border-2 border-primary/30 bg-popover text-center text-lg font-bold text-foreground shadow-soft outline-none focus:border-accent lg:h-14 lg:w-12"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              className="w-full rounded-pill bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-neumorphic transition-all active:scale-95 lg:py-4 lg:text-base"
            >
              Verify
            </button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground lg:text-sm">
            Dev OTP: 123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
