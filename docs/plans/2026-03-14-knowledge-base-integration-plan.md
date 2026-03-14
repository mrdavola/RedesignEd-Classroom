# Knowledge Base Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate Portrait of a Graduate, Curriculum Hub, and cognitive science research into the AI prompt system so every classroom analysis is grounded in district frameworks and learning science.

**Architecture:** Three new TypeScript modules in `src/lib/research/` export string constants and a curriculum lookup function. These get composed into the existing `RESEARCH_CONTEXT` in `prompts.ts`. No changes to API routes, AI service layer, components, or types.

**Tech Stack:** TypeScript, Next.js (existing app)

**Design doc:** `docs/plans/2026-03-14-knowledge-base-integration-design.md`

---

### Task 1: Create Portrait of a Graduate module

**Files:**
- Create: `src/lib/research/portrait-of-graduate.ts`

**Step 1: Create the file**

```typescript
// ---------------------------------------------------------------------------
// NYS Portrait of a Graduate + Culturally Responsive-Sustaining Education
// ---------------------------------------------------------------------------

export const PORTRAIT_OF_GRADUATE = `
6. NYS PORTRAIT OF A GRADUATE (MANDATORY REFERENCE):
   A New York State graduate who is CULTURALLY RESPONSIVE builds strong, respectful
   relationships, valuing diverse perspectives as essential to a rigorous, inclusive
   learning community. Every spatial recommendation must connect to at least one
   of these six graduate competencies:

   a) ACADEMICALLY PREPARED: Demonstrates a strong foundation in NYS learning standards,
      equipped with knowledge and skills for college, careers, civic engagement, and life.
      → Spatial implication: Dedicated instructional zones with clear sightlines to
        teaching surfaces; organized reference materials accessible during learning.

   b) EFFECTIVE COMMUNICATOR: Articulates ideas clearly through speaking, writing, and
      media, engaging with diverse audiences and actively listening to different perspectives.
      → Spatial implication: Watering Hole clusters for peer discourse; Campfire areas
        with presentation space; documentation walls displaying student communication.

   c) CREATIVE INNOVATOR: Uses imagination, curiosity, and flexible thinking to solve
      problems creatively, developing new ideas while adapting to evolving challenges.
      → Spatial implication: Life/maker zones with reconfigurable furniture; loose-parts
        stations; prototyping areas with accessible materials.

   d) GLOBAL CITIZEN: Acts responsibly within local, global, and digital communities,
      employing civic knowledge and mindsets to promote sustainability and contribute
      to a culturally diverse, democratic society.
      → Spatial implication: Community gathering spaces; global/cultural displays;
        collaborative project areas that mirror real-world civic engagement.

   e) CRITICAL THINKER: Analyzes information thoughtfully, evaluates evidence critically,
      and identifies patterns across multiple content areas to address complex issues.
      → Spatial implication: Multi-source reference stations; Socratic circle arrangements;
        visible thinking routine displays near collaborative zones.

   f) REFLECTIVE AND FUTURE FOCUSED: Engages in self-reflection, sets meaningful goals,
      maintains supportive relationships, and demonstrates responsible decision-making
      that prioritizes social, emotional, and mental well-being.
      → Spatial implication: Cave spaces for individual reflection; SEL/peace corners;
        goal-setting displays; quiet retreat areas.

7. CULTURALLY RESPONSIVE-SUSTAINING EDUCATION (CR-S LENS):
   Evaluate every classroom design against these four CR-S principles:
   a) WELCOMING AND AFFIRMING ENVIRONMENT: Does the space recognize and celebrate
      student identities? Look for: mirrors of student cultures, multilingual signage,
      student-chosen displays, identity-affirming materials at eye level.
   b) HIGH EXPECTATIONS AND RIGOROUS INSTRUCTION: Does the layout support academic
      rigor for ALL learners? Avoid designs that segregate or limit access.
   c) INCLUSIVE CURRICULUM AND ASSESSMENT: Does the space represent varied perspectives?
      Look for: diverse authors on shelves, multiple viewpoints in displays,
      culturally relevant materials.
   d) ONGOING PROFESSIONAL LEARNING: Does the room design allow the teacher to
      observe, reflect, and iterate? Teacher sightlines to all zones matter.`;
```

**Step 2: Verify TypeScript compiles**

Run: `cd "/Users/md/RedesignEd Classroom" && npx tsc --noEmit src/lib/research/portrait-of-graduate.ts 2>&1 | head -5`
Expected: No errors (or only unrelated errors from other files)

**Step 3: Commit**

```bash
git add src/lib/research/portrait-of-graduate.ts
git commit -m "feat: add NYS Portrait of a Graduate knowledge module"
```

---

### Task 2: Create Cognitive Science module

**Files:**
- Create: `src/lib/research/cognitive-science.ts`

**Step 1: Create the file**

```typescript
// ---------------------------------------------------------------------------
// Cognitive Science Research Parameters
// ---------------------------------------------------------------------------

export const COGNITIVE_SCIENCE_CONTEXT = `
8. COGNITIVE LOAD THEORY (Sweller, MANDATORY FOR PHOTO ANALYSIS):
   Human working memory is limited. Classroom environments must minimize unnecessary
   cognitive demands so students can focus on learning.

   a) EXTRANEOUS LOAD (eliminate — this is waste):
      Sources in classrooms: visual clutter on walls, competing focal points, outdated
      displays, glare on screens/whiteboards, disorganized layout, inconsistent signage.
      → Action: Flag any wall coverage exceeding 50%. Flag competing high-contrast
        elements in the primary instructional sightline. Recommend removal of outdated
        or decorative-only displays.

   b) INTRINSIC LOAD (respect — cannot be changed by design):
      Complex content requires more working memory. The physical environment must NOT
      compound this difficulty.
      → Action: During high-intrinsic tasks (new concepts, multi-step problems),
        recommend quieter zones with minimal visual distraction. Pair complex instruction
        with the calmest area of the room.

   c) GERMANE LOAD (maximize — this is productive learning):
      Cognitive effort devoted to constructing understanding. Free up capacity by
      reducing extraneous load, then scaffold with the environment.
      → Action: Recommend contextually placed reference materials (math vocabulary
        near math station, not across room). Recommend visible thinking routines
        and reflection prompts placed at point-of-use.

9. WORKING MEMORY LIMITS (Miller/Cowan, AGE-CALIBRATED THRESHOLDS):
   Working memory capacity varies by age. Apply these thresholds when analyzing
   a classroom photo or evaluating a layout design:

   QUANTITATIVE THRESHOLDS:
   ┌─────────────────────────────────────┬───────┬───────┬───────┬───────┐
   │ Parameter                           │ K-2   │ 3-5   │ 6-8   │ 9-12  │
   ├─────────────────────────────────────┼───────┼───────┼───────┼───────┤
   │ Max visual info units in sightline  │ 2-3   │ 3-4   │ 4-5   │ 4-5   │
   │ Recommended distinct zones          │ 3-4   │ 4-5   │ 5-6   │ 5-7   │
   │ Wall coverage ceiling               │ 30-40%│ 40-50%│ 40-50%│ 40-50%│
   │ Minimum negative/blank wall space   │ 50%   │ 40%   │ 35%   │ 30%   │
   └─────────────────────────────────────┴───────┴───────┴───────┴───────┘

   Use the learner profile to select the correct column. Flag violations.
   For students with ADHD or learning disabilities, shift thresholds down by 1 column.

