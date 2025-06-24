import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Brain, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OurWhy() {
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
              <Heart className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Why</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe AI should be accessible to everyone, not just prompt engineers and tech experts.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-white border-2 border-blue-100">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Problem We Solve</h3>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    AI tools like ChatGPT, Claude, and Gemini are incredibly powerful, but most people struggle to get good results. 
                    They write vague prompts like "help me write a business plan" and get generic, unhelpful responses.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    The difference between a bad prompt and a great one can mean the difference between wasting hours 
                    and getting exactly what you need in minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-green-100">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Solution</h3>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    Prompt Producer transforms your basic ideas into expert-level prompts that get results. 
                    We guide you through structured forms that capture all the context AI needs to help you effectively.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    No more guessing what to say or how to phrase your requests. Our templates are designed by 
                    prompt engineering experts and tested across different use cases to ensure they work.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-purple-100">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Who We Serve</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Entrepreneurs & Small Businesses</h4>
                      <p className="text-gray-700">
                        Create professional content, marketing copy, and business communications without hiring expensive copywriters.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Content Creators & Marketers</h4>
                      <p className="text-gray-700">
                        Turn one idea into multiple content formats and maintain consistent brand voice across platforms.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Students & Educators</h4>
                      <p className="text-gray-700">
                        Structure learning materials, create lesson plans, and organize thoughts into clear, actionable content.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Everyday AI Users</h4>
                      <p className="text-gray-700">
                        Get better results from AI tools for personal projects, creative writing, and problem-solving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto">
              To democratize AI by making it easy for anyone to communicate effectively with artificial intelligence, 
              regardless of their technical background or prompt engineering knowledge.
            </p>
            <div className="mt-6">
              <Link to="/">
                <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Building Better Prompts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}