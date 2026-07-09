import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { signInWithGoogle, handleGoogleRedirect, isFirebaseConfigured } from '../../config/firebase.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      toast.success('Logged in successfully!');
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.message);
      toast.error(result.message);
    }
  };

  // On page load, check if we are returning from a Google redirect
  useEffect(() => {
    const completeRedirect = async () => {
      try {
        setGoogleLoading(true);
        const idToken = await handleGoogleRedirect();
        if (idToken) {
          const result = await googleLogin(idToken);
          if (result.success) {
            toast.success('Signed in with Google!');
            navigate(redirectPath, { replace: true });
          } else {
            setError(result.message);
            toast.error(result.message);
          }
        }
      } catch (err) {
        // Ignore — no redirect was pending
      } finally {
        setGoogleLoading(false);
      }
    };
    completeRedirect();
  }, []);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      // Try popup (instant). If blocked, automatically falls back to redirect.
      const idToken = await signInWithGoogle();
      if (idToken) {
        // Popup succeeded — complete login immediately
        const result = await googleLogin(idToken);
        if (result.success) {
          toast.success('Signed in with Google!');
          navigate(redirectPath, { replace: true });
        } else {
          setError(result.message);
          toast.error(result.message);
        }
        setGoogleLoading(false);
      }
      // If idToken is null → redirect was triggered, page will reload
    } catch (err) {
      const msg = err.message || 'Google sign-in failed';
      setError(msg);
      toast.error(msg);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#0A0A1B] px-4">
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-violet-600/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0F0F23] border border-white/10 rounded-2xl p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-400 mt-2">Log in to your MnCHub account to access resources</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-In Button */}
        {isFirebaseConfigured ? (
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium text-white transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            )}
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>
        ) : (
          <div className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/3 border border-white/5 rounded-lg text-sm text-gray-500 mb-6 cursor-not-allowed select-none" title="Firebase not configured">
            <svg className="h-5 w-5 opacity-40" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Google Sign-In (not configured)
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">or sign in with email</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-violet-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-white/5 text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 hover:underline font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
