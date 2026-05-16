"use client";

import React from "react";

interface ChatOpenerProps {
  userId?: number;
  convId?: number;
  type?: "direct" | "group" | "ai";
  name?: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function ChatOpener({ userId, convId, type, name, children, className, title }: ChatOpenerProps) {
  const handleClick = () => {
    // Dispatch custom event caught by ChatContext
    const event = new CustomEvent("open-chat", { detail: { convId, userId, type, name } });
    window.dispatchEvent(event);
  };

  return (
    <button onClick={handleClick} className={className} title={title}>
      {children}
    </button>
  );
}
