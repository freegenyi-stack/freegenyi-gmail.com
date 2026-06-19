"use client";

import React from "react";
import { Link } from "@/i18n/routing";

interface ChatOpenerProps {
  userId?: number;
  convId?: number;
  type?: "direct" | "group" | "ai";
  voice?: boolean;
  name?: string;
  childId?: number;
  childName?: string;
  boost?: boolean;
  geny?: boolean;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

function resolveHref(
  userId?: number,
  convId?: number,
  type?: string,
  voice?: boolean,
  childId?: number,
  childName?: string,
  boost?: boolean,
  geny?: boolean
): string {
  const params = new URLSearchParams();
  if (voice) params.set("voice", "1");
  if (childId) params.set("childId", String(childId));
  if (childName) params.set("childName", childName);
  if (boost) params.set("boost", "1");
  if (geny) params.set("geny", "1");
  const q = params.toString();
  const suffix = q ? `?${q}` : "";

  if (convId) return `/dashboard/messages?c=${convId}${q ? `&${q}` : ""}`;
  if (userId) return `/dashboard/messages?u=${userId}${q ? `&${q}` : ""}`;
  if (type === "ai") return `/dashboard/messages${suffix}`;
  return `/dashboard/messages${suffix}`;
}

export default function ChatOpener({
  userId,
  convId,
  type,
  voice,
  name,
  childId,
  childName,
  boost,
  geny,
  children,
  className,
  title,
}: ChatOpenerProps) {
  return (
    <Link
      href={resolveHref(userId, convId, type, voice, childId, childName, boost, geny)}
      className={className}
      title={title}
    >
      {children}
    </Link>
  );
}
