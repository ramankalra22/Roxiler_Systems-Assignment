import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

export function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await authApi.signup(data);
      login(res.data.access_token, res.data.user);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-screen-2xl items-center justify-center px-5 py-10 lg:px-10">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <div className="h-1.5 bg-teal-700" />
        <div className="p-7 sm:p-9">
          <div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">StoreRater / New account</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">Create your account</h1><p className="mt-2 text-sm text-slate-500">Join the marketplace and start rating stores.</p></div>
        <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" autoComplete="name" {...register('name', { required: 'Name is required', maxLength: {value: 60, message: 'Max 60 chars'} })} />
            {errors.name && <span className="mt-1 block text-xs font-medium text-rose-700">{errors.name.message}</span>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" type="email" autoComplete="email" {...register('email', { required: 'Email required', pattern: {value: /^\S+@\S+\.\S+$/, message: 'Invalid email'} })} />
            {errors.email && <span className="mt-1 block text-xs font-medium text-rose-700">{errors.email.message}</span>}
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" autoComplete="street-address" {...register('address', { required: 'Address required', maxLength: {value: 400, message: 'Max 400 chars'} })} />
            {errors.address && <span className="mt-1 block text-xs font-medium text-rose-700">{errors.address.message}</span>}
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" type="password" autoComplete="new-password" {...register('password', { required: 'Password required', pattern: {value: PASSWORD_REGEX, message: '8-16 chars, 1 uppercase, 1 special'} })} />
            {errors.password && <span className="mt-1 block text-xs font-medium text-rose-700">{errors.password.message}</span>}
          </div>
          {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 sm:col-span-2">{error}</div>}
          <button type="submit" className="rounded-lg bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 sm:col-span-2">Create account</button>
        </form>
        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
          Already have an account? <Link className="font-bold text-teal-700 hover:text-teal-900" to="/login">Sign in</Link>
        </div>
        </div>
      </div>
    </div>
  );
}
