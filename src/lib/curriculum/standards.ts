import type { CurriculumUnit, StandardAlignment } from "@/types";

const GRADE_MAP: Record<string, string> = {
  K: "Kindergarten",
  "1": "Grade 1",
  "2": "Grade 2",
  "3": "Grade 3",
  "4": "Grade 4",
  "5": "Grade 5",
};

const SUBJECT_FRAMEWORK: Record<string, string> = {
  Reading: "ELA",
  Writing: "ELA",
  Math: "Math",
  Science: "NGSS",
  "Social Studies": "Social Studies",
  FUNdations: "ELA",
};

function buildSearchQuery(unit: CurriculumUnit): string {
  const grade = GRADE_MAP[unit.grade] || unit.grade;
  const framework = SUBJECT_FRAMEWORK[unit.subject] || unit.subject;
  const topic = unit.unitName
    .replace(/^(Cont\.?\s*)?Unit\s*\d+:?\s*/i, "")
    .replace(/^(Begin|Cont)\s*/i, "")
    .replace(/Book\s*#?\d+/gi, "")
    .replace(/\(.*?\)/g, "")
    .trim();
  return `${grade} ${framework} ${topic}`;
}

export async function alignStandards(
  units: CurriculumUnit[],
): Promise<StandardAlignment[]> {
  const alignments: StandardAlignment[] = [];

  const seen = new Set<string>();
  const uniqueUnits = units.filter((u) => {
    const key = `${u.subject}:${u.unitName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  for (const unit of uniqueUnits) {
    try {
      const query = buildSearchQuery(unit);
      const standardRes = await callMcpTool("find_standard_statement", {
        query,
      });
      if (!standardRes || !standardRes.results?.length) continue;

      const results = standardRes.results as Array<{
        code?: string;
        id?: string;
        statement?: string;
        description?: string;
      }>;

      for (const standard of results.slice(0, 2)) {
        const alignment: StandardAlignment = {
          standardCode: standard.code || standard.id || "Unknown",
          standardStatement:
            standard.statement || standard.description || "",
          learningComponents: [],
          progression: undefined,
        };

        try {
          const componentsRes = await callMcpTool(
            "find_learning_components_from_standard",
            { standardId: standard.id || standard.code },
          );
          if (componentsRes?.components) {
            const components = componentsRes.components as Array<{
              name?: string;
              description?: string;
            }>;
            alignment.learningComponents = components
              .map(
                (c: { name?: string; description?: string }) =>
                  c.name || c.description || "",
              )
              .filter(Boolean);
          }
        } catch {
          // Components unavailable — degrade gracefully
        }

        try {
          const progressionRes = await callMcpTool(
            "find_standards_progression_from_standard",
            { standardId: standard.id || standard.code },
          );
          if (progressionRes?.progression) {
            alignment.progression =
              typeof progressionRes.progression === "string"
                ? progressionRes.progression
                : JSON.stringify(progressionRes.progression);
          }
        } catch {
          // Progression unavailable — degrade gracefully
        }

        alignments.push(alignment);
      }
    } catch {
      continue;
    }
  }

  return alignments;
}

async function callMcpTool(
  toolName: string,
  params: Record<string, unknown>,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Record<string, any> | null> {
  const mcpUrl = process.env.LEARNING_COMMONS_MCP_URL;
  if (!mcpUrl) {
    console.warn(`MCP server URL not configured — skipping ${toolName}`);
    return null;
  }

  try {
    const res = await fetch(mcpUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool: toolName, params }),
    });
    if (!res.ok) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await res.json()) as Record<string, any>;
  } catch {
    return null;
  }
}
