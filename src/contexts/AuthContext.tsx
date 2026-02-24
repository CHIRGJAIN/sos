import React, { createContext, useCallback, useContext, useState } from 'react';

export type Portal = 'user' | 'ngo' | 'admin' | 'resource' | 'authority' | 'business';

interface SessionUser {
  email: string;
  name: string;
}

interface AccountRecord {
  email: string;
  password: string;
  name: string;
}

type AuthState = Record<Portal, SessionUser | null>;
type PortalAccounts = Record<Portal, AccountRecord[]>;

interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  sessions: AuthState;
  loginWithPassword: (portal: Portal, email: string, password: string) => AuthResult;
  registerWithPassword: (portal: Portal, email: string, password: string, name?: string) => AuthResult;
  loginWithOtp: (mobile: string) => void;
  logout: (portal: Portal) => void;
  isLoggedIn: (portal: Portal) => boolean;
  getUser: (portal: Portal) => SessionUser | null;
  getDemoCredentials: (portal: Portal) => { email: string; password: string };
}

const demoAccounts: PortalAccounts = {
  user: [{ email: 'user@sos.app', password: 'user1234', name: 'User Demo' }],
  ngo: [{ email: 'ngo@sos.app', password: 'ngo1234', name: 'NGO Demo' }],
  admin: [{ email: 'admin@sos.app', password: 'admin1234', name: 'Admin Demo' }],
  resource: [{ email: 'resource@sos.app', password: 'resource1234', name: 'Resource Demo' }],
  authority: [{ email: 'authority@sos.app', password: 'authority1234', name: 'Authority Demo' }],
  business: [{ email: 'business@sos.app', password: 'business1234', name: 'Business Demo' }],
};

const initialSessions: AuthState = {
  user: null,
  ngo: null,
  admin: null,
  resource: null,
  authority: null,
  business: null,
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<AuthState>(initialSessions);
  const [accounts, setAccounts] = useState<PortalAccounts>(demoAccounts);

  const loginWithPassword = useCallback(
    (portal: Portal, email: string, password: string): AuthResult => {
      const normalizedEmail = email.trim().toLowerCase();
      const account = accounts[portal].find(
        (item) => item.email.toLowerCase() === normalizedEmail && item.password === password
      );

      if (!account) {
        return { success: false, message: 'Invalid credentials for this portal.' };
      }

      setSessions((prev) => ({
        ...prev,
        [portal]: { email: account.email, name: account.name },
      }));

      return { success: true };
    },
    [accounts]
  );

  const registerWithPassword = useCallback(
    (portal: Portal, email: string, password: string, name?: string): AuthResult => {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedName = (name || normalizedEmail.split('@')[0] || 'User').trim();

      if (!normalizedEmail || !normalizedEmail.includes('@')) {
        return { success: false, message: 'Please enter a valid email address.' };
      }

      if (password.length < 4) {
        return { success: false, message: 'Password must be at least 4 characters long.' };
      }

      const alreadyExists = accounts[portal].some(
        (item) => item.email.toLowerCase() === normalizedEmail
      );
      if (alreadyExists) {
        return { success: false, message: 'An account already exists in this portal for this email.' };
      }

      const account: AccountRecord = {
        email: normalizedEmail,
        password,
        name: normalizedName,
      };

      setAccounts((prev) => ({
        ...prev,
        [portal]: [...prev[portal], account],
      }));

      setSessions((prev) => ({
        ...prev,
        [portal]: { email: account.email, name: account.name },
      }));

      return { success: true };
    },
    [accounts]
  );

  const loginWithOtp = useCallback((mobile: string) => {
    const cleaned = mobile.replace(/\D/g, '').slice(0, 10);
    const email = `${cleaned}@sos.app`;
    const name = 'OTP User';

    setSessions((prev) => ({
      ...prev,
      user: { email, name },
    }));

    setAccounts((prev) => {
      const exists = prev.user.some((item) => item.email === email);
      if (exists) return prev;
      return {
        ...prev,
        user: [...prev.user, { email, password: 'otp-verified', name }],
      };
    });
  }, []);

  const logout = useCallback((portal: Portal) => {
    setSessions((prev) => ({ ...prev, [portal]: null }));
  }, []);

  const isLoggedIn = useCallback((portal: Portal) => !!sessions[portal], [sessions]);
  const getUser = useCallback((portal: Portal) => sessions[portal] || null, [sessions]);
  const getDemoCredentials = useCallback(
    (portal: Portal) => ({
      email: demoAccounts[portal][0].email,
      password: demoAccounts[portal][0].password,
    }),
    []
  );

  return (
    <AuthContext.Provider
      value={{
        sessions,
        loginWithPassword,
        registerWithPassword,
        loginWithOtp,
        logout,
        isLoggedIn,
        getUser,
        getDemoCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
