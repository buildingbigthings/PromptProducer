import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Wand2, X, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface PromptImproverProps {
  originalPrompt: string;
  templateCategory: string;
  originalGoal: string;
  onImprovedPrompt: (improvedPrompt: string) => void;
  className?: string;
}

const feedbackOptions = [
  { id: "tone", label: "Wrong tone/style", description: "Too formal, too casual, doesn't match audience" },
  { id: "clarity", label: "Not clear enough", description: "Confusing instructions or unclear expectations" },
  { id: "vague", label: "Too vague", description: "Not specific enough, lacks detail" },
  { id: "long", label: "Too long", description: "Unnecessarily wordy or complex" },
  { id: "short", label: "Too short", description: "Missing important details or context" },
  { id: "format", label: "Poor formatting", description: "Hard to read or follow structure" },
  { id: "context", label: "Missing context", description: "Doesn't provide enough background information" },
  { id: "examples", label: "Needs examples", description: "Would benefit from specific examples" },
  { id: "goal", label: "Doesn't match goal", description: "Doesn't align with what I'm trying to achieve" }
];

export function PromptImprover({ 
  originalPrompt, 
  templateCategory, 
  originalGoal, 
  onImprovedPrompt,
  className = ""
}: PromptImproverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [feedbackDetails, setFeedbackDetails] = useState("");
  const [editedPrompt, setEditedPrompt] = useState(originalPrompt);
  const [showSuccess, setShowSuccess] = useState(false);

  const improveMutation = useMutation({
    mutationFn: async (data: {
      originalPrompt: string;
      userFeedback: string[];
      userEdits?: string;
      originalGoal: string;
      templateCategory: string;
    }) => {
      const response = await apiRequest("POST", "/api/improve-prompt", data);
      return await response.json();
    },
    onSuccess: (data: any) => {
      onImprovedPrompt(data.prompt);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
        // Reset form
        setSelectedFeedback([]);
        setFeedbackDetails("");
        setEditedPrompt(originalPrompt);
      }, 2000);
    }
  });

  const handleFeedbackChange = (feedbackId: string, checked: boolean) => {
    if (checked) {
      setSelectedFeedback(prev => [...prev, feedbackId]);
    } else {
      setSelectedFeedback(prev => prev.filter(id => id !== feedbackId));
    }
  };

  const handleImprove = () => {
    if (selectedFeedback.length === 0) return;

    const userEdits = editedPrompt !== originalPrompt ? editedPrompt : undefined;
    
    // Combine selected feedback with detailed feedback
    const combinedFeedback = [...selectedFeedback];
    if (feedbackDetails.trim()) {
      combinedFeedback.push(`Additional details: ${feedbackDetails.trim()}`);
    }

    improveMutation.mutate({
      originalPrompt,
      userFeedback: combinedFeedback,
      userEdits,
      originalGoal,
      templateCategory
    });
  };

  const hasChanges = selectedFeedback.length > 0 || editedPrompt !== originalPrompt || feedbackDetails.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`border-orange-200 text-orange-700 hover:bg-orange-50 ${className}`}
        >
          <Wand2 className="mr-2" size={16} />
          Not quite right? Improve this prompt
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="mr-2" size={20} />
            Improve Your Prompt
          </DialogTitle>
          <DialogDescription>
            Tell us what didn't work and edit the prompt directly. We'll use your feedback to create a better version.
          </DialogDescription>
        </DialogHeader>

        {showSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 font-medium">
              Prompt improved successfully! The updated version is now displayed.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Feedback Selection */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-900">What didn't work?</CardTitle>
              <p className="text-sm text-orange-700">Select all issues that apply (at least one required)</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedbackOptions.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={option.id}
                      checked={selectedFeedback.includes(option.id)}
                      onCheckedChange={(checked) => handleFeedbackChange(option.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={option.id} className="text-sm font-medium text-orange-900 cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-xs text-orange-700 mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Additional Details Text Area */}
              {selectedFeedback.length > 0 && (
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <Label htmlFor="feedbackDetails" className="text-sm font-medium text-orange-900 mb-2 block">
                    Tell us more about what you'd like to change (optional)
                  </Label>
                  <Textarea
                    id="feedbackDetails"
                    value={feedbackDetails}
                    onChange={(e) => setFeedbackDetails(e.target.value)}
                    placeholder="Describe specifically what you want to improve. For example: 'Make it sound more friendly and less formal' or 'Add more specific examples about the product features'..."
                    rows={3}
                    className="text-sm resize-none bg-white border-orange-200 focus:border-orange-400"
                  />
                  <p className="text-xs text-orange-600 mt-1">
                    The more specific you are, the better we can improve your prompt
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prompt Editor */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-900">Edit the prompt directly (optional)</CardTitle>
              <p className="text-sm text-blue-700">Make any changes you want to see in the improved version</p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                rows={8}
                className="font-mono text-sm resize-none"
                placeholder="Edit the prompt here..."
              />
              {editedPrompt !== originalPrompt && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-blue-600">✓ You've made changes to the original prompt</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditedPrompt(originalPrompt)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <X className="mr-1" size={14} />
                    Reset changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Original Context */}
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900">Original Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Template Category:</Label>
                <p className="text-sm text-gray-900 mt-1">{templateCategory}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Original Goal:</Label>
                <p className="text-sm text-gray-900 mt-1">{originalGoal}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={improveMutation.isPending}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleImprove}
              disabled={!hasChanges || improveMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {improveMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 animate-spin" size={16} />
                  Improving...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2" size={16} />
                  Improve Prompt
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}