import { Link } from "react-router-dom";
import { ArrowLeft, Users, Briefcase, Palette, GraduationCap, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UseCases() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock the Full Potential of AI — Without Needing to Be a Prompt Expert
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Whether you're a creator, entrepreneur, student or marketer — Prompt Producer helps you build better AI prompts, faster.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Entrepreneurs & Small Businesses */}
          <Card className="bg-white border-2 border-blue-100 hover:border-blue-300 transition-colors">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">For Entrepreneurs & Small Businesses</h3>
                  <Badge className="bg-blue-100 text-blue-700">Professional Focus</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-blue-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Create product descriptions optimised for SEO</p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-blue-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Write professional emails to clients and suppliers</p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-blue-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Generate website copy, social media content, or ad campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creators & Marketers */}
          <Card className="bg-white border-2 border-purple-100 hover:border-purple-300 transition-colors">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Palette className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">For Creators & Marketers</h3>
                  <Badge className="bg-purple-100 text-purple-700">Creative Power</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-purple-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Turn one idea into 10 content formats (Instagram, Twitter, YouTube)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-purple-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Draft newsletters, hook-driven captions, or lead magnets</p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-purple-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Build brand messaging and campaign angles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students & Educators */}
          <Card className="bg-white border-2 border-green-100 hover:border-green-300 transition-colors">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">For Students & Educators</h3>
                  <Badge className="bg-green-100 text-green-700">Learning Support</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Turn messy notes into structured summaries</p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Generate essay outlines or discussion questions</p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Create lesson plans and quiz prompts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Everyday AI Users */}
          <Card className="bg-white border-2 border-orange-100 hover:border-orange-300 transition-colors">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">For Everyday AI Users</h3>
                  <Badge className="bg-orange-100 text-orange-700">Personal Use</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-orange-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Get help writing anything from job applications to poems</p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-orange-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Build structured queries for ChatGPT, Claude, or Gemini</p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="text-orange-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Save and reuse your best-performing prompts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Before/After Example */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">See the Difference</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-red-600">Bad Prompt</h4>
              </div>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="text-gray-700 italic">"Help me write a business plan"</p>
              </div>
              <p className="text-sm text-gray-600">
                Vague, no context, likely to get generic unhelpful response
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-green-600">Better Prompt (via app)</h4>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="text-gray-700 italic">
                  "Act as a startup coach. Write a lean business plan for a local coffee subscription startup 
                  targeting remote workers in London. Include goals, audience, key costs, and 3 marketing strategies."
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Specific role, clear context, actionable requirements
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Transform Your AI Experience?</h3>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Join thousands of users who are getting better results from AI tools with structured, expert-designed prompts.
          </p>
          <div className="space-x-4">
            <Link to="/">
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Building Prompts
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}