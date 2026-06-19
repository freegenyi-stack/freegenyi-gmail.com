import path from "path";
import type { CurriculumCountry, CurriculumLevel, CurriculumSubject } from "./types";

const BUNDLE_FILES = [
  "curriculum.json",
  "competences.json",
  "exercise_bank.json",
  "evaluations.json",
] as const;

export function curriculumRootFromCwd(): string {
  return path.resolve(process.cwd(), "..", "curriculum");
}

export function countryDir(country: CurriculumCountry): string {
  return path.join(curriculumRootFromCwd(), "countries", country);
}

export function levelDir(country: CurriculumCountry, level: CurriculumLevel): string {
  return path.join(countryDir(country), "levels", level);
}

export function subjectDir(
  country: CurriculumCountry,
  level: CurriculumLevel,
  subject: CurriculumSubject
): string {
  return path.join(levelDir(country, level), subject);
}

export function manifestPath(profile: "parent" | "teacher" | "child-mobile", country: CurriculumCountry): string {
  const file =
    profile === "parent"
      ? `parent.${country}.json`
      : profile === "teacher"
        ? `teacher.${country}.json`
        : `child-mobile.${country}.json`;
  return path.join(curriculumRootFromCwd(), "manifests", file);
}

export function registryPath(country: CurriculumCountry): string {
  return path.join(countryDir(country), "registry.json");
}

export { BUNDLE_FILES };

export function bundleKey(
  country: CurriculumCountry,
  level: CurriculumLevel,
  subject: CurriculumSubject
): string {
  return `${country}/${level}/${subject}`;
}
