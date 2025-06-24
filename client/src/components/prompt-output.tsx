import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Share, FileText, CheckCircle, Sliders, RefreshCw, MessageSquare, Wand2, ChevronDown, ChevronUp } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { PromptImprover } from "./prompt-improver";

interface PromptOutputProps {
  prompt: string;
  isPreview?: boolean;
  status: 'empty' | 'preview' | 'ready';
  onRefine?: (refinement: string) => void;
  promptGoal?: string;
  promptExplanation?: string;
  isRefining?: boolean;
  templateCategory?: string;
  originalGoal?: string;
  onPromptUpdate?: (newPrompt: string) => void;
}

export function PromptOutput({ 
  prompt, 
  isPreview = false, 
  status, 
  onRefine,
  promptGoal,
  promptExplanation,
  isRefining = false,
  templateCategory = "custom",
  originalGoal = "",
  onPromptUpdate
}: PromptOutputProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showRefinements, setShowRefinements] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [toneLevel, setToneLevel] = useState([50]);
  const [lengthLevel, setLengthLevel] = useState([50]);
  const [detailLevel, setDetailLevel] = useState([50]);

  const quickRefinements = [
    { label: "Make more concise", value: "make this prompt more concise and direct" },
    { label: "Add humor", value: "add appropriate humor and wit to make this prompt more engaging" },
    { label: "Make more persuasive", value: "make this prompt more persuasive and compelling" },
    { label: "Add examples", value: "include specific examples to make this prompt clearer" },
    { label: "Make friendlier", value: "make the tone more friendly and approachable" },
    { label: "More professional", value: "make this prompt more professional and formal" }
  ];

  const handleCopy = async () => {
    if (!prompt || isPreview) return;
    
    const success = await copyToClipboard(prompt);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const handleQuickRefinement = (refinement: string) => {
    if (onRefine) {
      onRefine(refinement);
    }
  };

  const handleSliderRefinement = () => {
    const toneText = toneLevel[0] < 33 ? "professional" : toneLevel[0] > 66 ? "casual" : "balanced";
    const lengthText = lengthLevel[0] < 33 ? "concise" : lengthLevel[0] > 66 ? "detailed" : "moderate length";
    const detailText = detailLevel[0] < 33 ? "high-level" : detailLevel[0] > 66 ? "very detailed" : "balanced detail";
    
    const refinement = `Adjust this prompt to be more ${toneText} in tone, ${lengthText}, and ${detailText}`;
    if (onRefine) {
      onRefine(refinement);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'empty':
        return { text: 'Fill out the form to generate your prompt', className: 'text-sm text-gray-500' };
      case 'preview':
        return { text: 'Click Generate to finalize', className: 'text-sm text-yellow-600' };
      case 'ready':
        return { text: 'Ready to copy', className: 'text-sm text-emerald-600' };
      default:
        return { text: '', className: '' };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Generated Prompt</CardTitle>
          <div className={statusMessage.className}>
            {statusMessage.text}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[200px] mb-4">
          {status === 'empty' ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500 text-sm">Your generated prompt will appear here</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {prompt}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleCopy}
              disabled={status !== 'ready'}
              className={`flex-1 transition-colors duration-200 ${
                isCopied 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isCopied ? (
                <>
                  <CheckCircle className="mr-2" size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2" size={16} />
                  Copy Prompt
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              disabled={status !== 'ready'}
              className="px-4 transition-colors duration-200"
              title="Share prompt"
            >
              <Share size={16} />
            </Button>

            {status === 'ready' && onRefine && (
              <Button 
                variant="outline"
                onClick={() => setShowRefinements(!showRefinements)}
                className="px-4 transition-colors duration-200"
                title="Refine prompt"
              >
                <Sliders size={16} />
              </Button>
            )}
          </div>

          {/* Improve This Prompt */}
          {status === 'ready' && onPromptUpdate && (
            <PromptImprover
              originalPrompt={prompt}
              templateCategory={templateCategory}
              originalGoal={originalGoal || promptGoal || "Generate effective prompt"}
              onImprovedPrompt={onPromptUpdate}
              className="w-full"
            />
          )}

          {/* Smart Refinement Options */}
          {showRefinements && status === 'ready' && onRefine && (
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                  <Wand2 className="mr-2" size={16} />
                  Smart Refinements
                </h4>
                
                {/* Quick 1-click refinements */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-blue-800">Quick Tweaks</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {quickRefinements.map((refinement, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickRefinement(refinement.value)}
                          disabled={isRefining}
                          className="text-xs bg-white hover:bg-blue-100 border-blue-200"
                        >
                          {isRefining ? (
                            <RefreshCw className="mr-1" size={12} />
                          ) : null}
                          {refinement.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Slider adjustments */}
                  <div className="border-t border-blue-200 pt-3">
                    <Label className="text-sm font-medium text-blue-800">Fine-tune with Sliders</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div className="space-y-2">
                        <Label className="text-xs text-blue-700">Tone</Label>
                        <div className="px-2">
                          <Slider
                            value={toneLevel}
                            onValueChange={setToneLevel}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-blue-600 mt-1">
                            <span>Professional</span>
                            <span>Casual</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-blue-700">Length</Label>
                        <div className="px-2">
                          <Slider
                            value={lengthLevel}
                            onValueChange={setLengthLevel}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-blue-600 mt-1">
                            <span>Concise</span>
                            <span>Detailed</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-blue-700">Detail Level</Label>
                        <div className="px-2">
                          <Slider
                            value={detailLevel}
                            onValueChange={setDetailLevel}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-blue-600 mt-1">
                            <span>High-level</span>
                            <span>Very detailed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleSliderRefinement}
                      disabled={isRefining}
                      size="sm"
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                    >
                      {isRefining ? (
                        <>
                          <RefreshCw className="mr-2 animate-spin" size={14} />
                          Refining...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2" size={14} />
                          Apply Adjustments
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prompt Goal Display */}
          {promptGoal && status === 'ready' && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Goal: {promptGoal}
              </Badge>
            </div>
          )}

          {/* Prompt Explanation */}
          {promptExplanation && status === 'ready' && (
            <Card className="border border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-green-900 flex items-center">
                    <MessageSquare className="mr-2" size={16} />
                    What your prompt does
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="text-green-700 hover:text-green-800"
                  >
                    {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </div>
                {showExplanation && (
                  <div className="mt-3 text-sm text-green-800 leading-relaxed">
                    {promptExplanation}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {isCopied && (
          <Alert className="mt-4 bg-emerald-50 border-emerald-200">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700 font-medium">
              Prompt copied to clipboard!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
