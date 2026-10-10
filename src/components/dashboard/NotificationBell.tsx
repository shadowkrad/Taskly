"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  ClipboardList,
  Check,
  X,
  RotateCw,
  Clock,
} from "lucide-react";

interface NotificaItem {
  id: string;
  tipo: "URGENZA" | "ASSEGNATO" | "INFO";
  titolo: string;
  descrizione: string;
  timestamp: string;
  link?: string;
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
    titolo: "Chiamata SOS Pronto Intervento",
    descrizione: "Perdita idraulica urgente in Via Roma 42",
    timestamp: "2026-10-09T22:30:00.000Z",
    link: "/dashboard/interventi",
    isUnread: true,
  },
  {
    id: "tsk2",
    tipo: "ASSEGNATO",
    titolo: "Nuovo Intervento Assegnato",
    descrizione: "Manutenzione caldaia programmata per domani ore 10:00",
    timestamp: "2026-10-09T20:00:00.000Z",
    link: "/dashboard/interventi",
    isUnread: true,
  },
  {
    id: "tsk3",
    tipo: "INFO",
    titolo: "Rapportino Archiviato",
    descrizione: "Intervento completato con firma e fattura inviata",
    timestamp: "2026-10-09T14:00:00.000Z",
    link: "/dashboard/rapportini",
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

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return "meno di un minuto fa";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min fa`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `circa ${diffHours} ${diffHours === 1 ? "ora" : "ore"} fa`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "ieri";
    if (diffDays < 7) return `${diffDays} giorni fa`;
    return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export default function NotificationBell({ placement = "sidebar" }: Props) {
  const [open, setOpen] = useState(false);
  const [notifiche, setNotifiche] = useState<NotificaItem[]>(INITIAL_NOTIFICHE);
  const [filter, setFilter] = useState<"ALL" | "URGENZA" | "ASSEGNATO">("ALL");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const readIds = new Set(getLocalReadIds());
      setNotifiche((prev) =>
        prev.map((n) => ({
          ...n,
          isUnread: !readIds.has(n.id) && n.isUnread,
        }))
      );
    } catch {
      // ignore
    }
  }, []);

  const unreadCount = notifiche.filter((n) => n.isUnread).length;

  const markAllAsRead = useCallback(() => {
    const allIds = notifiche.map((n) => n.id);
    const existing = getLocalReadIds();
    const merged = Array.from(new Set([...existing, ...allIds]));
    saveLocalReadIds(merged);
    setNotifiche((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  }, [notifiche]);

  const markOneAsRead = useCallback((id: string) => {
    const current = getLocalReadIds();
    if (!current.includes(id)) {
      saveLocalReadIds([...current, id]);
    }
    setNotifiche((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  }, []);

  // Chiudi cliccando fuori
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filtered = notifiche.filter((n) => {
    if (filter === "ALL") return true;
    return n.tipo === filter;
  });

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Icona Campanella */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
        aria-label="Notifiche Taskly"
        title={unreadCount > 0 ? `${unreadCount} nuove notifiche` : "Nessuna nuova notifica"}
      >
        <Bell className="w-5 h-5 text-slate-200 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[9px] font-black text-white items-center justify-center shadow-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Popover Dropdown con posizionamento allineato a Schedly e Tavoly */}
      {open && (
        <>
          {/* Backdrop mobile per chiudere facilmente al tap fuori */}
          <div
            className="fixed inset-0 bg-slate-950/40 z-40 md:hidden backdrop-blur-2xs"
            onClick={() => setOpen(false)}
          />

          <div
            className={
              placement === "sidebar"
                ? "fixed inset-x-3 top-16 max-w-sm mx-auto md:max-w-none md:mx-0 md:fixed md:left-[268px] md:top-4 md:w-96 md:inset-x-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200"
                : "fixed inset-x-3 top-14 max-w-sm mx-auto sm:max-w-none sm:mx-0 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:inset-x-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            }
          >
            {/* Header Popover */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔔</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                    Notifiche & Attività
                  </h3>
                  <p className="text-[10px] text-indigo-600 font-semibold">
                    {unreadCount > 0 ? `${unreadCount} da verificare` : "Tutto aggiornato"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
                  >
                    Segna lette ✓
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filtri Notifiche */}
            <div className="px-3 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold">
              {[
                { key: "ALL", label: "Tutte" },
                { key: "URGENZA", label: "🚨 Urgenze" },
                { key: "ASSEGNATO", label: "📋 Interventi" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key as any)}
                  className={`px-3 py-1 rounded-xl transition-all shrink-0 cursor-pointer ${
                    filter === t.key
                      ? "bg-indigo-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Lista Notifiche */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-1">
                  <span className="text-3xl block">✨</span>
                  <p className="text-xs font-semibold text-slate-700">Nessuna notifica in questa sezione</p>
                  <p className="text-[10px] text-slate-400">Tutti i ticket e gli interventi sono in ordine!</p>
                </div>
              ) : (
                filtered.map((item) => {
                  const isUrgent = item.tipo === "URGENZA";
                  return (
                    <Link
                      key={item.id}
                      href={item.link || "/dashboard/interventi"}
                      onClick={() => {
                        markOneAsRead(item.id);
                        setOpen(false);
                      }}
                      className={`block p-3.5 transition-colors hover:bg-indigo-50/50 ${
                        item.isUnread ? "bg-indigo-50/30" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm mt-0.5 border shadow-2xs ${
                            isUrgent
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "bg-indigo-50 border-indigo-200 text-indigo-700"
                          }`}
                        >
                          {isUrgent ? (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          ) : (
                            <ClipboardList className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-bold text-slate-900 text-xs truncate">
                              {item.titolo}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                              {formatRelativeTime(item.timestamp)}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {item.descrizione}
                          </p>

                          {item.isUnread && (
                            <span className="inline-block mt-1 text-[9px] font-bold text-red-700 bg-red-100/80 px-1.5 py-0.2 rounded-full">
                              Nuova
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                href="/dashboard/interventi"
                onClick={() => setOpen(false)}
                className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline px-2"
              >
                Tutte le chiamate →
              </Link>
              <span className="text-[10px] text-slate-400 font-medium px-2">
                Taskly Operations
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
