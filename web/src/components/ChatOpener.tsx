"use client";

import React from "react";
import { Link } from "@/i18n/routing";

interface ChatOpenerProps {
  userId?: number;
  convId?: number;
  type?: "direct" | "group" | "ai";
  name?: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function ChatOpener({ children, className, title }: ChatOpenerProps) {
  return (
    <Link href="/dashboard/messages" className={className} title={title}>
      {children}
    </Link>
  );
}
