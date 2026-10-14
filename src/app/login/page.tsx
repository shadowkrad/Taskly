'use client';

import React, { useState, useEffect, useTransition, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wrench,
  Lock,
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  Key,
  Fingerprint,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';
import { loginAction, loginDemoAction } from '@/app/actions/auth';

interface LoginPageProps {
  searchParams?: Promise<{ callbackUrl?: string }>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const router = useRouter();
  const params = searchParams ? use(searchParams) : {};
  const callbackUrl = params?.callbackUrl || '/admin';

  const [isPending, startTransition] = useTransition();
  const [demoLoading, setDemoLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hn = window.location.hostname.toLowerCase();
      const isDemoDomain =
        hn.includes('vercel.app') ||
        hn.includes('cliente-demo') ||
        hn.includes('-demo') ||
        hn.startsWith('demo.');
      setIsDemo(isDemoDomain);
    }
  }, []);

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      const res = await loginDemoAction();
      if (res.success) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        throw new Error(res.message || "Errore durante l'accesso demo");
      }
    } catch (err: any) {
      setError(err.message || 'Errore accesso demo');
      setDemoLoading(false);
    }
  };

  const handleDeviceLogin = async () => {
    setError(null);
    setBiometricLoading(true);
    try {
      const optRes = await fetch('/api/auth/device/login-options', {
        method: 'POST',
      });

      if (!optRes.ok) {
        const err = await optRes.json();
        throw new Error(err.error || 'Nessun dispositivo autorizzato su questo browser. Accedi prima con password.');
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
      if (err.name === 'NotAllowedError') {
        setError('Sblocco biometrico annullato.');
      } else {
        setError(err.message || 'Dispositivo non registrato o non riconosciuto. Inserisci la password.');
      }
    } finally {
      setBiometricLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Inserisci la password di accesso.');
      return;
    }
    setError(null);

    startTransition(async () => {
      const res = await loginAction(email ? email : password, email ? password : '');
      if (res.success) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError(res.message || 'Credenziali non valide.');
      }
    });
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
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Area Riservata Artigiani & Tecnici</span>
          </p>
        </div>

        {/* 1-Click Demo Box (Solo su ambienti demo Vercel) */}
        {isDemo && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-950">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Modalità Demo Attiva</span>
            </div>
            <p className="text-[11px] text-indigo-700">
              Esplora la gestione interventi, preventivi e cantieri con un singolo click, senza credenziali.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isPending || demoLoading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {demoLoading ? 'Accesso in corso...' : '👉 Accedi alla Demo (1-Click)'}
            </button>
          </div>
        )}

        {/* Accesso Rapido Biometrico Passkey */}
        <div className="mb-6 space-y-2">
          <button
            type="button"
            onClick={handleDeviceLogin}
            disabled={biometricLoading || isPending || demoLoading}
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
                <span>Sblocco con FaceID / Impronta / PIN</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-400 text-center font-medium">
            Dispositivo registrato • Face ID • Touch ID • PIN
          </p>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
              <span className="bg-white px-2 text-slate-400 font-bold">oppure con password</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Login Master Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email (Opzionale)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tuodominio.it (se configurata)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Password Gestionale
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci password master"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || demoLoading || biometricLoading}
            className="btn-taaaac w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-98"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Accesso in corso...
              </>
            ) : (
              <>
                <span>Accedi al Gestionale</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-3">
          <p className="text-[11px] text-slate-400">
            Per abilitare lo sblocco rapido con FaceID o PIN su questo telefono, effettua l'accesso e registra il dispositivo in <strong className="text-slate-600">Impostazioni &gt; Dispositivi PWA</strong>.
          </p>
          <div>
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
    </div>
  );
}