10. HARVARD PROJECT ZERO — SPOTLIGHTING vs. VISUAL OVERLOAD:
    The environment is the "third teacher." It communicates what is valued.

    SPOTLIGHTING (good — do more of this):
    - Selective: Only a few things are highlighted at any time. If everything is
      highlighted, nothing is.
    - Intentional: Teacher has a clear purpose for what is displayed and where.
    - Current: Spotlighted content connects to ACTIVE learning, not past units.
    - Accessible: Placed where students naturally look, at age-appropriate heights.
    - Interactive: Invites students to engage, respond, or build upon what is shown.

    VISUAL OVERLOAD (bad — flag and fix):
    - Wall coverage exceeding 50-60% of available space.
    - No visual hierarchy: all items similar in size, color, and placement.
    - Commercial posters dominating over student-generated work.
    - Displays at every height with no resting zones for the eyes.
    - Ceiling-hung decorations creating overhead visual noise.
    - Every surface (cabinets, doors, windows) used as display space.

    KEY CITATION: Fisher et al. (2014), Carnegie Mellon University, published in
    Psychological Science — children in highly decorated classrooms spent 38% of
    instructional time off-task vs. 28% in sparse classrooms, with lower learning gains.

    EVALUATION CRITERIA FOR EVERY ROOM:
    - Spotlight ratio: ≥60% of displayed content should be current and learning-connected.
    - Student voice: Student-generated work should be prominent over commercial materials.
    - Process vs. product: Show drafts, thinking maps, questions — not just polished work.
    - Visual hierarchy: 1 clear primary focal point; secondary areas visually subordinate.
    - Negative space: ≥30-40% of wall space intentionally undecorated.
    - Environmental readability: A visitor should understand what is being learned
      just from the room.`;
```

**Step 2: Verify TypeScript compiles**

Run: `cd "/Users/md/RedesignEd Classroom" && npx tsc --noEmit src/lib/research/cognitive-science.ts 2>&1 | head -5`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/research/cognitive-science.ts
git commit -m "feat: add cognitive science research module (CLT, working memory, Project Zero)"
```

---

### Task 3: Create Curriculum Hub module

**Files:**
- Create: `src/lib/research/curriculum-hub.ts`

**Step 1: Create the file with K-5 scope & sequence data and 6-12 NYS standards**

```typescript
import type { LearnerProfile } from "@/types";

// ---------------------------------------------------------------------------
// Garden City K-5 Scope & Sequence + NYS 6-12 Standards Domains
// ---------------------------------------------------------------------------

interface CurriculumUnit {
  subject: string;
  unit: string;
  spatialImplication: string;
}

interface MonthlySchedule {
  [month: string]: CurriculumUnit[];
}

interface GradeCurriculum {
  grade: string;
  months: MonthlySchedule;
}

// ---- Kindergarten ----
const kindergarten: GradeCurriculum = {
  grade: "K",
  months: {
    September: [
      { subject: "Reading", unit: "We are Readers", spatialImplication: "Campfire with big-book easel; Cave nooks with individual book bins" },
      { subject: "Writing", unit: "Launching the Writing Workshop", spatialImplication: "Cave spaces with individual writing surfaces; Campfire for author's chair sharing" },
      { subject: "Math", unit: "Math in Our World", spatialImplication: "Life zone with manipulatives for hands-on counting and sorting" },
      { subject: "Science", unit: "Matter and its Interactions", spatialImplication: "Life zone for hands-on exploration; clear sightlines for safety during experiments" },
      { subject: "Social Studies", unit: "Rules and Getting Along – Our School Community", spatialImplication: "Campfire for community circle; Watering Hole for cooperative norm-building" },
    ],
    October: [
      { subject: "Reading", unit: "We are Readers / Emergent Reading", spatialImplication: "Campfire for shared reading; Cave corners with leveled text bins" },
      { subject: "Math", unit: "Numbers 1-10", spatialImplication: "Watering Hole tables with number manipulatives; Life zone for counting activities" },
    ],
    November: [
      { subject: "Reading", unit: "Emergent Reading—Looking Closely at Familiar Texts", spatialImplication: "Cave nooks with familiar text collections; Campfire for close reading modeling" },
      { subject: "Writing", unit: "Writing List and Label Books", spatialImplication: "Life zone with labeling materials; environmental print displays at child height" },
      { subject: "Math", unit: "Flat Shapes All Around Us", spatialImplication: "Life zone with shape manipulatives and exploration stations; documentation wall for shape discoveries" },
      { subject: "Social Studies", unit: "All About Me, Families", spatialImplication: "Documentation wall with family photos; Campfire for sharing stories" },
    ],
    December: [
      { subject: "Reading", unit: "Super Powers: Reading with Print Strategies", spatialImplication: "Strategy anchor charts at Campfire; Cave spaces for independent practice" },
      { subject: "Writing", unit: "Writing Pattern Books", spatialImplication: "Campfire for pattern modeling; Cave for independent writing with pattern templates" },
    ],
    January: [
      { subject: "Reading", unit: "Super Powers: Reading with Print Strategies (cont)", spatialImplication: "Strategy anchor charts near reading zones" },
      { subject: "Writing", unit: "Writing Pattern Books (cont)", spatialImplication: "Author's chair at Campfire for sharing patterns" },
      { subject: "Math", unit: "Understanding Addition and Subtraction", spatialImplication: "Watering Hole for partner math; Life zone with counters and ten-frames" },
      { subject: "Social Studies", unit: "Being a Good Citizen", spatialImplication: "Community meeting area; collaborative project space" },
    ],
    February: [
      { subject: "Reading", unit: "Bigger Books, Bigger Reading Muscles", spatialImplication: "Leveled library accessible from Cave spaces; Campfire for book talks" },
      { subject: "Writing", unit: "Informational Writing: Using Text Features", spatialImplication: "Life zone with nonfiction mentor texts; documentation wall for text feature examples" },
      { subject: "Math", unit: "Composing and Decomposing Numbers to 10", spatialImplication: "Watering Hole with part-part-whole mats; manipulative stations" },
    ],
    March: [
      { subject: "Reading", unit: "Bigger Books, Bigger Reading Muscles (cont)", spatialImplication: "Extended independent reading Cave time" },
      { subject: "Writing", unit: "Informational Writing (cont)", spatialImplication: "Research station with nonfiction resources near Watering Hole" },
      { subject: "Math", unit: "Numbers 0-20", spatialImplication: "Number line displays; counting corner in Life zone" },
      { subject: "Social Studies", unit: "Needs and Wants / Goods and Services", spatialImplication: "Life zone for pretend store/market; collaborative project area" },
    ],
    April: [
      { subject: "Reading", unit: "Becoming Avid Readers", spatialImplication: "Cozy Cave reading spots; student-curated book displays" },
      { subject: "Writing", unit: "Opinion Writing: Sharing Our Thoughts", spatialImplication: "Campfire for opinion sharing; Watering Hole for peer discussion" },
      { subject: "Math", unit: "Solid Shapes All Around Us", spatialImplication: "Life zone with 3D shape collection; hands-on building station" },
      { subject: "Science", unit: "Interdependent Relationships in Ecosystems", spatialImplication: "Observation station near windows; documentation wall for nature journals" },
    ],
    May: [
      { subject: "Reading", unit: "Becoming Avid Readers (cont)", spatialImplication: "Student-led book recommendations display" },
      { subject: "Writing", unit: "Opinion Writing (cont)", spatialImplication: "Publishing center; author celebration space" },
      { subject: "Math", unit: "Putting it All Together", spatialImplication: "Flexible stations rotating through all math zones" },
    ],
    June: [
      { subject: "Reading", unit: "Becoming Avid Readers (cont)", spatialImplication: "Celebration of reading life; student-curated classroom library" },
      { subject: "Writing", unit: "Perform, Celebrate, and Review", spatialImplication: "Campfire as performance/celebration stage; gallery walk displays" },
    ],
  },
};

