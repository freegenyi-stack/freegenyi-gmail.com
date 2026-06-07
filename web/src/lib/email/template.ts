/** Enveloppe HTML Elite — calquée sur includes/MailManager.php (PHP). */
export function buildEliteEmailBody(messageHtml: string, options?: { dir?: "rtl" | "ltr" }): string {
  const year = new Date().getFullYear();
  const dir = options?.dir === "rtl" ? "rtl" : "ltr";

  return `<!DOCTYPE html>
<html lang="${dir === "rtl" ? "ar" : "fr"}" dir="${dir}">
<body style="background-color:#f8fafc;font-family:sans-serif;padding:40px;margin:0;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:40px;border-radius:24px;border:1px solid #f1f5f9;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
    <div style="text-align:center;margin-bottom:30px;">
      <h2 style="color:#ea580c;font-weight:900;margin:0;font-size:28px;">FreeGeny</h2>
    </div>
    <div style="color:#334155;line-height:1.6;font-size:16px;">
      ${messageHtml}
    </div>
    <div style="text-align:center;margin-top:40px;color:#94a3b8;font-size:12px;">
      &copy; ${year} FreeGeny EdTech.
    </div>
  </div>
</body>
</html>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
