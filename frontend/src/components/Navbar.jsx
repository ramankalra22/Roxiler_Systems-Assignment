import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[4.5rem] max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-5 py-3 lg:px-10">
      <Link to="/" className="flex items-center gap-3 text-lg font-bold tracking-tight text-slate-900">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-700 text-sm font-black text-white">S</span>
        <span>Store<span className="text-teal-700">Rater</span></span>
      </Link>
      <div className="flex flex-wrap items-center justify-end gap-3 text-sm font-medium text-slate-600">
        {isAuthenticated ? (
          <>
            <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-slate-700 sm:inline">{user.name} <span className="text-slate-400">/</span> {user.role}</span>
            {user.role !== 'admin' && user.role !== 'owner' && <Link className="rounded-lg px-3 py-2 hover:bg-teal-50 hover:text-teal-800" to="/stores">Browse stores</Link>}
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900" to="/change-password">Change password</Link>
            <button onClick={() => { logout(); navigate('/login'); }} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">Logout</button>
          </>
        ) : (
          <>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900" to="/login">Login</Link>
            <Link to="/signup" className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white transition hover:bg-teal-800">Sign up</Link>
          </>
        )}
      </div>
      </div>
    </nav>
  );
}