// ---- Grade 1 ----
const grade1: GradeCurriculum = {
  grade: "1",
  months: {
    September: [
      { subject: "Reading", unit: "Building Good Reading Habits", spatialImplication: "Campfire for read-aloud modeling; Cave nooks for independent reading practice" },
      { subject: "Writing", unit: "Building a Community of Writers", spatialImplication: "Campfire for mini-lessons; individual writing spots in Cave areas" },
      { subject: "Math", unit: "Adding, Subtracting, and Working with Data", spatialImplication: "Watering Hole for data collection partners; Life zone with manipulatives" },
      { subject: "Social Studies", unit: "School and Classroom Citizenship", spatialImplication: "Community meeting area; collaborative norm-setting displays" },
    ],
    October: [
      { subject: "Reading", unit: "Word Detectives", spatialImplication: "Word work station in Life zone; phonics tools accessible from seats" },
      { subject: "Writing", unit: "Narrative Writing: Small Moments", spatialImplication: "Cave for drafting; Campfire for sharing small moment stories" },
      { subject: "Math", unit: "Addition and Subtraction Story Problems", spatialImplication: "Watering Hole for partner problem-solving; story problem anchor charts" },
      { subject: "Science", unit: "Space Systems: Patterns and Cycles", spatialImplication: "Observation area near windows; documentation wall for sky journals" },
    ],
    November: [
      { subject: "Reading", unit: "Word Detectives (cont)", spatialImplication: "Word wall at child height near reading zones" },
      { subject: "Writing", unit: "Small Moments (cont)", spatialImplication: "Author's chair celebration at Campfire" },
    ],
    December: [
      { subject: "Reading", unit: "Learning All about the World (nonfiction)", spatialImplication: "Nonfiction text sets at Watering Hole; research station" },
      { subject: "Writing", unit: "Informational Text Writing", spatialImplication: "Research materials near writing areas; mentor text displays" },
      { subject: "Math", unit: "Adding and Subtracting within 20", spatialImplication: "Math tool station with number lines, rekenreks, ten-frames" },
      { subject: "Social Studies", unit: "Families Now and Long Ago", spatialImplication: "Timeline display; family photo documentation wall" },
    ],
    January: [
      { subject: "Reading", unit: "Learning All about the World (cont)", spatialImplication: "Extended nonfiction browsing and research time" },
      { subject: "Writing", unit: "What's Your Opinion?", spatialImplication: "Debate/discussion area at Watering Hole; opinion charts at Campfire" },
    ],
    February: [
      { subject: "Writing", unit: "What's Your Opinion? (cont)", spatialImplication: "Persuasion displays; partner debate stations" },
      { subject: "Math", unit: "Numbers to 99", spatialImplication: "Hundred chart displays; place value manipulative station" },
      { subject: "Science", unit: "Waves: Light and Sound", spatialImplication: "Life zone for sound/light experiments; darkened Cave area for light exploration" },
    ],
    March: [
      { subject: "Reading", unit: "Readers Have Big Jobs to Do", spatialImplication: "Strategy charts near independent reading zones" },
      { subject: "Writing", unit: "Shared Research Writing", spatialImplication: "Watering Hole for collaborative research; shared writing easel at Campfire" },
      { subject: "Math", unit: "Adding within 100", spatialImplication: "Partner math stations with base-ten blocks" },
      { subject: "Social Studies", unit: "School Community", spatialImplication: "Community project display; collaborative planning area" },
    ],
    April: [
      { subject: "Reading", unit: "Readers Have Big Jobs to Do (cont)", spatialImplication: "Independent reading stamina — extended Cave time" },
      { subject: "Writing", unit: "Having Conversations with Characters Through Letters", spatialImplication: "Post office corner; character response journals in Cave" },
      { subject: "Math", unit: "Length Measurements within 120", spatialImplication: "Life zone with measurement tools; measuring stations around room" },
    ],
    May: [
      { subject: "Reading", unit: "Meeting Characters and Learning Lessons", spatialImplication: "Book club corners at Watering Hole; character study wall" },
      { subject: "Writing", unit: "Having Conversations with Characters (cont)", spatialImplication: "Gallery of character letters" },
      { subject: "Math", unit: "Geometry and Time", spatialImplication: "Shape exploration station; clock displays" },
      { subject: "Science", unit: "Structure, Functions and Information Processing", spatialImplication: "Life zone with models and specimens; observation tools" },
    ],
    June: [
      { subject: "Reading", unit: "Meeting Characters and Learning Lessons (cont)", spatialImplication: "Celebration of reading; student-recommended book displays" },
      { subject: "Writing", unit: "Poetry Writing / Revisit Small Moments", spatialImplication: "Poetry cafe performance area at Campfire; published poetry display" },
    ],
  },
};

