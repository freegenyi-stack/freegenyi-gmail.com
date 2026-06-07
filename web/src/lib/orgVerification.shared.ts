/** Utilitaires org — safe client & server (pas de fs/crypto) */



export type SchoolDocKeys = "pvInstallation" | "licence" | "declaration" | "idCard";

export type NgoDocKeys = "statuts" | "recepisse" | "idCard";



export function getRequiredSchoolDocs(

  institutionType: string,

  privateDocType: string

): SchoolDocKeys[] {

  if (institutionType === "Publique") {

    return ["pvInstallation", "idCard"];

  }

  if (privateDocType === "licence") {

    return ["licence", "idCard"];

  }

  return ["declaration", "idCard"];

}



export function getRequiredNgoDocs(): NgoDocKeys[] {

  return ["statuts", "recepisse", "idCard"];

}



export function getOrgProductName(orgType: "ecole" | "ong"): string {

  return orgType === "ecole" ? "FreeGeny Écoles" : "FreeGeny ONG";

}



export function getOrgDashboardPath(orgType: "ecole" | "ong"): string {

  return orgType === "ecole" ? "/dashboard/ecole" : "/dashboard/ong";

}


