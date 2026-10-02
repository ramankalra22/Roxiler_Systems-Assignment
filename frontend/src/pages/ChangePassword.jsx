import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/endpoints';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

export function ChangePassword() {
  const [msg, setMsg] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await authApi.updatePassword(data);
      setMsg({ type: 'success', text: 'Password updated' });
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-9 lg:px-10">
      <div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">StoreRater / Account security</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">Change password</h1><p className="mt-2 text-sm text-slate-500">Keep your account credentials up to date.</p></div>
      <section className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {msg && <div role="status" className={`mb-5 rounded-lg px-4 py-3 text-sm font-semibold ${msg.type === 'error' ? 'border border-rose-200 bg-rose-50 text-rose-700' : 'border border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{msg.text}</div>}
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Current password</label>
          <input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" type="password" autoComplete="current-password" {...register('currentPassword', { required: 'Required' })} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">New password</label>
          <input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" type="password" autoComplete="new-password" {...register('newPassword', { required: 'Required', pattern: {value: PASSWORD_REGEX, message: '8-16 chars, 1 uppercase, 1 special'} })} />
          {errors.newPassword && <span className="mt-1 block text-xs font-medium text-rose-700">{errors.newPassword.message}</span>}
        </div>
        <button type="submit" className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">Update password</button>
      </form>
      </section>
    </div>
  );
}
