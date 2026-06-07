export function zaAdminLabels(lang: string) {
  if (lang === "af") {
    return { region: "Provinsie", commune: "Distriksmunisipaliteit" };
  }
  if (lang === "zu") {
    return { region: "Isifundazwe", commune: "Umasipala Wesifunda" };
  }
  if (lang === "xh") {
    return { region: "Iphondo", commune: "uMasipala weSithili" };
  }
  if (lang === "fr") {
    return { region: "Province", commune: "Municipalité de district" };
  }
  return { region: "Province", commune: "District Municipality" };
}

export function zaPromptSelect(lang: string) {
  if (lang === "af") {
    return "Kies asseblief die Provinsie en Distrik om jou skool te vind 🏫";
  }
  if (lang === "zu") {
    return "Sicela ukhethe Isifundazwe kanye Nesifunda ukuze uthole isikole sakho 🏫";
  }
  if (lang === "xh") {
    return "Nceda ukhethe Iphondo kunye neSithili ukuze ufumane isikolo sakho 🏫";
  }
  if (lang === "fr") {
    return "Veuillez sélectionner la Province et le District pour choisir votre école 🏫";
  }
  return "Please select the Province and District to find your school 🏫";
}
