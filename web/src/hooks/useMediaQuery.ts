"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useIsMobileLayout(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}

export function useIsTabletLayout(): boolean {
  const tablet = useMediaQuery("(min-width: 768px)");
  const desktop = useMediaQuery("(min-width: 1024px)");
  return tablet && !desktop;
}

export function useIsDesktopLayout(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
