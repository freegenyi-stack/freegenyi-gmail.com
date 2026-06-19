"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import {
  getChildSessionInfoAction,
  pairChildDeviceAction,
  verifyChildPinAction,
} from "@/lib/actions/family";
import { cn } from "@/lib/utils";

export default function ChildLoginClient() {
  const locale = useLocale();
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [pairCode, setPairCode] = useState("");
  const [mode, setMode] = useState<"pin" | "pair">("pin");
  const [childName, setChildName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void getChildSessionInfoAction().then((info) => {
      if (info.paired) setChildName(info.childName);
    });
  }, []);

  const submitPin = async () => {
    if (pin.length !== 4) {
      toast.error("Entrez 4 chiffres.");
      return;
    }
    setLoading(true);
    const result = await verifyChildPinAction(pin);
    if ("error" in result && result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }
    if (!("childId" in result)) return;
    router.push(`/${locale}/lobby/${result.childId}`);
  };

  const submitPair = async () => {
    if (!pairCode.trim()) {
      toast.error("Entrez le code d'appairage.");
      return;
    }
    setLoading(true);
    const result = await pairChildDeviceAction(pairCode.trim());
    if ("error" in result && result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }
    toast.success("Tablette appairée ! Entrez votre code PIN.");
    setChildName(null);
    setMode("pin");
    setLoading(false);
    void getChildSessionInfoAction().then((info) => {
      if (info.paired) setChildName(info.childName);
    });
  };

  return (
    <div className="flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 text-5xl">🦊</div>
        <h1 className="text-2xl font-extrabold text-black">Mode enfant</h1>
        {childName && (
          <p className="mt-2 text-neutral-600">
            Bonjour <span className="font-bold text-orange-600">{childName.split(" ")[0]}</span> !
          </p>
        )}

        <div className="mt-8 flex gap-2 rounded-2xl bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setMode("pin")}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-bold transition",
              mode === "pin" ? "bg-white text-black shadow" : "text-neutral-500"
            )}
          >
            Code PIN
          </button>
          <button
            type="button"
            onClick={() => setMode("pair")}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-bold transition",
              mode === "pair" ? "bg-white text-black shadow" : "text-neutral-500"
            )}
          >
            Appairer
          </button>
        </div>

        {mode === "pin" ? (
          <div className="mt-6 space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
              className="h-16 w-full rounded-2xl border-2 border-neutral-200 text-center text-3xl font-black tracking-[0.5em]"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => void submitPin()}
              className="min-h-[52px] w-full rounded-2xl border-b-[5px] border-orange-800 bg-orange-500 py-3 font-extrabold uppercase text-white disabled:opacity-50"
            >
              Jouer !
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <input
              value={pairCode}
              onChange={(e) => setPairCode(e.target.value.toUpperCase())}
              placeholder="CODE QR"
              className="h-14 w-full rounded-2xl border-2 border-neutral-200 px-4 text-center text-lg font-bold uppercase tracking-widest"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => void submitPair()}
              className="min-h-[52px] w-full rounded-2xl border-b-[5px] border-orange-800 bg-orange-500 py-3 font-extrabold uppercase text-white disabled:opacity-50"
            >
              Appairer la tablette
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
