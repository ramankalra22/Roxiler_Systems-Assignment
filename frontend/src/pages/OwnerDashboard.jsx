import React, { useEffect, useState } from 'react';
import { storesApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

export function OwnerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    storesApi.ownerDashboard().then(r => setData(r.data));
  }, []);

  const store = data.length > 0 ? { name: data[0].store_name, avg: data[0].average_rating, cnt: data[0].rating_count } : null;
  const raters = data.filter(r => r.user_id !== null && r.rating !== null);

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-9 lg:px-10">
      <div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">StoreRater / Owner portal</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">Your store overview</h1><p className="mt-2 text-sm text-slate-500">Welcome, {user?.name}. Monitor customer feedback and ratings.</p></div>
      {store ? (
        <>
          <section className="mb-8 grid gap-6 overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-lg shadow-slate-300/60 sm:grid-cols-[1fr_auto] sm:items-center sm:p-9">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-300">Store performance</p><h2 className="mt-3 text-2xl font-bold tracking-tight">{store.name}</h2><p className="mt-2 text-sm text-slate-300">Based on {store.cnt} customer ratings</p></div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-7 py-5 sm:min-w-52 sm:text-right"><p className="text-xs font-bold uppercase tracking-wider text-slate-300">Average rating</p><p className="mt-1 text-5xl font-bold tabular-nums text-amber-300">{Number(store.avg).toFixed(1)}<span className="ml-1 text-3xl">★</span></p><p className="mt-1 text-xs text-slate-400">out of 5.0</p></div>
          </section>
          <div className="mb-4 flex items-end justify-between gap-3"><div><h3 className="text-xl font-bold text-slate-900">Customer reviews</h3><p className="mt-1 text-sm text-slate-500">People who have rated your store.</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">{raters.length} reviews</span></div>
          <div className="space-y-3">
            {raters.map(r => (
              <article key={r.user_id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 font-bold text-slate-600">{r.rater_name?.slice(0, 1).toUpperCase()}</div><div className="min-w-0"><p className="truncate font-bold text-slate-900">{r.rater_name}</p><p className="truncate text-sm text-slate-500">{r.rater_email}</p></div></div>
                <div className="flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-2"><span className="text-xs font-bold uppercase tracking-wider text-amber-900">Rating</span><span className="text-lg font-bold tabular-nums text-amber-700">{r.rating}<span className="ml-1">★</span></span></div>
              </article>
            ))}
            {raters.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No ratings have been submitted yet.</div>}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No store assigned to your account.</div>
      )}
    </div>
  );
}
