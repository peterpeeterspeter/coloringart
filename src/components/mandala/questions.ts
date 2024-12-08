export interface Question {
  id: string;
  question: string;
  options: string[];
  type?: 'multiple' | 'single' | 'range';
  maxSelections?: number;
}

export const questions: Question[] = [
  {
    id: "emotions",
    question: "What emotions are most present in your life right now?",
    options: ["Joy", "Peace", "Excitement", "Contemplation", "Transformation", "Healing"],
    type: "multiple",
    maxSelections: 3
  },
  {
    id: "emotionalIntensity",
    question: "Rate your current emotional intensity (1-10):",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    type: "range"
  },
  {
    id: "emotionalQuality",
    question: "Which emotional quality would you like to enhance?",
    options: ["Balance", "Growth", "Release", "Protection", "Grounding", "Expansion"]
  },
  {
    id: "energyLevel",
    question: "How would you describe your energy level?",
    options: ["Low (fluid, gentle patterns)", "Medium (balanced, regular patterns)", "High (dynamic, radiating patterns)"]
  },
  {
    id: "bodyTension",
    question: "Where in your body do you feel most tension?",
    options: ["Center (influences core design)", "Upper body (affects upper sections)", "Lower body (affects lower sections)"]
  },
  {
    id: "thoughtPattern",
    question: "Choose your current dominant thought pattern:",
    options: ["Analytical (geometric, precise patterns)", "Creative (organic, flowing patterns)", "Reflective (layered, intricate patterns)", "Scattered (varied, multiple elements)"]
  },
  {
    id: "detailLevel",
    question: "What level of detail feels right?",
    options: ["Simple and clear (fewer elements)", "Moderately detailed (balanced complexity)", "Highly detailed (intricate patterns)"]
  },
  {
    id: "spiritualSymbols",
    question: "Select symbols that resonate with your spiritual practice:",
    options: ["Natural elements (flowers, leaves, trees)", "Geometric shapes (circles, triangles, squares)", "Abstract patterns", "Sacred symbols"],
    type: "multiple",
    maxSelections: 2
  },
  {
    id: "spiritualIntention",
    question: "Choose a spiritual intention:",
    options: ["Inner peace", "Personal growth", "Healing", "Connection", "Protection", "Wisdom"]
  },
  {
    id: "naturalElements",
    question: "What natural elements currently inspire you?",
    options: ["Water (flowing, wave patterns)", "Earth (solid, grounding patterns)", "Air (light, floating elements)", "Fire (dynamic, transformative patterns)"]
  },
  {
    id: "timeOfDay",
    question: "What time of day resonates most with you?",
    options: ["Dawn (soft, awakening patterns)", "Noon (bold, clear patterns)", "Dusk (transitional patterns)", "Night (deep, mysterious patterns)"]
  }
];