/**
 * Test SMTP local (Ayrade) — équivalent MailManager.php
 * Usage: npm run email:test -- email@example.com
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const { FREEGENY_EMAILS, freegenyFromAddress } = require("./site-emails.cjs");

async function main() {
  const to = process.argv[2];
  if (!to || !to.includes("@")) {
    console.error("Usage: npm run email:test -- email@example.com");
    process.exit(1);
  }

  const host = process.env.SMTP_HOST || "localhost";
  const port = parseInt(process.env.SMTP_PORT || "25", 10);
  const user = process.env.SMTP_USER || FREEGENY_EMAILS.contact;
  const from = process.env.EMAIL_FROM || freegenyFromAddress("FreeGeny");

  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    ignoreTLS: port === 25,
    tls: { rejectUnauthorized: false },
  });

  const html = `
    <div style="font-family:sans-serif;padding:20px;">
      <h2 style="color:#ea580c;">FreeGeny — test SMTP</h2>
      <p>Si vous recevez ce message, l'envoi d'invitations fonctionne.</p>
    </div>`;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Test invitation FreeGeny",
      html,
      envelope: { from: user, to },
    });
    console.log("OK — messageId:", info.messageId);
  } catch (e) {
    console.error("Échec SMTP:", e.message || e);
    process.exit(1);
  }
}

main();