// ---- Grade 2 ----
const grade2: GradeCurriculum = {
  grade: "2",
  months: {
    September: [
      { subject: "Reading", unit: "Reading Growth Spurts", spatialImplication: "Independent reading nooks; leveled library accessible from Cave" },
      { subject: "Writing", unit: "The Writing Revolution / Small Moments", spatialImplication: "Sentence-level work at desks; mentor sentence displays" },
      { subject: "Math", unit: "Adding, Subtracting, and Working with Data", spatialImplication: "Data collection stations; graphing wall at child height" },
      { subject: "Science", unit: "Structure and Properties of Matter (Material Magic)", spatialImplication: "Life zone for material testing; sorted materials station" },
      { subject: "Social Studies", unit: "Citizenship: Building Caring Communities", spatialImplication: "Community circle at Campfire; collaborative norm displays" },
    ],
    October: [
      { subject: "Reading", unit: "Reading Growth Spurts (cont)", spatialImplication: "Extended independent reading time in varied seating" },
      { subject: "Writing", unit: "Lessons from the Masters: Narrative Writing", spatialImplication: "Mentor text display wall; Cave for drafting" },
    ],
    November: [
      { subject: "Reading", unit: "Becoming Experts: Reading Nonfiction", spatialImplication: "Nonfiction text sets at Watering Hole tables; research tools" },
      { subject: "Writing", unit: "How-To Guide for Writing Nonfiction", spatialImplication: "Procedural writing station; step-by-step anchor charts" },
      { subject: "Social Studies", unit: "Urban, Suburban, and Rural Communities", spatialImplication: "Community comparison displays; map and photo stations" },
    ],
    December: [
      { subject: "Reading", unit: "Becoming Experts: Reading Nonfiction (cont)", spatialImplication: "Expert project displays; peer teaching stations" },
      { subject: "Writing", unit: "How-To Guide (cont)", spatialImplication: "Published how-to books displayed for peers" },
      { subject: "Math", unit: "Measuring Length", spatialImplication: "Measurement stations around room; rulers and tools accessible" },
      { subject: "Science", unit: "Earth's Systems: Processes that Shape the Earth", spatialImplication: "Observation and documentation station; earth materials exploration" },
    ],
    January: [
      { subject: "Reading", unit: "Growing Word Solving Muscles", spatialImplication: "Word work station; phonics tools near reading area" },
      { subject: "Writing", unit: "Realistic Fiction Stories", spatialImplication: "Story planning area; character development wall" },
      { subject: "Math", unit: "Addition and Subtraction on the Number Line", spatialImplication: "Floor number line; partner math stations" },
      { subject: "Social Studies", unit: "PBL Main Street / GC Then and Now", spatialImplication: "Project-based learning stations; collaborative build area in Life zone" },
    ],
    February: [
      { subject: "Reading", unit: "Characters and Their Stories", spatialImplication: "Character study wall; book club meeting spots at Watering Hole" },
      { subject: "Writing", unit: "Writing with Clarity", spatialImplication: "Revision station with editing tools; peer conferring area" },
      { subject: "Math", unit: "Numbers to 1,000", spatialImplication: "Place value station with expanded materials" },
    ],
    March: [
      { subject: "Reading", unit: "Characters and Their Stories (cont)", spatialImplication: "Character comparison charts; discussion stations" },
      { subject: "Writing", unit: "Writing with Clarity (cont)", spatialImplication: "Peer editing partnerships at Watering Hole" },
      { subject: "Math", unit: "Adding and Subtracting within 1,000", spatialImplication: "Strategy anchor charts; partner problem-solving stations" },
      { subject: "Science", unit: "Interdependent Relationships in Ecosystems (Animal Adventures)", spatialImplication: "Animal research station; habitat documentation displays" },
    ],
    April: [
      { subject: "Reading", unit: "Bigger Books Mean Amping Up Reading Power", spatialImplication: "Extended independent reading; comfortable varied seating" },
      { subject: "Writing", unit: "Nonfiction Research Writing", spatialImplication: "Research stations with multiple sources; note-taking area" },
      { subject: "Math", unit: "Geometry, Time, and Money", spatialImplication: "Shape and coin manipulative stations; clock displays" },
    ],
    May: [
      { subject: "Reading", unit: "Reading Nonfiction Cover to Cover", spatialImplication: "Nonfiction browsing bins; text feature reference charts" },
      { subject: "Writing", unit: "Opinion Writing: Writing About Reading", spatialImplication: "Evidence gathering station; opinion charts and debate area" },
      { subject: "Science", unit: "Interdependent Relationships in Ecosystems (Plant Adventures)", spatialImplication: "Plant observation station near windows; growth documentation wall" },
    ],
    June: [
      { subject: "Reading", unit: "Reading Nonfiction Cover to Cover (cont)", spatialImplication: "Celebration of nonfiction reading" },
      { subject: "Writing", unit: "Opinion Writing (cont)", spatialImplication: "Published opinion pieces gallery walk" },
      { subject: "Math", unit: "Equal Groups", spatialImplication: "Manipulative stations for grouping; array building area" },
    ],
  },
};

