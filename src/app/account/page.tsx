'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, login, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/account/profile');
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          router.push('/account/profile');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        const result = await register(username, email, password);
        if (result.success) {
          router.push('/account/profile');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-center mb-8">
        {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={!isLogin}
              className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors cursor-text"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            EMAIL
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors cursor-text"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            PASSWORD
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-neutral-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:border-black transition-colors cursor-text"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-neutral-500 hover:text-black transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 text-sm tracking-wider hover:bg-neutral-800 transition-colors disabled:bg-neutral-400 cursor-pointer"
        >
          {loading ? 'PLEASE WAIT...' : isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm hover:underline cursor-pointer"
        >
          {isLogin ? "Don't have an account? Create one" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
