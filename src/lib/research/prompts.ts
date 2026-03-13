import type { WizardState } from "@/types";

// ---------------------------------------------------------------------------
// Research Context (embedded in every prompt)
// ---------------------------------------------------------------------------

export const RESEARCH_CONTEXT = `EDUCATIONAL RESEARCH FRAMEWORK (MANDATORY REFERENCE):
1. THORNBURG'S ARCHETYPES:
   - The Campfire: Space for instruction (One-to-many).
   - The Watering Hole: Space for social discourse (Many-to-many).
   - The Cave: Space for reflection/introversion (Individual). Crucial for neurodiversity.
   - Life: Application space (Makerspace/Hands-on).

2. NEURODIVERSITY & INCLUSION (PERSON-FIRST LANGUAGE REQUIRED):
   - The Sensory Paradox: Open spaces trigger anxiety in students with autism (need predictability/quiet) but help students with ADHD (need movement).
   - Solution: "Nooks" and "Retreats" are not luxuries, they are necessities.
   - Acoustics: Avoid the "Lombard Effect" (escalating noise levels) by creating acoustic zones.

3. KEY STATISTICS:
   - Peer Influence (2024): Students sitting near inattentive peers score 9 POINTS LOWER on quizzes. Strategy: Separate disruptive nodes first.
   - Hattie's Effect Size: Small Group Learning (d=0.47) and Classroom Cohesion (d=0.44).
   - TEAL Project (MIT): Active learning layouts reduced failure rates by 50%.

4. PEDAGOGY-SPACE FIT:
   - The "Failed Experiment": Putting "Sage on Stage" teaching into a flexible room fails.
   - Required Shift: Teachers must become "Guides on the Side" or facilitators.

5. ROSAN BOSCH PRINCIPLES: Design explicitly dictates behavior. (Mountain Top, Cave, Campfire).`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function inventoryToString(state: WizardState): string {
  const inv = state.inventory;
  const items: string[] = [];
  if (inv.studentDesks) items.push(`${inv.studentDesks} student desks`);
  if (inv.teacherDesks) items.push(`${inv.teacherDesks} teacher desks`);
  if (inv.kidneyTables) items.push(`${inv.kidneyTables} kidney/horseshoe tables`);
  if (inv.studentChairs) items.push(`${inv.studentChairs} student chairs`);
  if (inv.carpets) items.push(`${inv.carpets} carpets/rugs`);
  if (inv.shelves) items.push(`${inv.shelves} shelving units`);
  if (inv.easels) items.push(`${inv.easels} easels`);
  if (inv.bins) items.push(`${inv.bins} bins/crates`);
  return items.length > 0 ? items.join(", ") : "No inventory specified";
}

// ---------------------------------------------------------------------------
// Prompt Builders
// ---------------------------------------------------------------------------

/**
 * Builds the system prompt for the main classroom layout analysis.
 * Instructs the model to return 3 distinct Zero-Budget layout options as JSON.
 */
export function buildAnalysisPrompt(state: WizardState): string {
  return `You are an expert Educational Space Planner specializing in evidence-based classroom redesign. You MUST ground every recommendation in the following research:

${RESEARCH_CONTEXT}

TEACHER CONTEXT:
- Learner Profile: ${state.learnerProfile}
- Teaching Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Goals / Constraints: ${state.goals || "None specified"}
${state.image ? "- A photo of the current classroom has been provided for visual analysis." : "- No classroom photo was provided."}

YOUR TASK:
Generate exactly 3 distinct Zero-Budget classroom layout options. Each option must:
1. Use ONLY the furniture listed in the inventory (no purchases).
2. Reference at least one Thornburg archetype and one research statistic.
3. Include a clear pedagogy shift recommendation.
4. Be practical and achievable in a single afternoon.

Respond ONLY with valid JSON matching this TypeScript interface:

interface AnalysisResult {
  baseRoomDescription: string; // Brief description of current room based on photo/inventory
  options: Array<{
    title: string;           // Creative name for the layout
    archetype: string;       // Primary Thornburg archetype used
    pedagogyShift: string;   // e.g. "Sage on Stage → Guide on the Side"
    why: string;             // Research-backed justification (2-3 sentences)
    researchNote: string;    // Specific statistic or citation
    moves: string[];         // Step-by-step furniture moves (5-8 steps)
    visualPrompt: string;    // Detailed description for image generation
    color: string;           // One of: amber, blue, purple, green, rose, indigo
  }>;
}

Return raw JSON only -- no markdown fences, no commentary.`;
}

