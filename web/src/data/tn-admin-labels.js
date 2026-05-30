/** Tunisia administrative UI labels (Gouvernorat / Délégation). */

function tnAdminLabels(lang) {
  if (lang === "ar") {
    return { region: "المحافظة", commune: "المعتمدية" };
  }
  return { region: "Gouvernorat", commune: "Délégation" };
}

module.exports = { tnAdminLabels };
