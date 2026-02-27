import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, Portal } from '@/contexts/AuthContext';
import { useSosApp } from '@/sos/context/SosAppContext';

interface LoginPageProps {
  portal: Portal;
  title: string;
  redirectTo: string;
}

const portalRoutes: Array<{ portal: Portal; label: string; path: string }> = [
  { portal: 'user', label: 'User', path: '/user/login' },
  { portal: 'ngo', label: 'NGO', path: '/ngo/login' },
  { portal: 'authority', label: 'Authority', path: '/authority/login' },
  { portal: 'business', label: 'Business', path: '/business/login' },
  { portal: 'resource', label: 'Resource', path: '/resource/login' },
  { portal: 'admin', label: 'Admin', path: '/admin/login' },
];

const sosCredentialsByPortal = {
  authority: { email: 'authority@sos.gov', password: 'authority123' },
  ngo: { email: 'ngo@sos.org', password: 'ngo123' },
} as const;

const LoginPage: React.FC<LoginPageProps> = ({ portal, title, redirectTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const { loginWithPassword, registerWithPassword, getDemoCredentials } = useAuth();
  const { login: loginToSos } = useSosApp();
  const navigate = useNavigate();
  const demo = getDemoCredentials(portal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = isRegister
      ? registerWithPassword(portal, email, password, email.split('@')[0])
      : loginWithPassword(portal, email, password);

    if (result.success) {
      if (portal === 'authority' || portal === 'ngo') {
        const sosCreds = sosCredentialsByPortal[portal];
        const sosResult = loginToSos(portal, sosCreds.email, sosCreds.password);

        if (!sosResult.success) {
          setError(sosResult.message || 'Unable to initialize dashboard session.');
          return;
        }
      }

      setError('');
      navigate(redirectTo);
    } else {
      setError(result.message || 'Unable to authenticate.');
    }
  };

  return (
    <div className="portal-shell-center">
      <div className="portal-panel phone-container lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden border-r border-primary/20 bg-[linear-gradient(160deg,hsl(24_95%_53%_/_0.85)_0%,hsl(20_88%_45%_/_0.75)_45%,hsl(30_70%_75%_/_0.6)_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-end">
          <h2 className="font-serif text-4xl font-semibold leading-tight">Secure Portal Access</h2>
          <p className="mt-4 max-w-md text-sm text-white/90">
            Unified login for user, NGO, authority, business, resource, and admin workflows with role-specific routing.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[620px] flex-1 flex-col items-center justify-center px-8 py-10">
          <div className="w-full rounded-2xl border border-primary/20 bg-popover/80 p-6 shadow-neumorphic lg:p-8">
            <h1 className="mb-2 text-center font-serif text-2xl font-bold text-foreground lg:text-3xl">{title}</h1>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              {isRegister ? 'Create your account' : 'Login to continue'}
            </p>
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {portalRoutes.map((item) => (
                <Link
                  key={item.portal}
                  to={item.path}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    item.portal === portal
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-primary/20 bg-popover text-foreground/80'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="mb-4 rounded-lg border border-primary/20 bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
              Demo credentials for this portal: <span className="font-medium text-foreground">{demo.email}</span> /{' '}
              <span className="font-medium text-foreground">{demo.password}</span>
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="rounded-pill bg-popover px-5 py-3 shadow-card lg:px-6 lg:py-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground lg:text-base"
                  required
                />
              </div>
              <div className="rounded-pill bg-popover px-5 py-3 shadow-card lg:px-6 lg:py-4">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground lg:text-base"
                  required
                  minLength={4}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-primary/30"
                />
                Remember me
              </label>
              <button
                type="submit"
                className="w-full rounded-pill bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-neumorphic transition-all active:scale-95 lg:py-4 lg:text-base"
              >
                {isRegister ? 'Register' : 'Login'}
              </button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </form>

            <button onClick={() => setIsRegister(!isRegister)} className="mt-5 text-sm text-accent underline">
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
            <div className="mt-3">
              <Link to="/login" className="text-xs text-muted-foreground underline">
                View all dashboard logins
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
