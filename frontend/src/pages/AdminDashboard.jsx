import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usersApi, storesApi } from '../api/endpoints';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

export function AdminDashboard() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const { register: regUser, handleSubmit: handleUser, reset: resetUser, formState: {errors: errUser} } = useForm();
  const { register: regStore, handleSubmit: handleStore, reset: resetStore } = useForm();

  useEffect(() => {
    if (tab === 'dashboard') usersApi.getStats().then(r => setStats(r.data));
    if (tab === 'users') usersApi.list().then(r => setUsers(r.data));
    if (tab === 'stores') storesApi.list().then(r => setStores(r.data));
  }, [tab]);

  const onAddUser = async (data) => {
    await usersApi.create(data);
    resetUser();
    alert('User added');
  };

  const onAddStore = async (data) => {
    await storesApi.create(data);
    resetStore();
    alert('Store added');
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-9 lg:px-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">StoreRater / Control center</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Administrator dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Manage platform accounts, stores, and activity.</p>
        </div>
        <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">System operational</span>
      </div>
      <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {['dashboard', 'users', 'stores', 'add-user', 'add-store'].map(t => (
          <button key={t} className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${tab===t?'bg-teal-700 text-white shadow-sm':'text-slate-600 hover:bg-white hover:text-slate-900'}`} onClick={()=>setTab(t)}>{t.replace('-', ' ')}</button>
        ))}
      </div>
      
      {tab === 'dashboard' && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: 'Registered users', value: stats.totalUsers, tone: 'bg-teal-50 text-teal-800 border-teal-100', mark: 'USERS' },
            { label: 'Active stores', value: stats.totalStores, tone: 'bg-sky-50 text-sky-800 border-sky-100', mark: 'STORES' },
            { label: 'Submitted ratings', value: stats.totalRatings, tone: 'bg-amber-50 text-amber-800 border-amber-100', mark: 'RATINGS' },
          ].map(metric => (
            <section key={metric.mark} className={`rounded-2xl border p-6 shadow-sm ${metric.tone}`}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-75">{metric.label}</p>
              <p className="mt-5 text-4xl font-bold tracking-tight">{metric.value ?? '—'}</p>
              <p className="mt-2 text-xs font-semibold opacity-60">PLATFORM TOTAL</p>
            </section>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4"><h2 className="text-lg font-bold text-slate-900">User directory</h2><p className="mt-1 text-sm text-slate-500">Platform accounts and assigned roles.</p></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3 font-bold">Name</th><th className="px-5 py-3 font-bold">Email</th><th className="px-5 py-3 font-bold">Role</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => <tr key={u.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-semibold text-slate-800">{u.name}</td><td className="px-5 py-4 text-slate-600">{u.email}</td><td className="px-5 py-4"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold capitalize text-teal-800">{u.role}</span></td></tr>)}
                {users.length === 0 && <tr><td className="px-5 py-8 text-center text-slate-500" colSpan="3">No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'stores' && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4"><h2 className="text-lg font-bold text-slate-900">Store directory</h2><p className="mt-1 text-sm text-slate-500">Registered locations and their average score.</p></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3 font-bold">Name</th><th className="px-5 py-3 font-bold">Address</th><th className="px-5 py-3 font-bold">Rating</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {stores.map(s => <tr key={s.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-semibold text-slate-800">{s.name}</td><td className="px-5 py-4 text-slate-600">{s.address}</td><td className="px-5 py-4 font-bold text-amber-600">★ {Number(s.average_rating).toFixed(1)}</td></tr>)}
                {stores.length === 0 && <tr><td className="px-5 py-8 text-center text-slate-500" colSpan="3">No stores found.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'add-user' && (
        <section className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6"><h2 className="text-lg font-bold text-slate-900">Create a platform user</h2><p className="mt-1 text-sm text-slate-500">Set account details and access role.</p></div>
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleUser(onAddUser)}>
            <div><label className="mb-2 block text-sm font-semibold text-slate-700">Name</label><input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" {...regUser('name', {required:true, maxLength:60})} />{errUser.name && <span className="mt-1 block text-xs text-rose-700">Name is required (max 60 chars)</span>}</div>
            <div><label className="mb-2 block text-sm font-semibold text-slate-700">Email</label><input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" type="email" {...regUser('email', {required:true})} /></div>
            <div><label className="mb-2 block text-sm font-semibold text-slate-700">Password</label><input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" type="password" {...regUser('password', {required:true, pattern: PASSWORD_REGEX})} />{errUser.password && <span className="mt-1 block text-xs text-rose-700">8-16 chars, 1 uppercase, 1 special</span>}</div>
            <div><label className="mb-2 block text-sm font-semibold text-slate-700">Role</label><select className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" {...regUser('role', {required:true})}><option value="user">User</option><option value="admin">Admin</option><option value="owner">Owner</option></select></div>
            <div className="sm:col-span-2"><label className="mb-2 block text-sm font-semibold text-slate-700">Address</label><input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" {...regUser('address', {required:true})} /></div>
            <div className="sm:col-span-2"><button type="submit" className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">Add user</button></div>
          </form>
        </section>
      )}

      {tab === 'add-store' && (
        <section className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6"><h2 className="text-lg font-bold text-slate-900">Register a store</h2><p className="mt-1 text-sm text-slate-500">Add a new location to the marketplace.</p></div>
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleStore(onAddStore)}>
            <div><label className="mb-2 block text-sm font-semibold text-slate-700">Name</label><input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" {...regStore('name', {required:true})} /></div>
            <div><label className="mb-2 block text-sm font-semibold text-slate-700">Email</label><input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" type="email" {...regStore('email', {required:true})} /></div>
            <div className="sm:col-span-2"><label className="mb-2 block text-sm font-semibold text-slate-700">Address</label><input className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" {...regStore('address', {required:true})} /></div>
            <div className="sm:col-span-2"><button type="submit" className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">Add store</button></div>
          </form>
        </section>
      )}
    </div>
  );
}
