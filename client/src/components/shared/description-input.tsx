import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb, Sparkles } from "lucide-react";
import { detectCategory } from "../../utils/detect-category";

export function DescriptionInput() {
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!description.trim()) return;
    
    // Always route to custom prompt form - let users manually choose categories
    navigate(`/form/custom?description=${encodeURIComponent(description)}`);
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={16} />
          </div>
          <CardTitle className="text-xl text-gray-900">Start with a Description</CardTitle>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          Not sure where to start? Just describe what you need and we'll guide you.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <div className="flex items-start text-emerald-700">
            <Lightbulb className="mr-2 mt-0.5 flex-shrink-0" size={16} />
            <div className="text-sm">
              <p className="font-medium mb-1">Examples:</p>
              <ul className="text-xs space-y-1">
                <li>• "I want to pitch my design services to a coffee chain"</li>
                <li>• "Help me write a blog post about sustainable living"</li>
                <li>• "Create social media content for my yoga studio"</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Describe what you want to create... (e.g., I need help writing an email to potential clients about my web design services)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none transition-colors duration-200"
          />
          <p className="text-xs text-gray-500">
            Be as specific as possible about your goal, audience, and any requirements.
          </p>
        </div>

        <Button 
          onClick={handleNext}
          disabled={!description.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
        >
          <ArrowRight className="mr-2" size={16} />
          Next: Build My Prompt
        </Button>
      </CardContent>
    </Card>
  );
}