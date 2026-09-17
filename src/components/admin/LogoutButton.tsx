'use client';

import React, { useTransition } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="btn-taaaac px-3 py-2 border border-slate-200 text-slate-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
      title="Disconnetti sessione"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>Esci</span>
    </button>
  );
}
