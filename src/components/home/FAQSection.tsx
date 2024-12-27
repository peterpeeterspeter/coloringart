export const FAQSection = () => {
  const faqs = [
    {
      question: "What is coloring.art?",
      answer: "Coloring.art is an AI-powered platform offering two unique tools: IdeaArtist for turning text into coloring pages, and SoulScape for creating personalized mandalas."
    },
    {
      question: "How many free generations do I get?",
      answer: "New users receive 10 free generations to explore both IdeaArtist and SoulScape before committing to a subscription."
    },
    {
      question: "What's included in the premium subscription?",
      answer: "Premium subscribers enjoy unlimited generations, advanced customization, high-quality exports, exclusive designs, and priority support."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 bg-white/50">
      <h2 className="text-3xl font-bold text-center mb-12 font-serif text-primary">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="font-serif text-xl font-semibold mb-3 text-gray-800">
              {faq.question}
            </h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};