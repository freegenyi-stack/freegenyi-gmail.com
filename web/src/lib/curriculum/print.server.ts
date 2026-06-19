import type { ChildSessionPayload } from "./types";

export function curriculumSessionToPrintHtml(
  payload: ChildSessionPayload,
  opts?: { childName?: string; sectionTitle?: string }
): string {
  const items = payload.items
    .map(
      (item, i) => `
    <div class="exo">
      <p class="num">${i + 1}.</p>
      <p class="q" dir="rtl">${escapeHtml(item.statementAr || item.statementFr)}</p>
      <p class="q-fr">${escapeHtml(item.statementFr)}</p>
      ${item.optionsFr?.length ? `<ul>${item.optionsFr.map((o) => `<li dir="rtl">${escapeHtml(o)}</li>`).join("")}</ul>` : ""}
      <div class="answer-line"></div>
    </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <title>FreeGeny — ${escapeHtml(payload.titleFr)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; color: #1e293b; }
    h1 { color: #ea580c; font-size: 1.5rem; }
    .meta { color: #64748b; font-size: 0.85rem; margin-bottom: 2rem; }
    .exo { margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px dashed #e2e8f0; }
    .num { font-weight: 800; color: #ea580c; }
    .q { font-size: 1.1rem; font-weight: 700; margin: 0.25rem 0; }
    .q-fr { font-size: 0.9rem; color: #64748b; }
    ul { margin: 0.5rem 0; }
    .answer-line { height: 2rem; border-bottom: 2px dotted #cbd5e1; margin-top: 0.75rem; }
    @media print { body { margin: 1cm; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(payload.titleFr)}</h1>
  <p class="meta">FreeGeny · ${escapeHtml(opts?.childName ?? "Enfant")}${opts?.sectionTitle ? ` · ${escapeHtml(opts.sectionTitle)}` : ""}</p>
  ${items}
  <script>window.onload = () => window.print();</script>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
