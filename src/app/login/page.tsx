'use client';

import React, { useState, useEffect, useRef, use } from 'react';
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
  KeyRound,
  Fingerprint,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';

interface LoginPageProps {
  searchParams?: Promise<{ callbackUrl?: string }>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const router = useRouter();
  const params = searchParams ? use(searchParams) : {};
  const callbackUrl = params?.callbackUrl || '/admin';

  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // 🛡️ Sicurezza v1.0.6: MFA / 2FA & Anti Brute-Force
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isBackupCodeMode, setIsBackupCodeMode] = useState(false);
  const [botField, setBotField] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);

  const mfaInputRef = useRef<HTMLInputElement>(null);

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

  // Timer per il conto alla rovescia del blocco temporaneo (15 min)
  useEffect(() => {
    if (lockoutRemaining === null || lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Focus automatico sul campo MFA al passaggio allo Step 2
  useEffect(() => {
    if (isMfaStep && mfaInputRef.current) {
      mfaInputRef.current.focus();
    }
  }, [isMfaStep, isBackupCodeMode]);

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo: true }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Errore durante l'accesso demo");
      }

      router.push(callbackUrl);
      router.refresh();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── STEP 1: VERIFICA PASSWORD & CHECK MFA ──
    if (!isMfaStep) {
      if (!password.trim()) {
        setError('Inserisci la password di accesso.');
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const checkRes = await fetch('/api/admin/auth/check-mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, botField }),
        });

        const checkData = await checkRes.json();

        if (!checkRes.ok) {
          if (checkRes.status === 429) {
            setLockoutRemaining(checkData.retryAfter || 900);
            setError(checkData.error || 'Troppi tentativi falliti. Accesso sospeso.');
          } else {
            setError(checkData.error || 'Password non corretta.');
          }
          setLoading(false);
          return;
        }

        // Se MFA è richiesta, passa allo Step 2
        if (checkData.mfaRequired) {
          setIsMfaStep(true);
          setLoading(false);
          return;
        }

        // MFA non attiva: esegui login diretto
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, botField }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Password non corretta');
        }

        router.push(callbackUrl);
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'Password errata');
        setLoading(false);
      }
      return;
    }

    // ── STEP 2: VERIFICA CODICE MFA ──
    if (!mfaCode.trim()) {
      setError(isBackupCodeMode ? 'Inserisci il codice di emergenza (es. ABCD-1234).' : 'Inserisci il codice a 6 cifre.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          mfaCode,
          botField,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setLockoutRemaining(data.retryAfter || 900);
          setError(data.error || 'Troppi tentativi falliti. Accesso temporaneamente bloccato.');
        } else {
          setError(data.error || 'Codice di sicurezza non valido.');
        }
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Errore durante la verifica del codice.');
      setLoading(false);
    }
  };

  const formatLockoutTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="card-taaaac bg-white p-6 sm:p-8 w-full max-w-md shadow-md border-slate-200">
        {/* Campo Honey-Pot invisibile anti-bot */}
        <input
          type="text"
          value={botField}
          onChange={(e) => setBotField(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        {/* Header Login */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            {isMfaStep ? <ShieldCheck className="w-6 h-6 text-emerald-300" /> : <Wrench className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {isMfaStep ? 'Verifica di Sicurezza 2FA' : 'Taskly Pro'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center justify-center gap-1">
            {isMfaStep ? (
              <span className="text-indigo-600 font-semibold">Passaggio 2 di 2 • Conferma identità</span>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Area Riservata Artigiani & Tecnici</span>
              </>
            )}
          </p>
        </div>

        {/* Banner Blocco Anti-Brute-Force */}
        {lockoutRemaining !== null && lockoutRemaining > 0 && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-700 text-left flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800">Accesso temporaneamente sospeso</p>
              <p className="text-[11px] text-red-600 mt-0.5">
                Troppi tentativi errati. Riprova tra{' '}
                <span className="font-mono font-bold text-red-800">{formatLockoutTimer(lockoutRemaining)}</span>.
              </p>
            </div>
          </div>
        )}

        {/* 1-Click Demo Box (Solo su ambienti demo Vercel) */}
        {isDemo && !isMfaStep && (
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
              disabled={loading || demoLoading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {demoLoading ? 'Accesso in corso...' : '👉 Accedi alla Demo (1-Click)'}
            </button>
          </div>
        )}

        {/* Accesso Rapido Biometrico Passkey */}
        {!isMfaStep && (
          <div className="mb-6 space-y-2">
            <button
              type="button"
              onClick={handleDeviceLogin}
              disabled={biometricLoading || loading || demoLoading || Boolean(lockoutRemaining && lockoutRemaining > 0)}
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
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── STEP 1: FORM MASTER PASSWORD ── */}
        {!isMfaStep ? (
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
              disabled={loading || demoLoading || biometricLoading || Boolean(lockoutRemaining && lockoutRemaining > 0)}
              className="btn-taaaac w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifica in corso...
                </>
              ) : (
                <>
                  <span>Accedi al Gestionale</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* ── STEP 2: FORM MFA / CODICE DI EMERGENZA ── */
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 leading-relaxed">
              {isBackupCodeMode
                ? 'Inserisci uno dei codici di emergenza generati durante la configurazione della sicurezza.'
                : 'Inserisci il codice a 6 cifre generato dalla tua app di autenticazione (Google Authenticator, Microsoft Authenticator o simili).'}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                {isBackupCodeMode ? 'Codice di Recupero di Emergenza' : 'Codice Authenticator (6 Cifre)'}
              </label>
              <input
                ref={mfaInputRef}
                type="text"
                required
                maxLength={isBackupCodeMode ? 12 : 6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.toUpperCase())}
                placeholder={isBackupCodeMode ? 'ABCD-1234' : '123456'}
                className="w-full px-3.5 py-3 rounded-xl border border-indigo-500/50 text-lg font-mono text-center tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
            >
              {loading ? 'Convalida in corso...' : 'Conferma ed Entra'}
              <ShieldCheck className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setIsBackupCodeMode(!isBackupCodeMode);
                  setMfaCode('');
                  setError(null);
                }}
                className="text-indigo-600 hover:text-indigo-700 font-semibold underline cursor-pointer"
              >
                {isBackupCodeMode ? 'Usa app Authenticator' : 'Usa codice di emergenza'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMfaStep(false);
                  setMfaCode('');
                  setError(null);
                }}
                className="text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
              >
                ← Torna indietro
              </button>
            </div>
          </form>
        )}

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
