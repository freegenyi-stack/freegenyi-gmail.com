import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizedLevel(lvl: string, country: string, isAr: boolean): string {
  if (!isAr) return lvl;
  
  if (country === "DZ" || !country) {
    const mappings: Record<string, string> = {
      '1AP': 'السنة الأولى',
      '2AP': 'السنة الثانية',
      '3AP': 'السنة الثالثة',
      '4AP': 'السنة الرابعة',
      '5AP': 'السنة الخامسة',
    };
    return mappings[lvl] || lvl;
  }
  
  if (country === "MA") {
    const mappings: Record<string, string> = {
      '1AP': 'السنة الأولى',
      '2AP': 'السنة الثانية',
      '3AP': 'السنة الثالثة',
      '4AP': 'السنة الرابعة',
      '5AP': 'السنة الخامسة',
      '6AP': 'السنة السادسة',
    };
    return mappings[lvl] || lvl;
  }
  
  if (country === "TN") {
    const mappings: Record<string, string> = {
      '1ère': 'السنة الأولى',
      '2ème': 'السنة الثانية',
      '3ème': 'السنة الثالثة',
      '4ème': 'السنة الرابعة',
      '5ème': 'السنة الخامسة',
      '6ème': 'السنة السادسة',
    };
    return mappings[lvl] || lvl;
  }

  const genericMap: Record<string, string> = {
    '1AP': 'السنة الأولى',
    '2AP': 'السنة الثانية',
    '3AP': 'السنة الثالثة',
    '4AP': 'السنة الرابعة',
    '5AP': 'السنة الخامسة',
    '6AP': 'السنة السادسة',
    'CP': 'السنة الأولى',
    'CE1': 'السنة الثانية',
    'CE2': 'السنة الثالثة',
    'CM1': 'السنة الرابعة',
    'CM2': 'السنة الخامسة',
    'Grade 1': 'الصف الأول',
    'Grade 2': 'الصف الثاني',
    'Grade 3': 'الصف الثالث',
    'Grade 4': 'الصف الرابع',
    'Grade 5': 'الصف الخامس',
    'Grade 6': 'الصف السادس',
  };
  
  return genericMap[lvl] || lvl;
}
