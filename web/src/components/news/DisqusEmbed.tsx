"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  articleId: number;
  title: string;
};

/** Disqus optionnel — définir NEXT_PUBLIC_DISQUS_SHORTNAME en prod */
export default function DisqusEmbed({ articleId, title }: Props) {
  const host = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;
  const injected = useRef(false);

  useEffect(() => {
    if (!host || injected.current) return;
    injected.current = true;

    (window as unknown as { disqus_config?: () => void }).disqus_config = function disqus_config() {
      (this as { page: { url: string; identifier: string; title: string } }).page.url = window.location.href;
      (this as { page: { url: string; identifier: string; title: string } }).page.identifier = `news-${articleId}`;
      (this as { page: { url: string; identifier: string; title: string } }).page.title = title;
    };

    const d = document;
    const s = d.createElement("script");
    s.src = `https://${host}.disqus.com/embed.js`;
    s.setAttribute("data-timestamp", String(+new Date()));
    (d.head || d.body).appendChild(s);
  }, [host, articleId, title]);

  if (!host) return null;

  return (
    <div className="mt-8">
      <div id="disqus_thread" />
    </div>
  );
}
