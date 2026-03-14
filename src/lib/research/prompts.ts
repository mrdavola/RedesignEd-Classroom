import type { WizardState } from "@/types";
import { PORTRAIT_OF_GRADUATE } from "./portrait-of-graduate";
import { COGNITIVE_SCIENCE_CONTEXT } from "./cognitive-science";
import { getCurriculumContext } from "./curriculum-hub";

// ---------------------------------------------------------------------------
// Research Context (embedded in every prompt)
// ---------------------------------------------------------------------------

const EXISTING_RESEARCH = `EDUCATIONAL RESEARCH FRAMEWORK (MANDATORY REFERENCE):
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

export const RESEARCH_CONTEXT = [EXISTING_RESEARCH, PORTRAIT_OF_GRADUATE, COGNITIVE_SCIENCE_CONTEXT].join("\n\n");

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
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

YOUR TASK:
Generate exactly 3 distinct Zero-Budget classroom layout options. Each option must:
1. Use ONLY the furniture listed in the inventory (no purchases).
2. Reference at least one Thornburg archetype and one research statistic.
3. Include a clear pedagogy shift recommendation.
4. Be practical and achievable in a single afternoon.
5. The visualPrompt MUST describe ONLY furniture rearrangement — where each piece of existing furniture moves. It must NEVER describe changing wall colors, adding windows, removing walls, building new structures, or any architectural renovation. Think of it as step-by-step moving instructions for the same room.

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
    visualPrompt: string;    // Furniture-only rearrangement instructions (describe WHERE to move each piece of existing furniture — never describe new walls, paint colors, windows, or structural changes)
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
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

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
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

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
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

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

// ---------------------------------------------------------------------------
// Creative Tool Prompt Builders
// ---------------------------------------------------------------------------

/**
 * Builds the prompt for generating a Classroom DNA profile.
 */
export function buildDnaPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are an Educational Space Analyst who creates "Classroom DNA" profiles — a holistic fingerprint of how a classroom's physical design shapes learning. Ground your analysis in this research:

${RESEARCH_CONTEXT}

CONTEXT:
- Layout Title: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Teacher Goals: ${state.goals || "None specified"}
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

YOUR TASK:
Analyze the classroom layout and generate a Classroom DNA profile. Score each dimension based on the layout details, inventory, and how well the space supports that dimension.

Respond ONLY with valid JSON matching this structure:

{
  "archetypeScores": {
    "campfire": <number 0-100>,
    "wateringHole": <number 0-100>,
    "cave": <number 0-100>,
    "life": <number 0-100>
  },
  "sensoryScores": {
    "visual": <number 0-100>,
    "auditory": <number 0-100>,
    "kinesthetic": <number 0-100>,
    "proprioceptive": <number 0-100>
  },
  "philosophyAlignment": {
    "montessori": <percentage 0-100>,
    "reggioEmilia": <percentage 0-100>,
    "socratic": <percentage 0-100>,
    "flexible": <percentage 0-100>,
    "steamMaker": <percentage 0-100>,
    "inclusive": <percentage 0-100>
  },
  "personalityLabel": "<a 2-4 word personality label, e.g. 'The Curious Explorer' or 'The Structured Haven'>",
  "summary": "<a 3-5 sentence narrative summary of this classroom's DNA, referencing specific research and explaining how the space shapes learning>"
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for generating a philosopher/educator critique.
 */
export function buildPhilosopherCritiquePrompt(
  educator: string,
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are a historian and educational philosopher who channels the voices of great educators. You must write AS IF you are ${educator}, using their known pedagogical beliefs, writing style, and philosophical framework. Ground your analysis in this research:

${RESEARCH_CONTEXT}

CONTEXT:
- Educator Persona: ${educator}
- Layout Title: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Teacher Goals: ${state.goals || "None specified"}
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

YOUR TASK:
Write a critique of the "${layoutTitle}" classroom layout from the perspective of ${educator}. Stay true to their known beliefs, values, and rhetorical style. The critique should feel authentic — as if ${educator} walked into this classroom and shared their thoughts.

Respond ONLY with valid JSON matching this structure:

{
  "educator": "${educator}",
  "praise": "<1-2 paragraphs of what ${educator} would genuinely appreciate about this layout, grounded in their philosophy>",
  "challenge": "<1-2 paragraphs of what ${educator} would critique or push back on, citing their core beliefs>",
  "suggestion": "<1 paragraph of a specific, actionable change ${educator} would recommend, tied to their educational theory>",
  "quote": "<a real or authentically paraphrased quote from ${educator} that is relevant to this classroom design>",
  "quoteSource": "<the source of the quote — book title, lecture, or 'paraphrased from [work]'>"
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for generating a movement heatmap analysis.
 */
export function buildMovementHeatmapPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are an Ergonomics and Spatial Flow Analyst specializing in classroom movement patterns. You study how teachers and students physically navigate learning spaces. Ground your analysis in this research:

${RESEARCH_CONTEXT}

CONTEXT:
- Layout Title: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Teacher Goals: ${state.goals || "None specified"}
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

YOUR TASK:
Analyze the "${layoutTitle}" classroom layout and generate a detailed movement analysis. Model the classroom as a 10x10 grid where (0,0) is the top-left corner (front-left of the room facing the board) and (9,9) is the bottom-right (back-right).

Consider:
- Where furniture creates natural pathways and bottlenecks
- How the teacher circulates during instruction vs. facilitation
- How students move during transitions between Thornburg zones
- Accessibility for students with mobility needs
- The Lombard Effect risk in high-traffic convergence points

Respond ONLY with valid JSON matching this structure:

{
  "grid": [
    [<10 float values 0.0-1.0 representing movement intensity for row 0>],
    [<10 float values for row 1>],
    ... (10 rows total)
  ],
  "teacherPath": [
    { "x": <number 0-9>, "y": <number 0-9>, "label": "<what teacher does at this point>" },
    ... (6-10 waypoints describing typical teacher circulation)
  ],
  "studentFlows": [
    { "fromX": <number>, "fromY": <number>, "toX": <number>, "toY": <number>, "label": "<transition description>" },
    ... (3-5 major student movement vectors)
  ],
  "bottlenecks": [
    { "x": <number>, "y": <number>, "severity": "<low|medium|high>", "description": "<what causes the bottleneck>", "fix": "<actionable solution>" },
    ... (2-4 bottleneck areas)
  ]
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for generating budget optimization recommendations.
 */
export function buildBudgetOptimizerPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are an Educational Procurement Specialist who maximizes learning impact per dollar. You help teachers stretch small budgets into transformative classroom improvements. Ground your recommendations in this research:

${RESEARCH_CONTEXT}

CONTEXT:
- Layout Title: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Teacher Goals: ${state.goals || "None specified"}
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}
- Budget: $200

YOUR TASK:
Given a $200 budget, recommend the highest-impact purchases to enhance the "${layoutTitle}" classroom layout. Prioritize items that:
1. Fill gaps in Thornburg archetype coverage (if the layout is missing Cave space, prioritize that)
2. Address sensory needs for ${state.learnerProfile} learners
3. Have research-backed impact on learning outcomes
4. Are durable and multi-purpose

Be specific — include actual product types and realistic price estimates. Do NOT exceed $200 total.

Respond ONLY with valid JSON matching this structure:

{
  "recommendations": [
    {
      "rank": <number 1-N>,
      "item": "<specific product name/type, e.g. 'Felt desk dividers (set of 6)'>",
      "cost": <number in dollars>,
      "impactScore": <number 0-100>,
      "rationale": "<2-3 sentences explaining why this item matters for this layout, referencing research>",
      "researchSource": "<specific research citation supporting this recommendation>"
    },
    ... (5-8 items, total cost must not exceed $200)
  ],
  "summary": "<2-3 sentence overview of the budget strategy, explaining how these purchases work together to transform the space>"
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for generating a seasonal layout rotation calendar.
 */
export function buildSeasonalCalendarPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are a Curriculum-Aligned Space Planner who helps teachers evolve their classroom layout throughout the school year. You understand that learning needs shift with the academic calendar. Ground your planning in this research:

${RESEARCH_CONTEXT}

CONTEXT:
- Starting Layout: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Teacher Goals: ${state.goals || "None specified"}
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

YOUR TASK:
Design a year-long classroom layout rotation plan that evolves the "${layoutTitle}" layout through 4-5 seasonal phases. Each phase should reflect the natural rhythm of the school year:
- Early fall: community building, establishing norms
- Late fall: deepening academic rigor
- Winter: assessment season, reflection
- Spring: project-based learning, collaboration
- Late spring: celebration, student-led learning

Consider how ${state.learnerProfile} learners' needs change over the year and how the ${state.philosophy} philosophy can be progressively embodied in the space.

Respond ONLY with valid JSON matching this structure:

{
  "phases": [
    {
      "startMonth": "<month name>",
      "endMonth": "<month name>",
      "focus": "<2-3 word phase name, e.g. 'Community Foundations'>",
      "archetype": "<primary Thornburg archetype emphasized>",
      "moves": [
        "<specific furniture move or spatial change>",
        ... (3-5 moves per phase)
      ],
      "rationale": "<2-3 sentences explaining why this configuration suits this time of year, referencing research>"
    },
    ... (4-5 phases covering the full school year)
  ]
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for generating a professional email to a principal.
 */
export function buildPrincipalEmailPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are a Professional Communication Coach for educators. You help teachers write compelling, research-backed emails to administrators that advocate for classroom improvements. Ground your writing in this research:

${RESEARCH_CONTEXT}

CONTEXT:
- Layout Title: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Teacher Goals: ${state.goals || "None specified"}
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

YOUR TASK:
Write a professional email from a teacher to their principal, advocating for support in implementing the "${layoutTitle}" classroom layout. The email should:

1. Be warm but professional — the tone of a confident, prepared educator
2. Lead with student outcomes, not teacher preferences
3. Cite specific research (Hattie effect sizes, peer proximity data, MIT TEAL results)
4. Reference Thornburg archetypes in accessible language (no jargon without explanation)
5. Include a clear ask — what specific support is needed (budget, time, permission)
6. Be concise enough to actually get read (under 400 words for the body)

Respond ONLY with valid JSON matching this structure:

{
  "subject": "<email subject line — compelling but professional>",
  "body": "<full email body in markdown format, including greeting and sign-off>",
  "citations": [
    "<research citation referenced in the email>",
    ... (3-5 citations)
  ]
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for generating a seat-by-seat perspective analysis.
 */
export function buildSeatPerspectivePrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are a Universal Design for Learning (UDL) Specialist who analyzes classroom seating from the student's perspective. You evaluate every seat position for equity of access, sightlines, and sensory experience. Ground your analysis in this research:

${RESEARCH_CONTEXT}

CONTEXT:
- Layout Title: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Teacher Goals: ${state.goals || "None specified"}
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

YOUR TASK:
Analyze the "${layoutTitle}" classroom layout on a 10x10 grid where (0,0) is the front-left of the room. For each seat position, evaluate what a student experiences — their sightlines, proximity to key zones, and sensory environment. Consider:

- Sightline quality to the board/teacher position
- Distance to Thornburg zones (Campfire, Watering Hole, Cave)
- Proximity to doors, windows, and high-traffic areas
- Sensory considerations for neurodiverse learners (the Sensory Paradox)
- Peer proximity effects (the -9 points research)

Respond ONLY with valid JSON matching this structure:

{
  "seats": [
    {
      "x": <number 0-9>,
      "y": <number 0-9>,
      "sightlines": {
        "boardVisibility": "<excellent|good|fair|poor>",
        "teacherVisibility": "<excellent|good|fair|poor>",
        "obstructions": "<description of any visual obstructions or 'none'>"
      },
      "udlProfile": {
        "bestFor": "<type of learner this seat best supports, e.g. 'Students needing minimal distraction'>",
        "challenges": "<potential challenges for certain learners at this seat>",
        "sensoryNotes": "<auditory, visual, or kinesthetic considerations>",
        "nearestZone": "<closest Thornburg zone and distance>"
      }
    },
    ... (include all seat positions in the layout, typically 8-30 seats)
  ],
  "roomFeatures": {
    "boardPosition": { "x": <number>, "y": <number> },
    "teacherHomeBase": { "x": <number>, "y": <number> },
    "doorPosition": { "x": <number>, "y": <number> },
    "windowWall": "<north|south|east|west|none>",
    "quietestZone": { "x": <number>, "y": <number>, "description": "<why this is the quietest>" },
    "highestTrafficZone": { "x": <number>, "y": <number>, "description": "<why this has most traffic>" }
  }
}

Return raw JSON only -- no markdown fences.`;
}

