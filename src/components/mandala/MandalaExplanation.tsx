import { MandalaAnswers } from "@/types/mandala";

interface MandalaExplanationProps {
  answers: MandalaAnswers;
}

export const MandalaExplanation = ({ answers }: MandalaExplanationProps) => {
  const getEmotionalAnalysis = () => {
    const emotions = Array.isArray(answers.emotions) ? answers.emotions : [];
    const intensity = answers.emotionalIntensity || "5";
    const quality = answers.emotionalQuality || "Balance";

    return `Your emotional landscape reveals ${emotions.join(", ")} at an intensity level of ${intensity}/10, 
    seeking ${quality}. This combination suggests a deep connection with your inner emotional wisdom.`;
  };

  const getPhysicalAnalysis = () => {
    const energy = answers.energyLevel || "";
    const tension = answers.bodyTension || "";
    
    return `Your physical state shows ${typeof energy === 'string' ? energy.toLowerCase() : ''}, with primary tension in ${typeof tension === 'string' ? tension.toLowerCase() : ''}. 
    According to ancient wisdom, this energy distribution pattern indicates a period of significant energetic transformation.`;
  };

  const getMentalAnalysis = () => {
    const thought = answers.thoughtPattern || "";
    const detail = answers.detailLevel || "";
    
    return `Your mental state exhibits ${typeof thought === 'string' ? thought.toLowerCase() : ''}, preferring ${typeof detail === 'string' ? detail.toLowerCase() : ''}. 
    This cognitive pattern aligns with advanced states of consciousness development described in esoteric traditions.`;
  };

  const getSpiritualAnalysis = () => {
    const symbols = Array.isArray(answers.spiritualSymbols) ? answers.spiritualSymbols : [];
    const intention = answers.spiritualIntention || "";
    
    return `Your spiritual resonance with ${symbols.join(", ")} and intention of ${intention} 
    reflects deep archetypal patterns recognized in both Eastern and Western mystical traditions.`;
  };

  const getNaturalAnalysis = () => {
    const element = answers.naturalElements || "";
    const time = answers.timeOfDay || "";
    
    return `Your connection to ${typeof element === 'string' ? element.toLowerCase() : ''} and affinity with ${typeof time === 'string' ? time.toLowerCase() : ''} 
    suggests alignment with natural cycles and elemental forces, a key aspect of spiritual development.`;
  };

  return (
    <div className="space-y-6 text-left">
      <h3 className="text-2xl font-bold text-primary text-center mb-8">
        Your Mandala Analysis
      </h3>
      
      <div className="space-y-4">
        <section className="bg-white/50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Emotional Resonance</h4>
          <p className="text-gray-700">{getEmotionalAnalysis()}</p>
        </section>

        <section className="bg-white/50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Physical Manifestation</h4>
          <p className="text-gray-700">{getPhysicalAnalysis()}</p>
        </section>

        <section className="bg-white/50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Mental Patterns</h4>
          <p className="text-gray-700">{getMentalAnalysis()}</p>
        </section>

        <section className="bg-white/50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Spiritual Significance</h4>
          <p className="text-gray-700">{getSpiritualAnalysis()}</p>
        </section>

        <section className="bg-white/50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Natural Alignment</h4>
          <p className="text-gray-700">{getNaturalAnalysis()}</p>
        </section>
      </div>
    </div>
  );
};