import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storesApi, ratingsApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

export function StoreDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [msg, setMsg] = useState(null);

  const fetchStore = async () => {
    const res = await storesApi.getOne(id);
    setStore(res.data);
    setRating(res.data.user_rating || 0);
  };
  
  useEffect(() => { fetchStore(); }, [id]);

  const submitRating = async () => {
    try {
      await ratingsApi.upsert(id, rating);
      setMsg('Rating submitted!');
      fetchStore();
    } catch (e) {
      setMsg('Error submitting rating');
    }
  };

  if (!store) return <div className="mx-auto max-w-screen-2xl px-5 py-16 text-center text-sm font-medium text-slate-500">Loading store...</div>;

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-9 lg:px-10">
      <div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">StoreRater / Store details</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">{store.name}</h1><p className="mt-2 text-sm text-slate-500">{store.address}</p></div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Store information</p>
          <p className="mt-4 text-sm text-slate-700"><span className="font-semibold text-slate-900">Address:</span> {store.address}</p>
          <p className="mt-2 text-sm text-slate-700"><span className="font-semibold text-slate-900">Email:</span> {store.email}</p>
          <div className="mt-7 border-t border-slate-100 pt-6"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Community rating</p><div className="mt-2 flex items-end gap-3"><span className="text-4xl font-bold tabular-nums text-slate-900">{Number(store.average_rating).toFixed(1)}</span><div><div className="flex text-xl text-amber-500" aria-label={`Overall rating ${Number(store.average_rating).toFixed(1)} out of 5`}>{[1,2,3,4,5].map(n => <span key={n} className={n <= Math.round(Number(store.average_rating)) ? 'text-amber-500' : 'text-slate-200'}>★</span>)}</div><p className="text-xs text-slate-500">{store.rating_count} reviews</p></div></div></div>
        </section>
      {user.role === 'user' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Your review</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Rate this store</h2>
          <p className="mt-1 text-sm text-slate-500">Choose a score from one to five stars.</p>
          <div className="mt-5 flex gap-1" role="group" aria-label="Choose your rating">
            {[1,2,3,4,5].map(n => <button key={n} type="button" aria-label={`${n} star${n === 1 ? '' : 's'}`} aria-pressed={rating === n} onClick={() => setRating(n)} className={`text-4xl transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-400 ${n <= rating ? 'text-amber-500' : 'text-slate-200'}`}>★</button>)}
          </div>
          <button onClick={submitRating} disabled={!rating} className="mt-5 w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:bg-slate-300">{store.user_rating ? 'Update rating' : 'Submit rating'}</button>
          {msg && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{msg}</p>}
        </section>
      )}
      </div>
    </div>
  );
}
