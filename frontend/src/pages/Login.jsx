import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data);
      login(res.data.access_token, res.data.user);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-screen-2xl items-center justify-center px-5 py-12 lg:px-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <div className="h-1.5 bg-teal-700" />
        <div className="p-7 sm:p-9">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">StoreRater / Secure access</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to continue to your StoreRater workspace.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100" type="email" autoComplete="email" {...register('email', { required: 'Email required' })} />
            {errors.email && <span className="mt-1 block text-xs font-medium text-rose-700">{errors.email.message}</span>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100" type="password" autoComplete="current-password" {...register('password', { required: 'Password required' })} />
            {errors.password && <span className="mt-1 block text-xs font-medium text-rose-700">{errors.password.message}</span>}
          </div>
          {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}
          <button type="submit" className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">Sign in</button>
        </form>
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">One sign-in, role-based access</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Admin', 'Normal user', 'Store owner'].map(role => <span key={role} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">{role}</span>)}
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">Access is assigned to your account; this panel does not change your role.</p>
        </div>
        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
          Need an account? <Link className="font-bold text-teal-700 hover:text-teal-900" to="/signup">Create one</Link>
        </div>
        </div>
      </div>
    </div>
  );
}
