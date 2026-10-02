'use client';

import React, { useState, useTransition, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wrench, Lock, Mail, ArrowLeft, Loader2, AlertCircle, Sparkles, Key, Fingerprint, Smartphone } from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';
import { loginAction } from '@/app/actions/auth';

interface LoginPageProps {
  searchParams?: Promise<{ callbackUrl?: string }>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const router = useRouter();
  const params = searchParams ? use(searchParams) : {};
  const callbackUrl = params?.callbackUrl || '/admin';

  const [isPending, startTransition] = useTransition();
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDeviceLogin = async () => {
    setError(null);
    setBiometricLoading(true);
    try {
      const optRes = await fetch('/api/auth/device/login-options', {
        method: 'POST',
      });

      if (!optRes.ok) {
        const err = await optRes.json();
        throw new Error(err.error || 'Nessun dispositivo autorizzato.');
      }

      const options = await optRes.json();
      const asseResp = await startAuthentication({ optionsJSON: options });

      const verifyRes = await fetch('/api/auth/device/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: asseResp,
          expectedChallenge: options.challenge,
        }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        throw new Error(err.error || 'Verifica biometrica fallita');
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      console.warn('[handleDeviceLogin] errore:', err);
      setError(err.message || 'Accesso con dispositivo non riuscito.');
    } finally {
      setBiometricLoading(false);
    }
  };

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
        {process.env.NEXT_PUBLIC_IS_DEMO !== 'false' && (
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
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Accesso Rapido Biometrico PWA v1.0.2 */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleDeviceLogin}
            disabled={biometricLoading || isPending}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60 border border-slate-800 active:scale-98"
          >
            {biometricLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Verifica biometrica in corso...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span>Accedi con FaceID / Impronta / PIN</span>
              </>
            )}
          </button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white px-2 text-slate-400 font-semibold">oppure con credenziali</span>
            </div>
          </div>
        </div>

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