// ---- Grade 3 ----
const grade3: GradeCurriculum = {
  grade: "3",
  months: {
    September: [
      { subject: "Reading", unit: "Building a Reading Life", spatialImplication: "Classroom library launch; cozy reading zones in Cave areas" },
      { subject: "Writing", unit: "Crafting True Stories", spatialImplication: "Writer's notebook work in Cave; Campfire for mentor text study" },
      { subject: "Math", unit: "Introducing Multiplication", spatialImplication: "Array-building stations; Watering Hole for multiplication games" },
      { subject: "Science", unit: "Earth's Systems: Weather and Climate", spatialImplication: "Weather observation station near windows; data recording wall" },
      { subject: "Social Studies", unit: "Introduction to Geography", spatialImplication: "Map station; globe and atlas accessible; geography display wall" },
    ],
    October: [
      { subject: "Reading", unit: "Building a Reading Life / Mystery unit", spatialImplication: "Mystery genre bin; evidence tracking charts" },
      { subject: "Math", unit: "Area and Multiplication", spatialImplication: "Life zone with grid paper and tiles for area exploration" },
    ],
    November: [
      { subject: "Reading", unit: "Mystery / Reading to Learn (nonfiction)", spatialImplication: "Nonfiction research stations; note-taking tools" },
      { subject: "Writing", unit: "Crafting True Stories / Art of Informational Writing", spatialImplication: "Research corner; informational mentor texts displayed" },
      { subject: "Math", unit: "Wrapping Up Addition & Subtraction within 1000", spatialImplication: "Strategy reference charts; partner problem-solving" },
      { subject: "Social Studies", unit: "Introduction to Culture", spatialImplication: "Cultural artifact displays; comparison charts" },
    ],
    December: [
      { subject: "Reading", unit: "Reading to Learn / Character Studies", spatialImplication: "Character tracking walls; reading response journals in Cave" },
      { subject: "Writing", unit: "Art of Informational Writing / Baby Literary Essay", spatialImplication: "Essay planning area; evidence collection station" },
      { subject: "Science", unit: "Interdependent Relationships in Ecosystems", spatialImplication: "Ecosystem models; food web display; observation tools" },
      { subject: "Social Studies", unit: "Case Studies: Brazil, Africa, China", spatialImplication: "Country research stations; cultural comparison displays; map work area" },
    ],
    January: [
      { subject: "Reading", unit: "Character Studies / Research Clubs", spatialImplication: "Book club meeting corners; research materials at Watering Hole" },
      { subject: "Writing", unit: "Baby Literary Essay / Writing About Research", spatialImplication: "Thesis and evidence organizer charts; research materials" },
      { subject: "Math", unit: "Relating Multiplication to Division", spatialImplication: "Manipulative stations for grouping/sharing; fact family charts" },
    ],
    February: [
      { subject: "Reading", unit: "Research Clubs (Elephants, Penguins, Frogs)", spatialImplication: "Animal research stations with multiple text sets; club meeting areas" },
      { subject: "Writing", unit: "Changing the World (opinion/persuasion)", spatialImplication: "Debate area; persuasion anchor charts; opinion publishing center" },
      { subject: "Math", unit: "Fractions as Numbers", spatialImplication: "Fraction manipulative station; visual fraction wall" },
    ],
    March: [
      { subject: "Reading", unit: "Test Prep Unit", spatialImplication: "Individual testing practice in Cave; strategy reference charts visible" },
      { subject: "Writing", unit: "Test Prep — Constructed Response", spatialImplication: "CLEAR strategy anchor charts; individual response practice" },
      { subject: "Science", unit: "Forces and Interactions", spatialImplication: "Life zone for force experiments; push/pull testing stations" },
    ],
    April: [
      { subject: "Reading", unit: "Research Clubs (cont)", spatialImplication: "Extended research time; club presentation preparation" },
      { subject: "Writing", unit: "Writing About Research", spatialImplication: "Research writing stations with source materials" },
      { subject: "Math", unit: "Measuring Length, Time, Liquid Volume, & Weight", spatialImplication: "Measurement lab stations around room; tools organized by type" },
    ],
    May: [
      { subject: "Reading", unit: "Series Book Clubs", spatialImplication: "Book club corners with series sets; discussion fishbowl at Campfire" },
      { subject: "Writing", unit: "Once Upon a Time: Fairy Tales / Opinion Writing", spatialImplication: "Creative writing corner; fairy tale mentor texts; publishing center" },
      { subject: "Science", unit: "Inheritance and Variation of Traits", spatialImplication: "Trait comparison displays; observation and sorting stations" },
    ],
    June: [
      { subject: "Reading", unit: "Book Clubs (cont)", spatialImplication: "Reading celebration; student-curated recommendations" },
      { subject: "Math", unit: "Two-dimensional Shapes and Perimeter", spatialImplication: "Shape exploration with rulers and string; perimeter measurement stations" },
    ],
  },
};

// ---- Grade 4 ----
const grade4: GradeCurriculum = {
  grade: "4",
  months: {
    September: [
      { subject: "Reading", unit: "Interpreting Characters", spatialImplication: "Character study wall; book club prep zones at Watering Hole" },
      { subject: "Writing", unit: "The Arc of the Story: Realistic Fiction", spatialImplication: "Story planning area; draft revision station in Cave" },
      { subject: "Math", unit: "Fractions and Multiples", spatialImplication: "Fraction manipulative stations; visual models displayed" },
      { subject: "Science", unit: "Structure, Function & Information Processing", spatialImplication: "Life zone for dissection/model building; observation tools" },
      { subject: "Social Studies", unit: "The Geography of NYS", spatialImplication: "NYS map station; geographic feature displays; atlas area" },
    ],
    October: [
      { subject: "Reading", unit: "Interpreting Characters / Reading the World (Native American Study)", spatialImplication: "Culturally responsive text displays; multiple-perspective reading stations" },
      { subject: "Math", unit: "Fraction Equivalence and Comparison", spatialImplication: "Fraction comparison wall; hands-on equivalence tools" },
    ],
    November: [
      { subject: "Reading", unit: "Reading the World / Details and Synthesis", spatialImplication: "Nonfiction synthesis stations; note-taking and comparing sources" },
      { subject: "Writing", unit: "Boxes and Bullets: Personal and Persuasive Essays", spatialImplication: "Essay structure anchor charts; evidence organization station" },
    ],
    December: [
      { subject: "Writing", unit: "Personal and Persuasive Essays (cont)", spatialImplication: "Peer revision at Watering Hole; publishing center" },
      { subject: "Math", unit: "Extending Operations to Fractions", spatialImplication: "Fraction operation stations with visual models" },
      { subject: "Science", unit: "Energy", spatialImplication: "Energy transformation stations in Life zone; circuit-building area" },
      { subject: "Social Studies", unit: "Native Americans: First Inhabitants of NYS", spatialImplication: "Primary source station; cultural artifact displays; multiple perspectives" },
    ],
    January: [
      { subject: "Reading", unit: "Reading History — The American Revolution", spatialImplication: "Historical text sets; timeline display; primary source station" },
      { subject: "Writing", unit: "Literary Essay: Writing About Fiction", spatialImplication: "Text evidence gathering station; essay planning area" },
      { subject: "Math", unit: "From Hundredths to Hundred-thousands", spatialImplication: "Place value station; decimal and large number displays" },
    ],
    February: [
      { subject: "Reading", unit: "Reading History (cont)", spatialImplication: "Historical debate area; multiple-perspective text displays" },
      { subject: "Writing", unit: "Literary Essay (cont)", spatialImplication: "Peer review at Watering Hole; published essays displayed" },
      { subject: "Math", unit: "Multiplicative Comparison and Measurement", spatialImplication: "Measurement tools station; comparison problem-solving area" },
    ],
    March: [
      { subject: "Reading", unit: "Test Prep Unit", spatialImplication: "Individual practice in Cave; strategy reference charts" },
      { subject: "Writing", unit: "Test Prep — Constructed Response", spatialImplication: "CLEAR strategy displays; independent response practice" },
      { subject: "Math", unit: "Multiplying and Dividing Multi-digit Numbers", spatialImplication: "Algorithm reference charts; practice stations" },
      { subject: "Social Studies", unit: "Museum of the History of NY — PBL", spatialImplication: "Project-based stations in Life zone; exhibit creation area; collaborative build space" },
    ],
    April: [
      { subject: "Reading", unit: "Power and Perspective", spatialImplication: "Critical literacy displays; multiple-viewpoint text sets" },
      { subject: "Writing", unit: "Bringing History to Life", spatialImplication: "Historical narrative writing station; research materials" },
      { subject: "Math", unit: "Angles and Angle Measurement", spatialImplication: "Protractor station; angle-finding scavenger hunt displays" },
      { subject: "Science", unit: "Waves: Waves and Information", spatialImplication: "Wave demonstration stations; sound and light exploration in Life zone" },
    ],
    May: [
      { subject: "Reading", unit: "Power and Perspective / Historical Fiction Book Clubs", spatialImplication: "Book club meeting zones; perspective comparison wall" },
      { subject: "Math", unit: "Properties of Two-dimensional Shapes", spatialImplication: "Shape classification station; geometric tool area" },
      { subject: "Science", unit: "Earth's Systems: Processes that Shape the World", spatialImplication: "Earth process models; erosion experiment stations" },
    ],
    June: [
      { subject: "Reading", unit: "Historical Fiction Book Clubs (cont)", spatialImplication: "Reading celebration; student book recommendations" },
      { subject: "Writing", unit: "Notebooks to Projects", spatialImplication: "Choice writing stations; portfolio review area; publishing center" },
    ],
  },
};

