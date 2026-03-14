import type { Philosophy } from "@/types";

// ---------------------------------------------------------------------------
// Thornburg's Archetypes
// ---------------------------------------------------------------------------

export interface ResearchCard {
  title: string;
  subtitle: string;
  description: string;
  designImplication: string;
  color: string;
}

export const archetypes: ResearchCard[] = [
  {
    title: "Campfire",
    subtitle: "One-to-Many Instruction",
    description:
      "A focal gathering space where a teacher or storyteller shares knowledge with the group. Modeled after the ancient tradition of gathering around a fire to learn from an expert.",
    designImplication:
      "Create a clear focal point with semi-circular or U-shaped seating so every learner has a sightline to the presenter.",
    color: "amber",
  },
  {
    title: "Watering Hole",
    subtitle: "Many-to-Many Discourse",
    description:
      "An informal social space where peers exchange ideas freely. Inspired by the natural gathering point where community members share news and negotiate meaning together.",
    designImplication:
      "Cluster desks or tables in small groups (3-5) with writable surfaces nearby to encourage spontaneous collaboration.",
    color: "blue",
  },
  {
    title: "Cave",
    subtitle: "Individual Reflection",
    description:
      "A quiet, enclosed retreat for solitary thought and deep focus. Essential for introverts and neurodivergent learners who need reduced sensory input to process information.",
    designImplication:
      "Provide screened-off nooks, reading corners, or partitioned areas with soft lighting and minimal visual clutter.",
    color: "purple",
  },
];

// ---------------------------------------------------------------------------
// Philosophies
// ---------------------------------------------------------------------------

export interface PhilosophyInfo {
  id: Philosophy;
  label: string;
  color: string;
  icon: string;
  shortDescription: string;
  researchHint: string;
  layoutDescription: string;
}

export const philosophies: PhilosophyInfo[] = [
  {
    id: "Flexible",
    label: "Flexible",
    color: "green",
    icon: "Shuffle",
    shortDescription:
      "Reconfigurable spaces that shift between lecture, group work, and independent study throughout the day.",
    researchHint:
      "Research shows flexible seating increases engagement by 48% when combined with student choice protocols (Barrett et al., 2015).",
    layoutDescription:
      "Multiple zones that can be rapidly reconfigured: a campfire area with movable chairs, clustered tables for watering holes, and quiet nooks for caves.",
  },
  {
    id: "Socratic",
    label: "Socratic",
    color: "indigo",
    icon: "MessageCircle",
    shortDescription:
      "Dialogue-centered layouts optimized for Harkness-style discussion and inquiry-based questioning.",
    researchHint:
      "Hattie's meta-analysis rates classroom discussion at d=0.82 -- one of the highest effect sizes in education.",
    layoutDescription:
      "Central oval or circular arrangement where all participants face each other, with a secondary breakout zone for small-group Socratic circles.",
  },
  {
    id: "Inclusive",
    label: "Inclusive",
    color: "purple",
    icon: "Heart",
    shortDescription:
      "Universal Design for Learning (UDL) spaces with sensory zones, quiet retreats, and movement-friendly paths.",
    researchHint:
      "The 'Sensory Paradox': open spaces help ADHD (movement) but can trigger anxiety in autism (need predictability). Solution: nooks and retreats are necessities, not luxuries.",
    layoutDescription:
      "Acoustic zones with clear visual boundaries, sensory retreat nooks, wide movement corridors, and adjustable lighting areas.",
  },
  {
    id: "Reggio Emilia",
    label: "Reggio Emilia",
    color: "amber",
    icon: "Leaf",
    shortDescription:
      "The environment as the 'third teacher' -- natural materials, documentation walls, and atelier spaces.",
    researchHint:
      "Reggio philosophy treats space as a living document of learning. Visible documentation increases metacognition and parent engagement.",
    layoutDescription:
      "Open ateliers with natural light, documentation walls at child height, loose-parts stations, and a central piazza for community gathering.",
  },
  {
    id: "Montessori-Inspired",
    label: "Montessori-Inspired",
    color: "rose",
    icon: "Grid3x3",
    shortDescription:
      "Ordered, child-accessible materials on low shelves with defined work areas for self-directed activity.",
    researchHint:
      "Montessori classrooms with properly arranged materials show higher executive function scores (Lillard & Else-Quest, 2006).",
    layoutDescription:
      "Low open shelving around perimeter, individual work mats/rugs, small grouped tables, a peace corner, and clearly labeled material zones.",
  },
  {
    id: "STEAM/Maker",
    label: "STEAM / Maker",
    color: "blue",
    icon: "Wrench",
    shortDescription:
      "Workshop-style spaces with maker stations, prototyping areas, and integrated technology zones.",
    researchHint:
      "MIT's TEAL Project showed active-learning maker layouts reduced failure rates by 50% compared to traditional lecture halls.",
    layoutDescription:
      "Central maker island with tools, perimeter workbenches, a digital station, a presentation/critique area, and accessible supply storage.",
  },
];

// ---------------------------------------------------------------------------
// Key Statistics
// ---------------------------------------------------------------------------

export interface StatCard {
  label: string;
  value: string;
  source: string;
  year: number;
  detail: string;
}

export const statistics: StatCard[] = [
  {
    label: "Peer Proximity Effect",
    value: "-9 points",
    source: "Peer Influence Study",
    year: 2024,
    detail:
      "Students sitting near inattentive peers score 9 points lower on quizzes. Strategy: separate disruptive nodes first.",
  },
  {
    label: "Hattie's Effect Size",
    value: "d=0.47",
    source: "Hattie Meta-Analysis",
    year: 2023,
    detail:
      "Small Group Learning has an effect size of d=0.47; Classroom Cohesion reaches d=0.44. Both exceed the d=0.40 'hinge point'.",
  },
  {
    label: "TEAL Project",
    value: "50% reduction",
    source: "MIT TEAL",
    year: 2019,
    detail:
      "Active learning layouts in MIT's Technology Enhanced Active Learning project reduced course failure rates by 50%.",
  },
];

// ---------------------------------------------------------------------------
// Learner Profiles
// ---------------------------------------------------------------------------

export interface LearnerProfileInfo {
  id: string;
  label: string;
}

export const learnerProfiles: LearnerProfileInfo[] = [
  { id: "UPK", label: "Universal Pre-K" },
  { id: "K-1", label: "Kindergarten - 1st Grade" },
  { id: "2-5", label: "2nd - 5th Grade" },
  { id: "6-8", label: "6th - 8th Grade" },
  { id: "9-12", label: "9th - 12th Grade" },
  { id: "Adult Learners", label: "Adult Learners" },
  { id: "Custom", label: "Custom" },
];

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
