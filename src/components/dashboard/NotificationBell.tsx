"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, AlertTriangle } from "lucide-react";

interface NotificaItem {
  id: string;
  tipo: "URGENZA" | "ASSEGNATO" | "INFO";
  titolo: string;
  descrizione: string;
  timestamp: string;
  isUnread: boolean;
}

interface Props {
  placement?: "sidebar" | "topbar";
}

const READ_IDS_KEY = "taskly_notifiche_read_ids";

const INITIAL_NOTIFICHE: NotificaItem[] = [
  {
    id: "tsk1",
    tipo: "URGENZA",
    titolo: "🚨 Chiamata SOS Pronto Intervento",
    descrizione: "Perdita idraulica urgente in Via Roma 42",
    timestamp: "2026-09-21T16:00:00.000Z",
    isUnread: true,
  },
  {
    id: "tsk2",
    tipo: "INFO",
    titolo: "Rapportino Archiviato",
    descrizione: "Intervento caldaia completato con firma cliente",
    timestamp: "2026-09-21T14:00:00.000Z",
    isUnread: false,
  },
];

function getLocalReadIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReadIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(READ_IDS_KEY, JSON.stringify(ids.slice(-200)));
  } catch {
    // ignore
  }
}

export default function NotificationBell({ placement = "sidebar" }: Props) {
  const [open, setOpen] = useState(false);
  const [notifiche, setNotifiche] = useState<NotificaItem[]>(() => {
    if (typeof window === "undefined") return INITIAL_NOTIFICHE;
    const readIds = new Set(getLocalReadIds());
    return INITIAL_NOTIFICHE.map((n) => ({
      ...n,
      isUnread: !readIds.has(n.id) && n.isUnread,
    }));
  });

  const unreadCount = notifiche.filter((n) => n.isUnread).length;
  const popoverRef = useRef<HTMLDivElement>(null);

  const markAllAsRead = () => {
    const allIds = notifiche.map((n) => n.id);
    saveLocalReadIds(allIds);
    setNotifiche((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const markOneAsRead = (id: string) => {
    const current = getLocalReadIds();
    if (!current.includes(id)) {
      saveLocalReadIds([...current, id]);
    }
    setNotifiche((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Notifiche"
      >
        <Bell className="w-5 h-5 text-slate-200 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 ${
            placement === "sidebar"
              ? "fixed inset-x-4 top-16 max-w-sm mx-auto sm:absolute sm:inset-auto sm:top-full sm:mt-2 sm:left-0 sm:right-auto sm:w-96"
              : "fixed inset-x-4 top-14 max-w-sm mx-auto sm:absolute sm:inset-auto sm:top-full sm:mt-2 sm:right-0 sm:left-auto sm:w-80"
          }`}
        >
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">Notifiche Taskly</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">
                  {unreadCount} nuove
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                Segna tutte lette
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifiche.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 font-medium">
                Nessun avviso presente
              </div>
            ) : (
              notifiche.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markOneAsRead(item.id)}
                  className={`p-3.5 text-xs transition-colors cursor-pointer flex items-start gap-3 ${
                    item.isUnread ? "bg-red-50/40 hover:bg-red-50/70" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-bold text-slate-900 truncate">{item.titolo}</p>
                      {item.isUnread && (
                        <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-slate-700 text-[11px] mt-0.5 leading-snug font-medium">
                      {item.descrizione}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              href="/dashboard/interventi"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Vedi tutte le chiamate →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
