import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storesApi } from '../api/endpoints';

export function StoreList() {
  const [stores, setStores] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [addrFilter, setAddrFilter] = useState('');

  const fetchStores = async () => {
    const res = await storesApi.list({ name: nameFilter, address: addrFilter });
    setStores(res.data);
  };
  
  useEffect(() => { fetchStores(); }, []);

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-9 lg:px-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">StoreRater / Marketplace</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">Find a store</h1><p className="mt-2 text-sm text-slate-500">Browse locations and compare community ratings.</p></div>
        <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">{stores.length} locations</span>
      </div>
      <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:p-5">
        <input className="min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100" aria-label="Search by name" value={nameFilter} onChange={e=>setNameFilter(e.target.value)} placeholder="Search by name" />
        <input className="min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100" aria-label="Search by address" value={addrFilter} onChange={e=>setAddrFilter(e.target.value)} placeholder="Search by address" />
        <button onClick={fetchStores} className="rounded-lg bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">Search stores</button>
      </div>
      {stores.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stores.map(s => {
            const average = Number(s.average_rating) || 0;
            return (
              <article key={s.id} className="flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-200/60">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-sm font-black text-teal-800">{s.name?.slice(0, 1).toUpperCase()}</div>
                  <div className="text-right"><div className="text-lg font-bold tabular-nums text-slate-900">{average.toFixed(1)}</div><div className="text-xs text-slate-500">community rating</div></div>
                </div>
                <h2 className="text-lg font-bold leading-snug text-slate-900">{s.name}</h2>
                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">{s.address}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <div className="flex gap-0.5 text-lg leading-none" aria-label={`Community rating ${average.toFixed(1)} out of 5`}>
                      {[1, 2, 3, 4, 5].map(star => <span key={star} className={star <= Math.round(average) ? 'text-amber-500' : 'text-slate-200'}>★</span>)}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{s.user_rating ? `Your rating: ${s.user_rating}/5` : 'Your rating: not rated'}</p>
                  </div>
                  <Link to={`/stores/${s.id}`} className="rounded-lg border border-teal-700 px-4 py-2.5 text-sm font-bold text-teal-800 transition hover:bg-teal-700 hover:text-white">View / rate</Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><p className="text-lg font-bold text-slate-800">No stores to show</p><p className="mt-2 text-sm text-slate-500">Try changing your search terms.</p></div>
      )}
    </div>
  );
}