// ---- Grade 5 ----
const grade5: GradeCurriculum = {
  grade: "5",
  months: {
    September: [
      { subject: "Reading", unit: "Maintaining an Independent Reading Life / Notice and Note", spatialImplication: "Classroom library with signpost reference charts; extended Cave reading" },
      { subject: "Writing", unit: "Narrative Craft", spatialImplication: "Craft technique anchor charts; mentor text station; drafting in Cave" },
      { subject: "Math", unit: "Finding Volume", spatialImplication: "Life zone with cubic units and 3D models; volume building station" },
      { subject: "Science", unit: "Matter and Energy in Organisms and Ecosystems", spatialImplication: "Ecosystem investigation stations; food web displays; observation tools" },
      { subject: "Social Studies", unit: "Geography of the Western Hemisphere", spatialImplication: "Map and atlas station; geographic comparison displays; globe area" },
    ],
    October: [
      { subject: "Reading", unit: "Interpretation Book Clubs", spatialImplication: "Book club meeting zones at Watering Hole; interpretation charts" },
      { subject: "Writing", unit: "Narrative Craft (cont) / Journalism", spatialImplication: "Newsroom-style layout; interview stations; publishing area" },
      { subject: "Math", unit: "Fractions as Quotients and Fraction Multiplication", spatialImplication: "Fraction visual model displays; manipulative stations" },
    ],
    November: [
      { subject: "Reading", unit: "Tackling Complexity: Nonfiction", spatialImplication: "Complex text stations with annotation tools; research corners" },
      { subject: "Writing", unit: "Journalism (cont)", spatialImplication: "Peer editing stations; publication display wall" },
      { subject: "Math", unit: "Multiplying and Dividing Fractions", spatialImplication: "Visual fraction operation displays; practice stations" },
      { subject: "Social Studies", unit: "Ancient Civilizations", spatialImplication: "Civilization comparison displays; primary source station; artifact study area" },
    ],
    December: [
      { subject: "Reading", unit: "Tackling Complexity (cont) / Argument and Advocacy", spatialImplication: "Debate preparation area; evidence gathering stations" },
      { subject: "Writing", unit: "Literary Essay", spatialImplication: "Essay structure charts; text evidence organization station" },
      { subject: "Math", unit: "Wrapping Up Multiplication & Division with Multi-Digit Numbers", spatialImplication: "Algorithm reference wall; independent practice stations" },
      { subject: "Science", unit: "Structure and Properties of Matter", spatialImplication: "Matter testing stations in Life zone; property recording charts" },
    ],
    January: [
      { subject: "Reading", unit: "Argument and Advocacy", spatialImplication: "Debate area at Campfire; evidence collection stations; persuasion wall" },
      { subject: "Writing", unit: "Informational Research-based Argument Essay", spatialImplication: "Research stations with multiple sources; argument planning area" },
      { subject: "Math", unit: "Place Value Patterns and Decimal Operations", spatialImplication: "Decimal place value displays; money and measurement connections" },
      { subject: "Social Studies", unit: "The Age of Exploration", spatialImplication: "Exploration route maps; primary source documents; perspective analysis station" },
    ],
    February: [
      { subject: "Reading", unit: "Argument and Advocacy (cont)", spatialImplication: "Student advocacy project displays; presentation prep area" },
      { subject: "Writing", unit: "Research-based Argument Essay (cont)", spatialImplication: "Peer review stations; evidence quality charts" },
    ],
    March: [
      { subject: "Reading", unit: "Test Prep Unit", spatialImplication: "Individual practice stations; strategy reference charts visible" },
      { subject: "Writing", unit: "Test Prep — Constructed Response", spatialImplication: "CLEAR strategy displays; timed practice in Cave zones" },
      { subject: "Math", unit: "More Decimal and Fraction Operations", spatialImplication: "Decimal-fraction connection displays; practice stations" },
      { subject: "Science", unit: "Earth Systems", spatialImplication: "Earth layer models; rock cycle stations; erosion experiments" },
    ],
    April: [
      { subject: "Reading", unit: "Reading in the Content Area: We the People", spatialImplication: "Civic text sets; constitutional document displays; discussion circles" },
      { subject: "Writing", unit: "Lens of History Writing: We The People", spatialImplication: "Historical writing station; primary source analysis area" },
      { subject: "Math", unit: "Shapes on the Coordinate Plane", spatialImplication: "Coordinate grid displays; graphing station; geometry tools" },
    ],
    May: [
      { subject: "Reading", unit: "Fantasy Book Clubs Revisited", spatialImplication: "Fantasy genre section; book club corners; world-building displays" },
      { subject: "Writing", unit: "Choice Writing: Portfolio Review", spatialImplication: "Portfolio review stations; genre choice areas; publishing center" },
      { subject: "Science", unit: "Space Systems: Stars and the Solar System", spatialImplication: "Solar system display; scale model area; observation log station" },
    ],
    June: [
      { subject: "Writing", unit: "Choice Writing (cont)", spatialImplication: "Author celebration; gallery walk of published work" },
      { subject: "Math", unit: "Preparing for Grade 6 (PEMDAS, division)", spatialImplication: "Transition-focused reference charts; independent practice stations" },
    ],
  },
};

// ---- NYS Standards Domains for Grades 6-12 ----

interface StandardsDomain {
  subject: string;
  domains: string[];
  spatialImplication: string;
}

const grades6to8Standards: StandardsDomain[] = [
  {
    subject: "ELA",
    domains: ["Reading Literature", "Reading Informational Text", "Writing (Argument, Informational, Narrative)", "Speaking & Listening", "Language"],
    spatialImplication: "Socratic seminar circles; evidence-based discussion areas at Watering Hole; independent close-reading Cave zones; research stations with multiple source types",
  },
  {
    subject: "Math",
    domains: ["Ratios & Proportional Relationships", "The Number System", "Expressions & Equations", "Geometry", "Statistics & Probability"],
    spatialImplication: "Collaborative problem-solving stations at Watering Hole; visual model reference displays; geometry tool stations; data collection and analysis areas",
  },
  {
    subject: "Science (NYSSLS)",
    domains: ["Physical Science", "Life Science", "Earth & Space Science", "Engineering Design"],
    spatialImplication: "Lab stations in Life zone with safety sightlines; engineering design/prototyping area; data recording stations; observation and documentation walls",
  },
  {
    subject: "Social Studies",
    domains: ["Geography", "World History", "Civics/Government", "Economics"],
    spatialImplication: "Primary source analysis stations; map and data displays; debate and deliberation areas at Campfire; collaborative research zones",
  },
];

