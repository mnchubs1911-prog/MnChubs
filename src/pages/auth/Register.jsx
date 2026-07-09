import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { User, Mail, Lock, AlertCircle, ArrowRight, Phone, Chrome } from 'lucide-react';
import toast from 'react-hot-toast';
import { isFirebaseConfigured, signInWithGoogle, handleGoogleRedirect } from '../../config/firebase.js';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, googleLogin, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const validatePhone = () => {
    if (!phone.trim()) {
      setError('Please enter your mobile number');
      return false;
    }

    if (!/^\+?[0-9\s()-]{7,20}$/.test(phone.trim())) {
      setError('Please enter a valid mobile number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validatePhone()) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await register(name, email, password, phone.trim());
    if (result.success) {
      toast.success('Registration successful! Please check your email for verification.');
      navigate('/dashboard');
    } else {
      setError(result.message);
      toast.error(result.message);
    }
  };

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const idToken = await handleGoogleRedirect();
        if (idToken) {
          const savedPhone = sessionStorage.getItem('mnchub_reg_phone') || '';
          const result = await googleLogin(idToken, savedPhone);
          sessionStorage.removeItem('mnchub_reg_phone');
          if (result.success) {
            toast.success('Signed in with Google!');
            navigate('/dashboard');
          } else {
            setError(result.message);
            toast.error(result.message);
          }
        }
      } catch (err) {
        // Ignore redirect check failures
      }
    };
    checkRedirect();
  }, []);

  const handleGoogleSignIn = async () => {
    setError('');
    if (!validatePhone()) return;
    try {
      // Try popup first. If blocked, falls back to redirect automatically
      sessionStorage.setItem('mnchub_reg_phone', phone.trim());
      const idToken = await signInWithGoogle();
      if (idToken) {
        const result = await googleLogin(idToken, phone.trim());
        sessionStorage.removeItem('mnchub_reg_phone');
        if (result.success) {
          toast.success('Signed in with Google!');
          navigate('/dashboard');
        } else {
          setError(result.message);
          toast.error(result.message);
        }
      }
      // If idToken is null -> redirect was triggered, page will reload
    } catch (error) {
      const message = error.message || 'Google sign-in failed';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#0A0A1B] px-4">
      <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0F0F23] border border-white/10 rounded-2xl p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-sm text-gray-400 mt-2">Join MnCHub to start sharing and downloading resources</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
              <User className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

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
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
              <Phone className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Password
            </label>
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
            {isLoading ? 'Creating Account...' : 'Sign Up'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-gray-500">
          <span className="h-px flex-1 bg-white/10"></span>
          <span>or</span>
          <span className="h-px flex-1 bg-white/10"></span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || !isFirebaseConfigured}
          className="w-full py-3 bg-white text-gray-950 hover:bg-gray-100 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          title={!isFirebaseConfigured ? 'Add Firebase web env values to enable Google sign-in' : 'Continue with Google'}
        >
          <Chrome className="h-4 w-4" />
          Continue with Google
        </button>

        <div className="text-center mt-8 pt-6 border-t border-white/5 text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
