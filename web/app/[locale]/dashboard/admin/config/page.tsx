import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listAppSettings } from "@/lib/admin/settings.server";
import AdminConfigClient from "./AdminConfigClient";

const FLAGS = [
  { key: "FREEGENY_DEV_AUTO_APPROVE", desc: "Approbation auto vérifs (dev)" },
  { key: "FREEGENY_ADMIN_EMAILS", desc: "E-mails super-admin (CSV)" },
  { key: "CALIBRE_WEB_URL", desc: "URL Calibre-Web pour sync bibliothèque" },
  { key: "CALIBRE_WEB_TOKEN", desc: "Token Bearer Calibre (optionnel)" },
  { key: "CALIBRE_WEB_USERNAME", desc: "Login Calibre-Web (session)" },
  { key: "CALIBRE_WEB_PASSWORD", desc: "Mot de passe Calibre-Web" },
  { key: "COQUI_TTS_URL", desc: "URL serveur Coqui TTS (ex. http://localhost:5002)" },
  { key: "NEXT_PUBLIC_FREEGENY_DEV_AUTO_APPROVE", desc: "Captcha/dev UI register" },
];

export default async function AdminConfigPage() {
  const settings = await listAppSettings();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Configuration</h1>
        <p className="text-sm text-slate-500">Feature flags runtime + variables d&apos;environnement</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature flags (base de données)</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminConfigClient settings={settings} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variables clés (.env.local)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {FLAGS.map(({ key, desc }) => (
              <li key={key} className="rounded-xl border border-slate-100 px-4 py-3">
                <code className="text-xs font-bold text-orange-700">{key}</code>
                <p className="text-sm text-slate-600 mt-1">{desc}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {process.env[key] ? "✓ Définie (valeur masquée)" : "— Non définie"}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          <p>Le mode maintenance est piloté par le flag ci-dessus (middleware).</p>
          <p className="mt-2 text-xs text-slate-400">NODE_ENV = {process.env.NODE_ENV}</p>
        </CardContent>
      </Card>
    </div>
  );
}
