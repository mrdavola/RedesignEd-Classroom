# Knowledge Base Integration Design

**Date:** 2026-03-14
**Status:** Approved

## Overview

Integrate three new knowledge domains into the app's AI prompt system so every classroom analysis, layout recommendation, and tool output is grounded in district frameworks, curriculum alignment, and cognitive science research.

## Three Integration Domains

### 1. NYS Portrait of a Graduate

The NYS culturally responsive graduate framework defines six competencies every graduate should demonstrate. Each competency maps to spatial design implications:

| Competency | Spatial Design Implication |
|---|---|
| **Academically Prepared** | Strong instructional zones aligned to NYS standards |
| **Effective Communicator** | Watering Hole and Campfire zones with presentation areas |
| **Creative Innovator** | Life/maker zones and reconfigurable spaces |
| **Global Citizen** | Documentation walls, global displays, community gathering spaces |
| **Critical Thinker** | Multi-source reference stations, Socratic circle arrangements |
| **Reflective and Future Focused** | Cave spaces and SEL corners |

Also includes the four CR-S principles (Welcoming Environment, High Expectations, Inclusive Curriculum, Ongoing Professional Learning) as a lens for evaluating culturally responsive room design.

Every AI response connects at least one spatial recommendation to a Portrait competency.

### 2. Curriculum Hub

**K-5 (Garden City scope & sequence):** Structured typed data organized as grade > subject > month > unit, with a `spatialImplication` hint per unit. Sourced from district scope & sequence documents for grades K through 5.

**6-12 (NYS standards domains):** Lighter-touch integration using NYS Next Generation Learning Standards domains organized by grade band (6-8, 9-12) and subject (ELA, Math, Science, Social Studies). Each domain gets a brief spatial implication.

A `getCurriculumContext(learnerProfile, month?)` function returns a prompt-ready string with grade-appropriate curriculum context. Uses the current month to highlight what's actively being taught.

### 3. Cognitive Science Research Parameters

**Cognitive Load Theory (Sweller):**
- Extraneous load: Flag visual clutter, competing focal points, outdated displays, glare, ambiguous layout
- Intrinsic load: Recommend quieter zones during high-complexity tasks
- Germane load: Recommend intentional display placement, clear visual hierarchies, contextual reference materials

**Working Memory Limits (Miller/Cowan, age-calibrated):**

| Parameter | K-2 | 3-5 | 6-8 | 9-12 |
|---|---|---|---|---|
| Max visual info units in primary sightline | 2-3 | 3-4 | 4-5 | 4-5 |
| Recommended distinct zones | 3-4 | 4-5 | 5-6 | 5-7 |
| Wall coverage ceiling | 30-40% | 40-50% | 40-50% | 40-50% |
| Minimum negative space | 50% | 40% | 35% | 30% |

**Harvard Project Zero -- Spotlighting vs. Visual Overload:**
- Spotlight ratio: Displayed content must be selective, current, and intentional
- Student voice visibility: Student-generated work should dominate over commercial posters
- Process vs. product: Rooms should show thinking in progress, not only polished work
- Visual hierarchy: One clear primary focal point with subordinate secondary/tertiary areas
- Environmental readability: A visitor should understand what's being learned from the room alone
- Key citation: Fisher et al. (2014) Carnegie Mellon -- students in highly decorated classrooms spent 38% of time off-task vs. 28% in sparse rooms

## Architecture

### New Files

| File | Exports | Purpose |
|---|---|---|
| `src/lib/research/portrait-of-graduate.ts` | `PORTRAIT_OF_GRADUATE` string constant | NYS Portrait framework + CR-S principles |
| `src/lib/research/cognitive-science.ts` | `COGNITIVE_SCIENCE_CONTEXT` string constant | CLT, working memory thresholds, Project Zero |
| `src/lib/research/curriculum-hub.ts` | `getCurriculumContext(grade, month?)` function | Grade-specific curriculum context for prompts |

### Modified Files

| File | Change |
|---|---|
| `src/lib/research/prompts.ts` | Import new modules, compose into expanded `RESEARCH_CONTEXT`. Add `getCurriculumContext()` call to teacher context section of each prompt builder. |

### Unchanged Files

- `src/lib/ai/claude.ts` -- no changes
- `src/app/api/analyze/route.ts` -- no changes
- `src/app/api/tools/route.ts` -- no changes
- All component files -- no changes
- Type definitions -- no changes

### Composition

```
RESEARCH_CONTEXT = [
  EXISTING_RESEARCH        (Thornburg, neurodiversity, statistics, pedagogy-space fit, Rosan Bosch)
  PORTRAIT_OF_GRADUATE     (6 competencies + CR-S principles)
  COGNITIVE_SCIENCE_CONTEXT (CLT, working memory, Project Zero)
].join('\n\n')
```

Curriculum context injected per-request into teacher context:
```
- Current Curriculum: ${getCurriculumContext(state.learnerProfile)}
```

## Data Sources

- Portrait of a Graduate: NYS Board of Regents adopted framework (July 2025)
- K-5 Curriculum: Garden City Public Schools scope & sequence documents (K, 1, 2, 3, 4, 5)
- 6-12 Standards: NYS Next Generation Learning Standards by grade band
- Cognitive Load Theory: Sweller (1988, 1994, 2011)
- Working Memory: Miller (1956), Cowan (2001, 2010), Baddeley (1974, 2000)
- Visual Environment: Fisher et al. (2014), Psychological Science
- Project Zero: Harvard Graduate School of Education, Cultures of Thinking (Ritchhart, 2015)
