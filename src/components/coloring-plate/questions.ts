export interface Question {
  id: string;
  question: string;
  options: string[];
  type?: 'multiple' | 'single';
  maxSelections?: number;
  optional?: boolean;
}

export const questions: Question[] = [
  {
    id: "ageGroup",
    question: "What is your age group?",
    options: [
      "3-6 years (young children)",
      "7-12 years (children)",
      "13-17 years (teenagers)",
      "18+ years (adults)",
      "55+ years (seniors)"
    ],
    optional: true
  },
  {
    id: "experience",
    question: "What is your coloring experience level?",
    options: [
      "Beginner (just starting)",
      "Intermediate (occasional coloring)",
      "Advanced (regular coloring)",
      "Expert (detailed work)"
    ],
    optional: true
  },
  {
    id: "theme",
    question: "What main theme interests you?",
    options: [
      "Nature and Wildlife",
      "Fantasy and Magic",
      "Patterns and Mandalas",
      "People and Characters",
      "Architecture and Places",
      "Abstract and Geometric",
      "Cultural and Historical",
      "Science and Technology"
    ],
    optional: true
  },
  {
    id: "atmosphere",
    question: "What atmosphere would you prefer?",
    options: [
      "Peaceful and calm",
      "Playful and fun",
      "Mysterious and magical",
      "Educational and informative",
      "Energetic and dynamic",
      "Elegant and sophisticated"
    ],
    optional: true
  },
  {
    id: "complexity",
    question: "What complexity level do you prefer?",
    options: [
      "Simple (large spaces, basic shapes)",
      "Moderate (balanced detail)",
      "Complex (intricate details)",
      "Very complex (highly detailed)"
    ],
    optional: true
  },
  {
    id: "lineStyle",
    question: "What line style do you prefer?",
    options: [
      "Bold and simple",
      "Clean and precise",
      "Flowing and organic",
      "Detailed and intricate"
    ],
    optional: true
  },
  {
    id: "symmetry",
    question: "Do you prefer symmetrical designs?",
    options: [
      "Yes, completely symmetrical",
      "Partially symmetrical",
      "No symmetry preferred",
      "No preference"
    ],
    optional: true
  },
  {
    id: "background",
    question: "What level of background detail do you prefer?",
    options: [
      "No background (focus on main subject)",
      "Simple background",
      "Detailed background",
      "Pattern background"
    ],
    optional: true
  },
  {
    id: "additionalElements",
    question: "Would you like any of these elements?",
    options: [
      "Hidden objects",
      "Pattern repetitions",
      "Text or numbers",
      "Connecting elements",
      "Story elements",
      "Educational elements"
    ],
    type: "multiple",
    maxSelections: 3,
    optional: true
  },
  {
    id: "purpose",
    question: "What is the primary purpose for this coloring plate?",
    options: [
      "Personal relaxation",
      "Art therapy",
      "Learning/education",
      "Entertainment",
      "Gift/sharing",
      "Professional use"
    ],
    optional: true
  }
];