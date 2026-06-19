import { NextResponse } from "next/server";
import { LEARNING_MODES, DAILY_SCREEN_OPTIONS } from "@/lib/child/learning-profile";
import { NOTIFICATION_INTEREST_TOPICS } from "@/lib/onboarding/interest-topics";

const LEVELS_BY_COUNTRY: Record<string, string[]> = {
  DZ: ["1AP", "2AP", "3AP", "4AP", "5AP"],
  FR: ["CP", "CE1", "CE2", "CM1", "CM2"],
  MA: ["1AEP", "2AEP", "3AEP", "4AEP", "5AEP", "6AEP"],
  TN: ["1ère", "2ème", "3ème", "4ème", "5ème", "6ème"],
  INT: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
};

const COUNTRIES = [
  { code: "DZ", nameFr: "Algérie", nameAr: "الجزائر" },
  { code: "FR", nameFr: "France", nameAr: "فرنسا" },
  { code: "MA", nameFr: "Maroc", nameAr: "المغرب" },
  { code: "TN", nameFr: "Tunisie", nameAr: "تونس" },
];

export async function GET() {
  return NextResponse.json({
    countries: COUNTRIES,
    levelsByCountry: LEVELS_BY_COUNTRY,
    learningModes: LEARNING_MODES.map((m) => ({
      id: m.id,
      labelFr: m.labelFr,
      labelAr: m.labelAr,
      descFr: m.descFr,
      descAr: m.descAr,
    })),
    dailyScreenOptions: DAILY_SCREEN_OPTIONS,
    interestTopics: NOTIFICATION_INTEREST_TOPICS.map((t) => ({ id: t.id })),
    maxInterests: 3,
  });
}
