import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Wand2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { PromptOutput } from "@/components/prompt-output";

export default function ScriptsForm() {
  const [formData, setFormData] = useState({
    scriptType: '',
    topic: '',
    duration: '',
    audience: '',
    tone: '',
    objective: '',
    keyPoints: '',
    callToAction: '',
    format: ''
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const savePromptMutation = useMutation({
    mutationFn: async (promptData: any) => {
      const response = await fetch("/api/prompts", {
        method: "POST",
        body: JSON.stringify(promptData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error('Failed to save prompt');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Prompt saved!",
        description: "Your script prompt has been saved to history.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
    },
    onError: (error) => {
      console.error("Failed to save prompt:", error);
      toast({
        title: "Save failed",
        description: "Could not save prompt to history.",
        variant: "destructive",
      });
    },
  });

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.scriptType.trim()) {
      newErrors.scriptType = 'Script type is required';
    }
    
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }

    if (!formData.audience.trim()) {
      newErrors.audience = 'Audience is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-script-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      const data = await response.json();
      const prompt = data.prompt;
      
      setGeneratedPrompt(prompt);
      setIsGenerating(false);

      await savePromptMutation.mutateAsync({
        templateId: 'scripts',
        templateName: 'Scripts',
        formData: formData,
        generatedPrompt: prompt,
      });
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: "Could not generate prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPromptStatus = () => {
    if (generatedPrompt) return 'ready';
    
    const hasRequiredFields = formData.scriptType && formData.topic && formData.audience;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const hasRequiredFields = formData.scriptType && formData.topic && formData.audience;
    if (!hasRequiredFields) return '';
    
    return `Create a ${formData.scriptType} script about ${formData.topic} for ${formData.audience}${formData.duration ? ` lasting ${formData.duration}` : ''}...`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/">
            <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4 p-0">
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Script Writing Prompt Producer</h2>
          <p className="text-gray-600 mt-2">Create engaging scripts for videos, podcasts, and presentations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Script Details</CardTitle>
              <div className="hidden md:block">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center text-red-700">
                    <Lightbulb className="mr-2" size={16} />
                    <span className="text-sm font-medium">Keep your audience engaged</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="scriptType">
                  Script Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('scriptType', value)} value={formData.scriptType}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select script type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube-video">YouTube Video</SelectItem>
                    <SelectItem value="explainer-video">Explainer Video</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="training-video">Training Video</SelectItem>
                    <SelectItem value="product-demo">Product Demo</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="commercial">Commercial/Ad</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What type of script do you need?
                </p>
                {errors.scriptType && (
                  <p className="text-xs text-red-500">{errors.scriptType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">
                  Topic/Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., how to use our software, company culture, product benefits"
                  value={formData.topic}
                  onChange={(e) => handleFieldChange('topic', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What is the main topic or subject of your script?
                </p>
                {errors.topic && (
                  <p className="text-xs text-red-500">{errors.topic}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Target Duration
                </Label>
                <Select onValueChange={(value) => handleFieldChange('duration', value)} value={formData.duration}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30-seconds">30 seconds</SelectItem>
                    <SelectItem value="1-minute">1 minute</SelectItem>
                    <SelectItem value="2-3-minutes">2-3 minutes</SelectItem>
                    <SelectItem value="5-minutes">5 minutes</SelectItem>
                    <SelectItem value="10-minutes">10 minutes</SelectItem>
                    <SelectItem value="15-minutes">15 minutes</SelectItem>
                    <SelectItem value="30-minutes">30 minutes</SelectItem>
                    <SelectItem value="1-hour">1 hour</SelectItem>
                    <SelectItem value="custom">Custom length</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  How long should the final content be?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">
                  Target Audience <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="audience"
                  placeholder="e.g., new customers, existing users, industry professionals"
                  value={formData.audience}
                  onChange={(e) => handleFieldChange('audience', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Who is your target audience?
                </p>
                {errors.audience && (
                  <p className="text-xs text-red-500">{errors.audience}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">
                  Tone & Style
                </Label>
                <Select onValueChange={(value) => handleFieldChange('tone', value)} value={formData.tone}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="energetic">Energetic</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="inspiring">Inspiring</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="dramatic">Dramatic</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What tone best fits your content and audience?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">
                  Main Objective
                </Label>
                <Input
                  id="objective"
                  placeholder="e.g., educate viewers, drive sales, build awareness, entertain"
                  value={formData.objective}
                  onChange={(e) => handleFieldChange('objective', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What do you want to achieve with this script?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyPoints">
                  Key Points to Cover
                </Label>
                <Textarea
                  id="keyPoints"
                  placeholder="e.g., main benefits, step-by-step process, important features"
                  value={formData.keyPoints}
                  onChange={(e) => handleFieldChange('keyPoints', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  List the main points you want to include
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="callToAction">
                  Call to Action
                </Label>
                <Input
                  id="callToAction"
                  placeholder="e.g., subscribe, visit website, contact us, try free trial"
                  value={formData.callToAction}
                  onChange={(e) => handleFieldChange('callToAction', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What action do you want viewers to take?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">
                  Special Format Requirements
                </Label>
                <Textarea
                  id="format"
                  placeholder="e.g., include timestamps, speaker notes, visual cues, intro/outro"
                  value={formData.format}
                  onChange={(e) => handleFieldChange('format', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Any specific formatting or structural requirements?
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-200"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" size={16} />
                {isGenerating ? 'Generating...' : 'Generate Script Prompt'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <PromptOutput
          prompt={getPreviewPrompt()}
          isPreview={!generatedPrompt}
          status={getPromptStatus()}
        />
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Tips for Better Script Writing
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-800">
            <div className="flex items-start">
              <CheckCircle className="text-red-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Hook your audience within the first 10 seconds</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-red-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Structure content with clear beginning, middle, end</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-red-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Include specific examples and real scenarios</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-red-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>End with a clear call to action</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}