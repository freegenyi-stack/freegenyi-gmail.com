"use client";



import React from "react";

import { Link, usePathname } from "@/i18n/routing";

import { cn } from "@/lib/utils";

import {

  BarChart3,

  BookOpen,

  LayoutDashboard,

  LogOut,

  Mail,

  MessageSquare,

  GraduationCap,
  Newspaper,

  Settings,

  ShieldCheck,

  Users,

  Bell,

} from "lucide-react";

import { signOut } from "next-auth/react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const NAV: NavItem[] = [

  { href: "/dashboard/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },

  { href: "/dashboard/admin/stats", label: "Statistiques", icon: BarChart3 },

  { href: "/dashboard/admin/users", label: "Utilisateurs", icon: Users },

  { href: "/dashboard/admin/messages", label: "Modération", icon: MessageSquare },

  { href: "/dashboard/admin/notifications", label: "Notifications", icon: Bell },

  { href: "/dashboard/admin/emails", label: "E-mails", icon: Mail },

  { href: "/dashboard/admin/contacts", label: "Contacts", icon: Mail },

  { href: "/dashboard/admin/library", label: "Bibliothèque", icon: BookOpen },

  { href: "/dashboard/admin/verifications", label: "Vérifications", icon: ShieldCheck },

  { href: "/dashboard/admin/teacher-news", label: "Actualités", icon: Newspaper },

  { href: "/dashboard/admin/teacher-courses", label: "Formations", icon: GraduationCap },

  { href: "/dashboard/admin/config", label: "Config", icon: Settings },

];



export default function AdminShell({

  children,

  adminEmail,

}: {

  children: React.ReactNode;

  adminEmail: string;

}) {

  const pathname = usePathname();



  const normalize = (p: string) => p.replace(/^\/[A-Z]{2}-[a-z]{2}(?=\/)/, "") || p;



  const isActive = (href: string, exact?: boolean) => {

    const p = normalize(pathname);

    if (exact) return p === href || p === `${href}/`;

    return p.startsWith(href);

  };



  return (

    <div className="flex min-h-[calc(100dvh-72px)] bg-slate-950 text-slate-100">

      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex">

        <div className="border-b border-slate-800 px-5 py-6">

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">FreeGeny</p>

          <h1 className="mt-1 text-lg font-black text-white">Console Admin</h1>

          <p className="mt-2 truncate text-xs text-slate-400">{adminEmail}</p>

        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">

          {NAV.map(({ href, label, icon: Icon, exact }) => {

            const active = isActive(href, exact);

            return (

              <Link

                key={href}

                href={href}

                className={cn(

                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition",

                  active

                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"

                    : "text-slate-300 hover:bg-slate-800 hover:text-white"

                )}

              >

                <Icon className="h-4 w-4 shrink-0 opacity-90" />

                {label}

              </Link>

            );

          })}

        </nav>

        <div className="border-t border-slate-800 p-3">

          <button

            type="button"

            onClick={() => signOut({ callbackUrl: "/" })}

            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white"

          >

            <LogOut className="h-4 w-4" />

            Déconnexion

          </button>

        </div>

      </aside>



      <div className="flex min-w-0 flex-1 flex-col">

        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur lg:hidden">

          <div>

            <p className="text-xs font-black uppercase text-orange-400">Admin</p>

            <p className="truncate text-sm font-bold text-white">{adminEmail}</p>

          </div>

        </header>

        <div className="flex gap-1 overflow-x-auto border-b border-slate-800 bg-slate-900 p-2 lg:hidden">

          {NAV.map(({ href, label, exact }) => {

            const active = isActive(href, exact);

            return (

              <Link

                key={href}

                href={href}

                className={cn(

                  "shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase",

                  active ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-300"

                )}

              >

                {label}

              </Link>

            );

          })}

        </div>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 text-slate-900 sm:p-8">{children}</main>

      </div>

    </div>

  );

}

