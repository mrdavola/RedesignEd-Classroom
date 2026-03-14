import type { GradeLevel, SchoolMonth, CurriculumSubject, CurriculumUnit } from "@/types";
import { SCOPE_DATA } from "./scope-data";

const SUBJECT_ALIASES: Record<string, CurriculumSubject> = {
  reading: "Reading",
  writing: "Writing",
  math: "Math",
  science: "Science",
  "social studies": "Social Studies",
  fundations: "FUNdations",
  foundations: "FUNdations",
};

const MONTH_HEADERS: SchoolMonth[] = [
  "September", "October", "November", "December", "January",
  "February", "March", "April", "May", "June",
];

let cache: CurriculumUnit[] | null = null;

function parseMarkdownTable(grade: GradeLevel, markdown: string): CurriculumUnit[] {
  const units: CurriculumUnit[] = [];
  const lines = markdown.split("\n").filter((l) => l.trim().startsWith("|"));

  // Skip header row and separator row (first 2 pipe-delimited lines)
  const dataRows = lines.slice(2);

  for (const row of dataRows) {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;

    // First cell is the subject -- strip markdown formatting
    const rawSubject = cells[0]
      .replace(/\*\*/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .trim()
      .toLowerCase();
    const subject = SUBJECT_ALIASES[rawSubject];
    if (!subject) continue;

    // Remaining cells map to months
    for (let i = 1; i < cells.length && i - 1 < MONTH_HEADERS.length; i++) {
      const cellText = cells[i];
      if (!cellText || cellText === ":---:" || cellText === "-----") continue;

      const month = MONTH_HEADERS[i - 1];

      // Extract unit name: strip markdown links but keep text
      const unitName = cellText
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\*\*/g, "")
        .replace(/\\#/g, "#")
        .replace(/\\-/g, "-")
        .replace(/\s+/g, " ")
        .trim();

      if (!unitName) continue;

      // Extract URL if present
      const urlMatch = cellText.match(/\[.*?\]\((https?:\/\/[^)]+)\)/);
      const resourceUrl = urlMatch ? urlMatch[1] : undefined;

      units.push({ grade, month, subject, unitName, resourceUrl });
    }
  }

  return units;
}

function getAllUnits(): CurriculumUnit[] {
  if (cache) return cache;
  const all: CurriculumUnit[] = [];
  for (const [grade, markdown] of Object.entries(SCOPE_DATA)) {
    all.push(...parseMarkdownTable(grade as GradeLevel, markdown));
  }
  cache = all;
  return all;
}

export function getCurriculumUnits(
  grade: GradeLevel,
  month: SchoolMonth,
  subjects?: CurriculumSubject[],
): CurriculumUnit[] {
  const all = getAllUnits();
  return all.filter(
    (u) =>
      u.grade === grade &&
      u.month === month &&
      (!subjects || subjects.length === 0 || subjects.includes(u.subject)),
  );
}

export function getAvailableSubjects(grade: GradeLevel): CurriculumSubject[] {
  const all = getAllUnits();
  const subjects = new Set(all.filter((u) => u.grade === grade).map((u) => u.subject));
  return Array.from(subjects);
}
