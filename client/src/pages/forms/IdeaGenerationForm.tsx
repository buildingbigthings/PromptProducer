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

export default function IdeaGenerationForm() {
  const [formData, setFormData] = useState({
    purpose: '',
    domain: '',
    context: '',
    constraints: '',
    ideaType: '',
    quantity: '',
    targetAudience: '',
    criteria: ''
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
        description: "Your idea generation prompt has been saved to history.",
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
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }
    
    if (!formData.ideaType.trim()) {
      newErrors.ideaType = 'Idea type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-idea-prompt", {
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
        templateId: 'idea-generation',
        templateName: 'Idea Generation',
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
    
    const hasRequiredFields = formData.purpose && formData.ideaType;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const hasRequiredFields = formData.purpose && formData.ideaType;
    if (!hasRequiredFields) return '';
    
    return `Generate ${formData.ideaType} ideas for ${formData.purpose}${formData.domain ? ` in the ${formData.domain} domain` : ''}...`;
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
          <h2 className="text-3xl font-bold text-gray-900">Idea Generation & Brainstorming</h2>
          <p className="text-gray-600 mt-2">Generate creative ideas and innovative solutions for any challenge.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Brainstorming Details</CardTitle>
              <div className="hidden md:block">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center text-yellow-700">
                    <Lightbulb className="mr-2" size={16} />
                    <span className="text-sm font-medium">Think outside the box</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="purpose">
                  What do you need ideas for? <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="purpose"
                  placeholder="e.g., new product features, marketing campaign, business model"
                  value={formData.purpose}
                  onChange={(e) => handleFieldChange('purpose', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Describe the challenge or project you need ideas for
                </p>
                {errors.purpose && (
                  <p className="text-xs text-red-500">{errors.purpose}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ideaType">
                  Type of Ideas <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('ideaType', value)} value={formData.ideaType}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select idea type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creative-concepts">Creative Concepts</SelectItem>
                    <SelectItem value="business-ideas">Business Ideas</SelectItem>
                    <SelectItem value="product-features">Product Features</SelectItem>
                    <SelectItem value="solutions">Problem Solutions</SelectItem>
                    <SelectItem value="innovations">Innovations</SelectItem>
                    <SelectItem value="strategies">Strategies</SelectItem>
                    <SelectItem value="improvements">Improvements</SelectItem>
                    <SelectItem value="alternatives">Alternatives</SelectItem>
                    <SelectItem value="opportunities">Opportunities</SelectItem>
                    <SelectItem value="experiments">Experiments</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What kind of ideas are you looking for?
                </p>
                {errors.ideaType && (
                  <p className="text-xs text-red-500">{errors.ideaType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">
                  Domain/Industry
                </Label>
                <Input
                  id="domain"
                  placeholder="e.g., technology, healthcare, education, retail"
                  value={formData.domain}
                  onChange={(e) => handleFieldChange('domain', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What industry or field is this for?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">
                  Context & Background
                </Label>
                <Textarea
                  id="context"
                  placeholder="e.g., current situation, existing solutions, market conditions"
                  value={formData.context}
                  onChange={(e) => handleFieldChange('context', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Provide background information to help generate relevant ideas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">
                  Target Audience
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., millennials, small business owners, students"
                  value={formData.targetAudience}
                  onChange={(e) => handleFieldChange('targetAudience', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Who are the ideas intended for?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">
                  Constraints & Limitations
                </Label>
                <Textarea
                  id="constraints"
                  placeholder="e.g., budget limits, time constraints, technical limitations"
                  value={formData.constraints}
                  onChange={(e) => handleFieldChange('constraints', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Any limitations or constraints to consider?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Number of Ideas
                </Label>
                <Select onValueChange={(value) => handleFieldChange('quantity', value)} value={formData.quantity}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="How many ideas?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 ideas</SelectItem>
                    <SelectItem value="10">10 ideas</SelectItem>
                    <SelectItem value="15">15 ideas</SelectItem>
                    <SelectItem value="20">20 ideas</SelectItem>
                    <SelectItem value="varied">Varied quantity</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  How many ideas would you like generated?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="criteria">
                  Success Criteria
                </Label>
                <Textarea
                  id="criteria"
                  placeholder="e.g., must be cost-effective, easy to implement, innovative"
                  value={formData.criteria}
                  onChange={(e) => handleFieldChange('criteria', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What makes a good idea for your situation?
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-yellow-600 hover:bg-yellow-700 transition-colors duration-200"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" size={16} />
                {isGenerating ? 'Generating...' : 'Generate Idea Brainstorming Prompt'}
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

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Tips for Better Idea Generation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
            <div className="flex items-start">
              <CheckCircle className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Be specific about your challenge or opportunity</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Include relevant context and background information</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Define your constraints to get realistic ideas</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Specify success criteria for better targeting</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}