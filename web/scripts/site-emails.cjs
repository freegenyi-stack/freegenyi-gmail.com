/** Copie CommonJS des boîtes mail — scripts Node (seed, tests SMTP). */
module.exports = {
  FREEGENY_EMAILS: {
    admin: "admin@freegeny.com",
    contact: "contact@freegeny.com",
    support: "support@freegeny.com",
    press: "press@freegeny.com",
    notifications: "contact@freegeny.com",
  },
  freegenyFromAddress(label = "FreeGeny") {
    return `${label} <${this.FREEGENY_EMAILS.contact}>`;
  },
};
