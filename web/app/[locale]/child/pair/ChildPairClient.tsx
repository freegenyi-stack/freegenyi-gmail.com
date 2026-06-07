"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { pairChildDeviceAction } from "@/lib/actions/family";

export default function ChildPairClient() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("code");
    if (fromUrl) void handlePair(fromUrl);
  }, [searchParams]);

  const handlePair = async (raw?: string) => {
    const value = (raw ?? code).trim().toUpperCase();
    if (!value) return;
    setLoading(true);
    const result = await pairChildDeviceAction(value);
    if ("error" in result && result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }
    toast.success("Tablette prête !");
    router.push(`/${locale}/child`);
  };

  return (
    <div className="flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-extrabold text-black">Appairer la tablette</h1>
        <p className="mt-2 text-neutral-600 text-sm">Scannez le QR du parent ou entrez le code.</p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="mt-8 h-14 w-full rounded-2xl border-2 border-neutral-200 px-4 text-center text-lg font-bold uppercase tracking-widest"
          placeholder="CODE"
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => void handlePair()}
          className="mt-4 min-h-[52px] w-full rounded-2xl border-b-[5px] border-orange-800 bg-orange-500 py-3 font-extrabold uppercase text-white disabled:opacity-50"
        >
          Valider
        </button>
      </div>
    </div>
  );
}