/**
 * Builds the prompt for generating a grant proposal based on a selected layout.
 */
export function buildGrantPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are a Grant Writing Specialist for K-12 educational spaces. Use the following research to strengthen your proposal:

${RESEARCH_CONTEXT}

CONTEXT:
- Selected Layout: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Teacher Goals: ${state.goals || "None specified"}

YOUR TASK:
Write a compelling grant proposal (500-800 words) for funding to enhance the "${layoutTitle}" classroom layout. The proposal should:

1. **Need Statement**: Describe the current classroom challenges grounded in research.
2. **Project Description**: Explain the redesign vision referencing Thornburg archetypes and evidence-based design.
3. **Research Justification**: Cite specific statistics (Hattie effect sizes, peer proximity data, TEAL results).
4. **Budget Rationale**: Suggest specific items to purchase that would enhance the zero-budget layout already implemented.
5. **Expected Outcomes**: Measurable improvements tied to the research framework.
6. **Sustainability**: How the design will be maintained and iterated upon.

Use professional grant language. Include specific dollar amounts for requested items. Format with clear headings in markdown.`;
}

/**
 * Builds the prompt for adapting a lesson plan to a specific layout.
 */
export function buildLessonPrompt(
  topic: string,
  layoutTitle: string,
  state: WizardState,
): string {
  return `You are a Curriculum Design Specialist who adapts lesson plans to leverage physical classroom environments. Reference this research:

${RESEARCH_CONTEXT}

CONTEXT:
- Lesson Topic: "${topic}"
- Classroom Layout: "${layoutTitle}"
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Available Furniture: ${inventoryToString(state)}

YOUR TASK:
Create a detailed lesson plan for "${topic}" that deliberately uses the "${layoutTitle}" classroom layout. The plan should:

1. **Learning Objectives**: 2-3 measurable objectives aligned to the topic.
2. **Space Activation Sequence**: How students move through Thornburg zones during the lesson:
   - Campfire phase (direct instruction / hook)
   - Watering Hole phase (collaborative exploration)
   - Cave phase (individual reflection / assessment)
3. **Timed Agenda**: Minute-by-minute plan for a standard class period.
4. **Furniture Transitions**: Specific instructions for any mid-lesson furniture moves.
5. **Differentiation Notes**: How the layout supports diverse learners (reference the Sensory Paradox).
6. **Assessment**: How the space supports formative assessment.

Format in clean markdown with clear headings and time stamps.`;
}

/**
 * Builds the prompt for generating classroom management norms and transition scripts.
 */
export function buildNormsPrompt(
  layoutTitle: string,
  state: WizardState,
): string {
  return `You are a Classroom Management Expert who creates behavioral systems tied to physical spaces. Reference this research:

${RESEARCH_CONTEXT}

CONTEXT:
- Classroom Layout: "${layoutTitle}"
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Available Furniture: ${inventoryToString(state)}
- Teacher Goals: ${state.goals || "None specified"}

YOUR TASK:
Create a comprehensive classroom management toolkit for the "${layoutTitle}" layout. Include:

1. **Zone Norms** (for each Thornburg zone in the layout):
   - Expected voice level (0-4 scale)
   - Movement permissions
   - Materials access rules
   - Visual anchor / poster language

2. **Transition Scripts** (word-for-word teacher language):
   - Whole-group to small-group transition
   - Small-group to individual (Cave) transition
   - Re-gathering to Campfire transition
   - Emergency "freeze and reset" script

3. **Seating Protocols**:
   - How to assign seats considering peer proximity research (-9 points effect)
   - Rotation schedule template
   - Student choice guidelines

4. **Signals & Routines**:
   - Attention signals appropriate for ${state.learnerProfile}
   - Timer/countdown procedures
   - Clean-up and reset routine (getting back to default layout)

5. **Inclusion Safeguards**:
   - Sensory break procedures
   - Quiet retreat access norms
   - Movement break integration

Format in clean markdown. Use teacher-friendly language that can be printed and posted.`;
}
