import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const faqData = [
  {
    question: "What exactly does this app do?",
    answer: "Prompt Producer helps you create clear, powerful prompts for tools like ChatGPT, Claude, and Gemini. Whether you're writing a blog post or pitching your next idea, we help you say the right thing to the AI — the first time."
  },
  {
    question: "Do I need an AI account to use this?",
    answer: "No login is needed to use Prompt Producer itself. To use the prompts you generate, you can paste them into your favourite AI tool — like ChatGPT (free or Pro), Claude, or Gemini."
  },
  {
    question: "What's the difference between free and Pro?",
    answer: "The free version includes 5 core categories and limited prompts per day. Pro unlocks all templates, advanced tools like tone sliders and saving, and exclusive premium packs."
  },
  {
    question: "Will I lose access to my prompts if I stop paying?",
    answer: "No — your saved prompts will still be visible, but you'll lose access to premium templates and new packs unless you're on Pro."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. You can cancel your subscription anytime, and you'll still have access until the end of your billing period."
  },
  {
    question: "How is this different from just using ChatGPT directly?",
    answer: "While you can use ChatGPT directly, most people struggle with writing effective prompts. Prompt Producer guides you through structured forms to capture all the context AI needs, ensuring you get better results consistently."
  },
  {
    question: "What AI tools work with the prompts I create?",
    answer: "Our prompts work with any text-based AI tool including ChatGPT, Claude, Gemini, Perplexity, and others. The prompts are platform-agnostic and designed to work across different AI models."
  },
  {
    question: "Is there a limit to how many prompts I can create?",
    answer: "Free users can create up to 10 prompts per day. Pro and Lifetime users have unlimited prompt generation."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
  },
  {
    question: "How often do you add new templates?",
    answer: "We regularly add new templates based on user feedback and emerging use cases. Pro users get priority access to new templates and features."
  },
  {
    question: "Can I use this for commercial purposes?",
    answer: "Absolutely! Many businesses, freelancers, and agencies use Prompt Producer to create content for their clients. All plans include commercial usage rights."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. We use industry-standard encryption and never store your actual prompt outputs. Only the template configurations are saved for your convenience."
  }
];

export default function FAQs() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <HelpCircle className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about Prompt Producer. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {faqData.map((faq, index) => (
            <Card key={index} className="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    {openItems.includes(index) ? (
                      <Minus className="text-blue-500" size={20} />
                    ) : (
                      <Plus className="text-gray-400" size={20} />
                    )}
                  </div>
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our support team is here to help. Whether you need technical assistance or have questions about pricing, 
            we're ready to assist you.
          </p>
          <div className="space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Contact Support
            </Button>
            <Link to="/pricing">
              <Button variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/use-cases">
            <Card className="bg-white border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Explore Use Cases</h4>
                <p className="text-sm text-gray-600">See how others use Prompt Producer</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/pricing">
            <Card className="bg-white border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">View Pricing</h4>
                <p className="text-sm text-gray-600">Find the perfect plan for you</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/">
            <Card className="bg-white border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Try It Free</h4>
                <p className="text-sm text-gray-600">Start building better prompts today</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}