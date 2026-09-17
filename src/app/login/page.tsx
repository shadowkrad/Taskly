'use client';

import React, { useState, useTransition, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wrench, Lock, Mail, ArrowLeft, Loader2, AlertCircle, Sparkles, Key } from 'lucide-react';
import { loginAction } from '@/app/actions/auth';

interface LoginPageProps {
  searchParams?: Promise<{ callbackUrl?: string }>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const router = useRouter();
  const params = searchParams ? use(searchParams) : {};
  const callbackUrl = params?.callbackUrl || '/admin';

  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await loginAction(email, password);
      if (res.success) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError(res.message || 'Credenziali non valide.');
      }
    });
  };

  const fillDemoCredentials = () => {
    setEmail('admin@taskly.it');
    setPassword('Admin123!');
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="card-taaaac bg-white p-6 sm:p-8 w-full max-w-md shadow-md border-slate-200">
        {/* Header Login */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Taskly Pro</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Accesso Area Riservata Artigiani & Tecnici
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-5 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-900">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Credenziali Demo Predefinite:
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
            >
              Compila rapido
            </button>
          </div>
          <div className="font-mono text-[11px] space-y-0.5 mt-1 text-indigo-800">
            <div>Email: <strong>admin@taskly.it</strong></div>
            <div>Password: <strong>Admin123!</strong></div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@taskly.it"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-taaaac w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Accesso in corso...
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                Accedi al Gestionale
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Torna alla vetrina pubblica
          </Link>
        </div>
      </div>
    </div>
  );
}
