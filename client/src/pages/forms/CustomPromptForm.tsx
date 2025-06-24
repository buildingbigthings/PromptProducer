import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

export default function CustomPromptForm() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get description from URL params
  const initialDescription = searchParams.get('description') || '';

  const [formData, setFormData] = useState({
    originalDescription: initialDescription,
    whatToCreate: initialDescription,
    targetAudience: '',
    toneStyle: '',
    constraints: '',
    goals: ''
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        description: "Your custom prompt has been saved to history.",
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
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const generateCustomPrompt = (data: typeof formData) => {
    let prompt = `You are an expert assistant helping create content. `;
    
    if (data.originalDescription) {
      prompt += `The user's original request was: "${data.originalDescription}". `;
    }
    
    prompt += `Please help create ${data.whatToCreate || 'content'} `;
    
    if (data.targetAudience) {
      prompt += `for ${data.targetAudience} `;
    }
    
    if (data.toneStyle) {
      prompt += `using a ${data.toneStyle} tone `;
    }
    
    if (data.goals) {
      prompt += `with the goal of ${data.goals} `;
    }
    
    if (data.constraints) {
      prompt += `while keeping in mind these constraints: ${data.constraints} `;
    }
    
    prompt += `\n\nPlease provide:
1. A clear structure or outline
2. Key points to include
3. Specific suggestions for tone and style
4. Any relevant best practices
5. Examples or templates if applicable

Make your response comprehensive and actionable.`;

    return prompt;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.whatToCreate.trim()) {
      newErrors.whatToCreate = 'Please specify what you want to create';
    }
    
    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Please specify your target audience';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      // Generate prompt using OpenAI
      const response = await fetch("/api/generate-custom-prompt", {
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

      // Save to database
      await savePromptMutation.mutateAsync({
        templateId: 'custom',
        templateName: 'Custom Prompt',
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
    
    const hasRequiredFields = formData.whatToCreate && formData.targetAudience;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const hasRequiredFields = formData.whatToCreate && formData.targetAudience;
    if (!hasRequiredFields) return '';
    
    return generateCustomPrompt(formData);
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
          <h2 className="text-3xl font-bold text-gray-900">Custom Prompt Producer</h2>
          <p className="text-gray-600 mt-2">Create a personalized prompt based on your specific needs.</p>
        </div>
      </div>

      {initialDescription && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Your Original Request:</h4>
            <p className="text-sm text-blue-800 italic">"{initialDescription}"</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Custom Prompt Details</CardTitle>
              <div className="hidden md:block">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-center text-emerald-700">
                    <Lightbulb className="mr-2" size={16} />
                    <span className="text-sm font-medium">Be specific for better results</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="whatToCreate">
                  What do you want to create? <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="whatToCreate"
                  placeholder="e.g., a marketing email, blog post, social media campaign"
                  value={formData.whatToCreate}
                  onChange={(e) => handleFieldChange('whatToCreate', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Be specific about the type of content you need
                </p>
                {errors.whatToCreate && (
                  <p className="text-xs text-red-500">{errors.whatToCreate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">
                  Who is it for? <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., small business owners, college students, tech professionals"
                  value={formData.targetAudience}
                  onChange={(e) => handleFieldChange('targetAudience', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Describe your target audience
                </p>
                {errors.targetAudience && (
                  <p className="text-xs text-red-500">{errors.targetAudience}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="toneStyle">
                  What style or tone should it be?
                </Label>
                <Select onValueChange={(value) => handleFieldChange('toneStyle', value)} value={formData.toneStyle}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select tone and style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="inspiring">Inspiring</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="entertaining">Entertaining</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Choose the tone that fits your brand and audience
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">
                  Any constraints or goals?
                </Label>
                <Textarea
                  id="goals"
                  placeholder="e.g., must be under 200 words, include a call-to-action, promote our new service"
                  value={formData.goals}
                  onChange={(e) => handleFieldChange('goals', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Specific requirements, word limits, or objectives
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">
                  Additional context or constraints
                </Label>
                <Textarea
                  id="constraints"
                  placeholder="e.g., avoid technical jargon, include industry-specific terms, company values to highlight"
                  value={formData.constraints}
                  onChange={(e) => handleFieldChange('constraints', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Any additional guidelines or restrictions
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" size={16} />
                {isGenerating ? 'Generating...' : 'Generate Custom Prompt'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <PromptOutput
          prompt={getPreviewPrompt()}
          isPreview={!generatedPrompt}
          status={getPromptStatus()}
          templateCategory="custom"
          originalGoal={formData.goals || formData.whatToCreate}
          onPromptUpdate={(newPrompt) => setGeneratedPrompt(newPrompt)}
        />
      </div>

      {/* Tips Section */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Tips for Better Custom Prompts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-800">
            <div className="flex items-start">
              <CheckCircle className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Be specific about your content type and purpose</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Include details about your target audience</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Mention any constraints like word count or format</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Specify the desired outcome or goal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}