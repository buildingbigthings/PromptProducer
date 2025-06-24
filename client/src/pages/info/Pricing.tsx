import { Link } from "react-router-dom";
import { ArrowLeft, Check, Crown, Zap, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Pricing() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Save hours every week writing content, pitching clients, or planning lessons — for less than the price of 1 coffee per week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="bg-white border-2 border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-white" size={20} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Free Plan</h3>
                <Badge variant="secondary" className="mb-4">Try It Out</Badge>
                <div className="text-3xl font-bold text-gray-900 mb-2">£0</div>
                <p className="text-gray-600">Forever free</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">5 core categories (blog, social, email, idea gen, CV)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Open prompt builder</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Copy prompts with watermark</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Limited daily usage (10 prompts/day)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Access to 1 free prompt pack</p>
                </div>
              </div>
              
              <Link to="/" className="block">
                <Button className="w-full bg-gray-600 hover:bg-gray-700">
                  Start Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-white border-2 border-blue-300 hover:border-blue-400 transition-colors relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
            </div>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Crown className="text-white" size={20} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Pro Plan</h3>
                <Badge className="bg-blue-100 text-blue-700 mb-4">Unlock the Full Experience</Badge>
                <div className="text-3xl font-bold text-gray-900 mb-2">£6</div>
                <p className="text-gray-600">per month or £60/year</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">All categories + premium packs (20+ use cases)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Smart prompt refinements (tone, length, structure)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Save prompts to history</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Remove watermark</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Priority updates + access to new features</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Download prompt packs (PDF, Notion)</p>
                </div>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-2">
                Upgrade to Pro
              </Button>
              <p className="text-sm text-gray-600 text-center">Cancel anytime</p>
            </CardContent>
          </Card>

          {/* Lifetime Access */}
          <Card className="bg-white border-2 border-purple-200 hover:border-purple-300 transition-colors">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Gift className="text-white" size={20} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Lifetime Access</h3>
                <Badge className="bg-purple-100 text-purple-700 mb-4">One and Done</Badge>
                <div className="text-3xl font-bold text-gray-900 mb-2">£110</div>
                <p className="text-gray-600">One-time payment</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">All Pro features forever</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">No recurring payments</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Future updates included</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Perfect for solo creators & freelancers</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-gray-700">Priority support</p>
                </div>
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Go Lifetime
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional CTA */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-6 inline-block">
            <p className="text-lg text-gray-700 mb-4">Not sure which plan is right for you?</p>
            <Link to="/">
              <Button variant="outline" size="lg" className="mr-4">
                Start Free, Upgrade Later
              </Button>
            </Link>
            <Link to="/faqs">
              <Button variant="ghost" size="lg">
                View FAQs
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">What's Included</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Pro</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Lifetime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 text-gray-700">Template Categories</td>
                  <td className="py-3 px-4 text-center">5 core</td>
                  <td className="py-3 px-4 text-center">20+ categories</td>
                  <td className="py-3 px-4 text-center">20+ categories</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Daily Prompt Limit</td>
                  <td className="py-3 px-4 text-center">10 prompts</td>
                  <td className="py-3 px-4 text-center">Unlimited</td>
                  <td className="py-3 px-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Prompt History</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Smart Refinements</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Remove Watermark</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Priority Support</td>
                  <td className="py-3 px-4 text-center">❌</td>
                  <td className="py-3 px-4 text-center">✅</td>
                  <td className="py-3 px-4 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}