/**
 * Builds the prompt for generating an acoustic/sound zone analysis.
 */
export function buildSoundZonesPrompt(
  layoutTitle: string,
  layoutContext: string,
  state: WizardState,
): string {
  return `You are a Classroom Acoustics Specialist who analyzes sound environments in learning spaces. You understand how noise levels affect cognition, focus, and inclusion — especially for neurodiverse learners. Ground your analysis in this research:

${RESEARCH_CONTEXT}

CONTEXT:
- Layout Title: "${layoutTitle}"
- Layout Details: ${layoutContext}
- Learner Profile: ${state.learnerProfile}
- Philosophy: ${state.philosophy}
- Current Inventory: ${inventoryToString(state)}
- Teacher Goals: ${state.goals || "None specified"}
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}

YOUR TASK:
Analyze the "${layoutTitle}" classroom layout for acoustic properties and sound zone design. Consider:

- How furniture placement creates natural sound barriers or amplifiers
- The Lombard Effect risk — where escalating noise zones overlap
- Sensory needs of ${state.learnerProfile} learners (reference the Sensory Paradox)
- How different Thornburg zones require different noise levels (Cave = quiet, Watering Hole = moderate, Campfire = projected voice)
- Practical, zero-budget sound interventions using existing inventory

Respond ONLY with valid JSON matching this structure:

{
  "zones": [
    {
      "name": "<descriptive zone name, e.g. 'Reading Nook Cave'>",
      "type": "<quiet|moderate|loud>",
      "gridArea": { "fromX": <number 0-9>, "fromY": <number 0-9>, "toX": <number 0-9>, "toY": <number 0-9> },
      "dbEstimate": <number — estimated decibel level during active use, e.g. 35-70>,
      "archetype": "<Thornburg archetype this zone serves>",
      "interventions": [
        "<specific acoustic intervention, e.g. 'Place bookshelf perpendicular to wall as sound baffle'>",
        ... (1-3 interventions per zone)
      ]
    },
    ... (3-6 acoustic zones)
  ],
  "lombardRisks": [
    {
      "zone1": "<name of first zone>",
      "zone2": "<name of second zone>",
      "risk": "<low|medium|high>",
      "description": "<how these zones might create escalating noise>",
      "mitigation": "<specific fix to reduce Lombard Effect>"
    },
    ... (1-3 Lombard risks)
  ],
  "overallAssessment": "<3-4 sentence summary of the classroom's acoustic profile, noting strengths, vulnerabilities, and the single highest-priority intervention>"
}

Return raw JSON only -- no markdown fences.`;
}
