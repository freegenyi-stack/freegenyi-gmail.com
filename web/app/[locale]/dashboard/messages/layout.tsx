/** Layout messagerie plein écran sous le header global */
export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 top-[var(--header-height,72px)] z-0 flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.15),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(251,191,36,0.12),transparent_40%)]" aria-hidden />
      <div className="relative z-10 flex h-full min-h-0 flex-col">{children}</div>
    </div>
  );
}
