"use client";

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export type CaptchaFieldRef = {
  validate: (value: string) => boolean;
  reload: () => void;
};

type Props = {
  length?: number;
  bgColor?: string;
  textColor?: string;
  className?: string;
  onReload?: () => void;
};

function generateCode(length: number): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

function drawCaptcha(canvas: HTMLCanvasElement, code: string, bg: string, fg: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = code.length * 32 + 20;
  const h = 52;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  ctx.scale(dpr, dpr);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(0,0,0,${0.06 + Math.random() * 0.1})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * w, Math.random() * h);
    ctx.lineTo(Math.random() * w, Math.random() * h);
    ctx.stroke();
  }

  ctx.font = "bold 26px Arial, Helvetica, sans-serif";
  ctx.fillStyle = fg;
  ctx.textBaseline = "middle";

  const slot = (w - 20) / code.length;
  for (let i = 0; i < code.length; i++) {
    const x = 10 + slot * i + slot / 2;
    const y = h / 2 + (Math.random() * 8 - 4);
    const angle = (Math.random() - 0.5) * 0.35;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(code[i], -9, 0);
    ctx.restore();
  }
}

const CaptchaField = forwardRef<CaptchaFieldRef, Props>(function CaptchaField(
  { length = 6, bgColor = "#f5f5f5", textColor = "#000000", className, onReload },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const codeRef = useRef("");
  const onReloadRef = useRef(onReload);
  onReloadRef.current = onReload;

  const reload = useCallback(() => {
    const code = generateCode(length);
    codeRef.current = code;
    const canvas = canvasRef.current;
    if (canvas) drawCaptcha(canvas, code, bgColor, textColor);
    onReloadRef.current?.();
  }, [length, bgColor, textColor]);

  useEffect(() => {
    reload();
  }, [reload]);

  useImperativeHandle(ref, () => ({
    validate: (value: string) => value.trim() === codeRef.current,
    reload,
  }));

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <canvas ref={canvasRef} role="img" aria-label="Code de sécurité" className="rounded-lg" />
      <button
        type="button"
        onClick={reload}
        aria-label="Nouveau code"
        className="absolute -end-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition active:bg-neutral-100"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
});

export default CaptchaField;
