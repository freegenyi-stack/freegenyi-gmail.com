export function aoAdminLabels(lang: string) {
  if (lang === "pt") {
    return { region: "Província", commune: "Município" };
  }
  return { region: "Province", commune: "Municipalité" };
}

export function aoPromptSelect(lang: string) {
  if (lang === "pt") {
    return "Selecione a Província e o Município para encontrar a sua escola 🏫";
  }
  return "Please select the Province and Municipality to find your school 🏫";
}
