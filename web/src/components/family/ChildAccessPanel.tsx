"use client";

import React, { useState } from "react";
import { KeyRound, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import {
  createChildPairingCodeAction,
  setChildPinAction,
} from "@/lib/actions/family";
import { cn } from "@/lib/utils";

type Props = {
  childId: number;
  childName: string;
  hasPin: boolean;
};

export default function ChildAccessPanel({ childId, childName, hasPin }: Props) {
  const locale = useLocale();
  const [pin, setPin] = useState("");
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [pairUrl, setPairUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const savePin = async () => {
    if (!/^\d{4}$/.test(pin)) {
      toast.error("Le code doit contenir 4 chiffres.");
      return;
    }
    setLoading(true);
    const result = await setChildPinAction(childId, pin);
    if ("error" in result && result.error) {
      toast.error(result.error);
    } else {
      toast.success("Code enfant enregistré.");
      setPin("");
    }
    setLoading(false);
  };

  const generateQr = async () => {
    setLoading(true);
    const result = await createChildPairingCodeAction(childId);
    if ("error" in result && result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/${locale}/child/pair?code=${result.code}`;
    setPairCode(result.code);
    setPairUrl(url);
    setLoading(false);
  };

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        Accès tablette — {childName}
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <KeyRound className="h-4 w-4 text-orange-600" />
          Code PIN (4 chiffres)
          {hasPin && <span className="text-emerald-600">· actif</span>}
        </div>
        <div className="flex gap-2">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="••••"
            className="h-11 w-24 rounded-xl border border-slate-200 bg-white px-3 text-center font-bold tracking-widest"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void savePin()}
            className="rounded-xl bg-slate-900 px-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 disabled:opacity-50"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <QrCode className="h-4 w-4 text-orange-600" />
          Appairer une tablette
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void generateQr()}
          className="rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-50"
        >
          Générer QR (10 min)
        </button>
        {pairUrl && pairCode && (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-4 border border-slate-100">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pairUrl)}`}
              alt="QR appairage tablette"
              width={160}
              height={160}
              className="rounded-lg"
            />
            <p className="text-xs font-bold text-slate-500">Code : {pairCode}</p>
            <p className="text-[10px] text-center text-slate-400 max-w-xs">
              Sur la tablette : ouvrez freegeny.com/{locale}/child/pair et scannez ou saisissez le code.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