const grades9to12Standards: StandardsDomain[] = [
  {
    subject: "ELA",
    domains: ["Reading Literature", "Reading Informational Text", "Writing (Argument, Research, Narrative)", "Speaking & Listening", "Language", "Literacy in History/Social Studies and Science/Technical Subjects"],
    spatialImplication: "Seminar-style discussion arrangement; independent research stations; peer review zones at Watering Hole; presentation area with technology access",
  },
  {
    subject: "Math",
    domains: ["Algebra", "Functions", "Geometry", "Number & Quantity", "Statistics & Probability", "Modeling"],
    spatialImplication: "Whiteboard-accessible collaborative stations; technology stations for graphing and modeling; individual problem-solving Cave zones; peer tutoring pairs",
  },
  {
    subject: "Science (NYSSLS)",
    domains: ["Biology", "Chemistry", "Physics", "Earth Science", "Engineering Design"],
    spatialImplication: "Lab stations with proper safety zones and sightlines; engineering design workspace; data analysis stations with technology; scientific discourse area",
  },
  {
    subject: "Social Studies",
    domains: ["Global History & Geography", "US History", "Government & Civics", "Economics", "Participation in Government"],
    spatialImplication: "Document-based inquiry stations; deliberation and debate area; collaborative research zones; presentation space for civic projects",
  },
];

// ---- All grade data ----
const allCurricula: GradeCurriculum[] = [kindergarten, grade1, grade2, grade3, grade4, grade5];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function getGradesForProfile(profile: LearnerProfile): string[] {
  switch (profile) {
    case "UPK": return ["K"];
    case "K-1": return ["K", "1"];
    case "2-5": return ["2", "3", "4", "5"];
    case "6-8": return ["6-8"];
    case "9-12": return ["9-12"];
    case "Adult Learners": return ["9-12"];
    case "Custom": return [];
    default: return [];
  }
}

function getCurrentMonth(): string {
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
  return months[new Date().getMonth()];
}

/**
 * Returns a prompt-ready string with curriculum context for the given learner profile.
 * Uses the current month to highlight what's actively being taught.
 */
export function getCurriculumContext(profile: LearnerProfile, month?: string): string {
  const targetMonth = month || getCurrentMonth();
  const grades = getGradesForProfile(profile);

  if (grades.length === 0) {
    return "No specific curriculum data available for this learner profile.";
  }

  // For 6-12, use NYS standards domains
  if (grades.includes("6-8")) {
    const domains = grades6to8Standards
      .map(s => `   - ${s.subject}: ${s.domains.join(", ")}\n     → ${s.spatialImplication}`)
      .join("\n");
    return `CURRICULUM CONTEXT (NYS Standards, Grades 6-8):\n   Current month: ${targetMonth}\n${domains}\n   Note: Use NYS Next Generation Learning Standards domains to connect spatial recommendations to academic content.`;
  }

  if (grades.includes("9-12")) {
    const domains = grades9to12Standards
      .map(s => `   - ${s.subject}: ${s.domains.join(", ")}\n     → ${s.spatialImplication}`)
      .join("\n");
    return `CURRICULUM CONTEXT (NYS Standards, Grades 9-12):\n   Current month: ${targetMonth}\n${domains}\n   Note: Use NYS Next Generation Learning Standards domains to connect spatial recommendations to academic content.`;
  }

  // For K-5, use Garden City scope & sequence
  const lines: string[] = [`CURRICULUM CONTEXT (Garden City Public Schools, ${targetMonth}):`];
  lines.push(`   The following units are currently being taught. Reference these when making spatial recommendations:`);

  for (const gradeKey of grades) {
    const curriculum = allCurricula.find(c => c.grade === gradeKey);
    if (!curriculum) continue;

    const monthData = curriculum.months[targetMonth];
    if (!monthData || monthData.length === 0) {
      lines.push(`   Grade ${gradeKey}: No specific units listed for ${targetMonth}.`);
      continue;
    }

    lines.push(`   Grade ${gradeKey}:`);
    for (const entry of monthData) {
      lines.push(`   - ${entry.subject}: "${entry.unit}" → ${entry.spatialImplication}`);
    }
  }

  return lines.join("\n");
}
```

**Step 2: Verify TypeScript compiles**

Run: `cd "/Users/md/RedesignEd Classroom" && npx tsc --noEmit src/lib/research/curriculum-hub.ts 2>&1 | head -10`
Expected: No errors (or only unrelated errors)

**Step 3: Commit**

```bash
git add src/lib/research/curriculum-hub.ts
git commit -m "feat: add Curriculum Hub module with K-5 scope & sequence and 6-12 NYS standards"
```

---

### Task 4: Compose modules into RESEARCH_CONTEXT and update prompt builders

**Files:**
- Modify: `src/lib/research/prompts.ts`

**Step 1: Add imports at top of file (after existing import)**

After line 1 (`import type { WizardState } from "@/types";`), add:

```typescript
import { PORTRAIT_OF_GRADUATE } from "./portrait-of-graduate";
import { COGNITIVE_SCIENCE_CONTEXT } from "./cognitive-science";
import { getCurriculumContext } from "./curriculum-hub";
```

**Step 2: Expand RESEARCH_CONTEXT**

Replace the existing `RESEARCH_CONTEXT` constant (lines 7-28) with:

```typescript
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
```

**Step 3: Add curriculum context to `buildAnalysisPrompt`**

In the `buildAnalysisPrompt` function, add a curriculum line to the TEACHER CONTEXT section. After the line:
```
- Goals / Constraints: ${state.goals || "None specified"}
```
Add:
```
- ${getCurriculumContext(state.learnerProfile)}
```

**Step 4: Add curriculum context to all other prompt builders**

Add the same `- ${getCurriculumContext(state.learnerProfile)}` line to the CONTEXT section of each prompt builder function:
- `buildGrantPrompt` — after `Teacher Goals` line
- `buildLessonPrompt` — after `Available Furniture` line
- `buildNormsPrompt` — after `Teacher Goals` line
- `buildDnaPrompt` — after `Teacher Goals` line
- `buildPhilosopherCritiquePrompt` — after `Teacher Goals` line
- `buildMovementHeatmapPrompt` — after `Teacher Goals` line
- `buildBudgetOptimizerPrompt` — after `Teacher Goals` line
- `buildSeasonalCalendarPrompt` — after `Teacher Goals` line
- `buildPrincipalEmailPrompt` — after `Teacher Goals` line
- `buildSeatPerspectivePrompt` — after `Teacher Goals` line
- `buildSoundZonesPrompt` — after `Teacher Goals` line

Each addition looks like:
```
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}
```

**Step 5: Verify the full app compiles**

Run: `cd "/Users/md/RedesignEd Classroom" && npx next build 2>&1 | tail -20`
Expected: Build succeeds

**Step 6: Commit**

```bash
git add src/lib/research/prompts.ts
git commit -m "feat: compose Portrait of Graduate, cognitive science, and curriculum into all AI prompts"
```

---

### Task 5: Update Learning Hub data (display layer)

**Files:**
- Modify: `src/lib/research/data.ts`

**Step 1: Add Portrait of a Graduate data after the `statistics` array**

```typescript
// ---------------------------------------------------------------------------
// Portrait of a Graduate Competencies
// ---------------------------------------------------------------------------

