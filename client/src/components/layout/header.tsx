import { Brain, History, Menu, Home, Heart, Users, DollarSign, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative">
        <div className="absolute top-2 left-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-blue-200 hover:bg-white/10">
                <Menu size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Brain className="text-white" size={16} />
                  </div>
                  <span>Prompt Producer</span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Navigation Menu */}
                <div className="space-y-3">
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <Home className="mr-3" size={18} />
                      Home
                    </Button>
                  </Link>
                  
                  <Link to="/our-why" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <Heart className="mr-3" size={18} />
                      Our Why
                    </Button>
                  </Link>
                  
                  <Link to="/use-cases" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <Users className="mr-3" size={18} />
                      Use Cases
                    </Button>
                  </Link>
                  
                  <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <DollarSign className="mr-3" size={18} />
                      Pricing
                    </Button>
                  </Link>
                  
                  <Link to="/faqs" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <HelpCircle className="mr-3" size={18} />
                      FAQs
                    </Button>
                  </Link>
                  
                  <Link to="/history" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <History className="mr-3" size={18} />
                      Prompt History
                    </Button>
                  </Link>
                </div>

                {/* Our Why Section */}
                <div className="border-t pt-6 hidden">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="mr-2" size={18} />
                    Our Why
                  </h3>
                  
                  <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                    <p>
                      At Prompt Producer, we believe AI should feel like an empowering conversation — not a puzzle to solve.
                    </p>
                    
                    <p>
                      Too often, people are held back by the complexity of talking to AI. They know what they want to say, but struggle to get the right results. Whether it's confusion, wasted time, or just not feeling heard — that friction stops people from unlocking the full value of AI.
                    </p>
                    
                    <p className="font-medium text-gray-800">We're here to change that.</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">✨ Our Belief</h4>
                        <p>Technology should help people navigate life with more ease, clarity, and confidence — not overwhelm them further.</p>
                      </div>
                      
                      <p>
                        That's why we created Prompt Producer: a simple, human-centred tool that helps anyone communicate better with AI. Whether you're writing a message, solving a problem, learning something new, or creating something bold — Prompt Producer helps you shape clearer, smarter prompts that get better results.
                      </p>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">🌍 Our Vision</h4>
                        <p>To create a world where AI quietly enhances everyday life by making communication, decisions, and self-understanding simpler and more fulfilling for everyone.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">🎯 Our Mission</h4>
                        <p>We build tools that remove the friction between people and powerful AI systems — helping you feel more in control, more understood, and more connected in how you live and communicate.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Prompt Producer</h1>
          <p className="text-lg sm:text-xl text-blue-100">The easiest way to write high-quality AI prompts — without being a prompt engineer.</p>
        </div>
      </div>
      
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Brain className="text-white" size={16} />
                </div>
                <span className="text-xl font-semibold text-gray-900">Prompt Producer</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 hidden md:block">Generate professional AI prompts</span>
              <Link to="/history">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <History className="mr-2" size={16} />
                  History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