export interface GraduateCompetency {
  title: string;
  description: string;
  spatialImplication: string;
  color: string;
}

export const graduateCompetencies: GraduateCompetency[] = [
  {
    title: "Academically Prepared",
    description:
      "Demonstrates a strong foundation in the NYS learning standards and is equipped with the knowledge and skills necessary to achieve success in college, careers, civic engagement, service, and life.",
    spatialImplication:
      "Dedicated instructional zones with clear sightlines to teaching surfaces and organized, accessible reference materials.",
    color: "blue",
  },
  {
    title: "Effective Communicator",
    description:
      "Articulates ideas clearly and confidently through speaking, writing, and the use of different types of media for various purposes, while engaging with diverse audiences and actively listening to different perspectives.",
    spatialImplication:
      "Watering Hole clusters for peer discourse, Campfire areas with presentation space, and documentation walls displaying student communication.",
    color: "amber",
  },
  {
    title: "Creative Innovator",
    description:
      "Utilizes imagination, curiosity, and flexible thinking to solve problems creatively, and develop new ideas and products, while adapting to evolving circumstances and challenges.",
    spatialImplication:
      "Life/maker zones with reconfigurable furniture, loose-parts stations, and prototyping areas with accessible materials.",
    color: "green",
  },
  {
    title: "Global Citizen",
    description:
      "Acts responsibly and ethically within local, global, and digital communities, employing civic knowledge, skills, and mindsets to promote global sustainability and contribute positively to a culturally diverse, democratic society.",
    spatialImplication:
      "Community gathering spaces, global and cultural displays, and collaborative project areas that mirror real-world civic engagement.",
    color: "indigo",
  },
  {
    title: "Critical Thinker",
    description:
      "Analyzes information thoughtfully, evaluates evidence critically, and identifies patterns and connections between different pieces of information across multiple content areas to address complex issues and navigate the world with insight.",
    spatialImplication:
      "Multi-source reference stations, Socratic circle arrangements, and visible thinking routine displays near collaborative zones.",
    color: "purple",
  },
  {
    title: "Reflective and Future Focused",
    description:
      "Engages in self-reflection to identify strengths and areas for growth, sets meaningful goals, uses social awareness to maintain supportive relationships, and demonstrates responsible decision-making that prioritizes social, emotional, and mental well-being.",
    spatialImplication:
      "Cave spaces for individual reflection, SEL/peace corners, goal-setting displays, and quiet retreat areas.",
    color: "rose",
  },
];
```

**Step 2: Add cognitive science summary data**

```typescript
// ---------------------------------------------------------------------------
// Cognitive Science Principles
// ---------------------------------------------------------------------------

export interface CognitivePrinciple {
  title: string;
  source: string;
  description: string;
  designImplication: string;
  color: string;
}

export const cognitivePrinciples: CognitivePrinciple[] = [
  {
    title: "Extraneous Cognitive Load",
    source: "Sweller, Cognitive Load Theory",
    description:
      "Cognitive effort wasted on processing irrelevant stimuli — visual clutter, competing focal points, outdated displays, glare, and disorganized layouts all consume working memory that should be devoted to learning.",
    designImplication:
      "Keep wall coverage under 50%. Ensure one clear focal point in the primary instructional sightline. Remove outdated or decorative-only displays.",
    color: "rose",
  },
  {
    title: "Working Memory Capacity",
    source: "Miller (1956), Cowan (2001)",
    description:
      "Students can hold only 3-5 chunks of information in working memory at once (fewer for younger learners: 2-3 for K-2). Every competing visual element in a student's field of view consumes a chunk.",
    designImplication:
      "Limit distinct visual information units in the primary sightline to 3-5 (2-3 for early elementary). Group wall content into clear visual clusters to reduce effective chunk count.",
    color: "amber",
  },
  {
    title: "Spotlighting over Visual Overload",
    source: "Harvard Project Zero; Fisher et al. (2014)",
    description:
      "Selective, intentional display of current learning content (spotlighting) outperforms environments where every surface is covered. Students in highly decorated rooms spend 38% of time off-task vs. 28% in intentionally sparse rooms.",
    designImplication:
      "Display selectively: 60%+ of content should connect to active learning. Prioritize student-generated work over commercial posters. Maintain 30-40% intentional negative space on walls.",
    color: "blue",
  },
];
```

**Step 3: Verify TypeScript compiles**

Run: `cd "/Users/md/RedesignEd Classroom" && npx tsc --noEmit src/lib/research/data.ts 2>&1 | head -5`
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/research/data.ts
git commit -m "feat: add Portrait of Graduate and cognitive science display data"
```

---

### Task 6: Final build verification

**Step 1: Run full build**

Run: `cd "/Users/md/RedesignEd Classroom" && npx next build 2>&1 | tail -30`
Expected: Build succeeds with no errors

**Step 2: Verify prompt output manually**

Run a quick check that the composed RESEARCH_CONTEXT contains all sections:

```bash
cd "/Users/md/RedesignEd Classroom" && node -e "
const { RESEARCH_CONTEXT } = require('./src/lib/research/prompts');
console.log('--- Sections found ---');
console.log('Thornburg:', RESEARCH_CONTEXT.includes('THORNBURG'));
console.log('Portrait:', RESEARCH_CONTEXT.includes('PORTRAIT OF A GRADUATE'));
console.log('Cognitive Load:', RESEARCH_CONTEXT.includes('COGNITIVE LOAD THEORY'));
console.log('Working Memory:', RESEARCH_CONTEXT.includes('WORKING MEMORY LIMITS'));
console.log('Project Zero:', RESEARCH_CONTEXT.includes('SPOTLIGHTING'));
console.log('Total length:', RESEARCH_CONTEXT.length, 'chars');
"
```

Expected: All `true`, total length roughly 6000-8000 chars.

**Step 3: Verify curriculum context function**

```bash
cd "/Users/md/RedesignEd Classroom" && node -e "
const { getCurriculumContext } = require('./src/lib/research/curriculum-hub');
console.log('--- K-1 March ---');
console.log(getCurriculumContext('K-1', 'March').substring(0, 500));
console.log('--- 6-8 ---');
console.log(getCurriculumContext('6-8').substring(0, 500));
"
```

Expected: Grade-appropriate curriculum context for each profile.

**Step 4: Commit (if any fixes were needed)**

If build or verification revealed issues, fix and commit:
```bash
git add -A && git commit -m "fix: address build issues in knowledge base integration"
```
