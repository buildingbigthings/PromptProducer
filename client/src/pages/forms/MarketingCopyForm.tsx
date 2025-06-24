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

export default function MarketingCopyForm() {
  const [formData, setFormData] = useState({
    copyType: '',
    product: '',
    targetAudience: '',
    painPoints: '',
    benefits: '',
    tone: '',
    callToAction: '',
    constraints: ''
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
        description: "Your marketing copy prompt has been saved to history.",
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
    
    if (!formData.copyType.trim()) {
      newErrors.copyType = 'Copy type is required';
    }
    
    if (!formData.product.trim()) {
      newErrors.product = 'Product/service is required';
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    }

    if (!formData.tone.trim()) {
      newErrors.tone = 'Tone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-marketing-prompt", {
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
        templateId: 'marketing-copy',
        templateName: 'Marketing Copy',
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
    
    const hasRequiredFields = formData.copyType && formData.product && formData.targetAudience && formData.tone;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const hasRequiredFields = formData.copyType && formData.product && formData.targetAudience && formData.tone;
    if (!hasRequiredFields) return '';
    
    return `Create ${formData.tone} ${formData.copyType} for ${formData.product} targeting ${formData.targetAudience}...`;
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
          <h2 className="text-3xl font-bold text-gray-900">Marketing Copy Prompt Producer</h2>
          <p className="text-gray-600 mt-2">Create persuasive marketing and sales copy for your campaigns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Marketing Campaign Details</CardTitle>
              <div className="hidden md:block">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center text-orange-700">
                    <Lightbulb className="mr-2" size={16} />
                    <span className="text-sm font-medium">Focus on benefits and results</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="copyType">
                  Copy Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('copyType', value)} value={formData.copyType}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select copy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landing-page">Landing Page</SelectItem>
                    <SelectItem value="sales-page">Sales Page</SelectItem>
                    <SelectItem value="product-description">Product Description</SelectItem>
                    <SelectItem value="ad-copy">Advertisement Copy</SelectItem>
                    <SelectItem value="website-copy">Website Copy</SelectItem>
                    <SelectItem value="brochure">Brochure/Flyer</SelectItem>
                    <SelectItem value="press-release">Press Release</SelectItem>
                    <SelectItem value="tagline-slogan">Tagline/Slogan</SelectItem>
                    <SelectItem value="case-study">Case Study</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                    <SelectItem value="video-script">Video Script</SelectItem>
                    <SelectItem value="direct-mail">Direct Mail</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What type of marketing copy do you need?
                </p>
                {errors.copyType && (
                  <p className="text-xs text-red-500">{errors.copyType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">
                  Product/Service <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="product"
                  placeholder="e.g., fitness app, consulting services, handmade jewelry"
                  value={formData.product}
                  onChange={(e) => handleFieldChange('product', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What product or service are you promoting?
                </p>
                {errors.product && (
                  <p className="text-xs text-red-500">{errors.product}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">
                  Target Audience <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., busy professionals aged 25-40, small business owners, new parents"
                  value={formData.targetAudience}
                  onChange={(e) => handleFieldChange('targetAudience', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Who is your ideal customer?
                </p>
                {errors.targetAudience && (
                  <p className="text-xs text-red-500">{errors.targetAudience}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="painPoints">
                  Pain Points/Problems
                </Label>
                <Textarea
                  id="painPoints"
                  placeholder="e.g., lack of time, feeling overwhelmed, difficulty finding reliable solutions"
                  value={formData.painPoints}
                  onChange={(e) => handleFieldChange('painPoints', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What problems does your audience face that your product solves?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">
                  Key Benefits/Results
                </Label>
                <Textarea
                  id="benefits"
                  placeholder="e.g., save 2 hours daily, increase productivity by 50%, feel more confident"
                  value={formData.benefits}
                  onChange={(e) => handleFieldChange('benefits', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What specific benefits or results do customers get?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">
                  Brand Tone <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('tone', value)} value={formData.tone}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select brand tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="inspiring">Inspiring</SelectItem>
                    <SelectItem value="trustworthy">Trustworthy</SelectItem>
                    <SelectItem value="innovative">Innovative</SelectItem>
                    <SelectItem value="emotional">Emotional</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What tone best represents your brand?
                </p>
                {errors.tone && (
                  <p className="text-xs text-red-500">{errors.tone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="callToAction">
                  Desired Action
                </Label>
                <Input
                  id="callToAction"
                  placeholder="e.g., buy now, sign up for free trial, schedule consultation"
                  value={formData.callToAction}
                  onChange={(e) => handleFieldChange('callToAction', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What action do you want readers to take?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">
                  Constraints/Requirements
                </Label>
                <Textarea
                  id="constraints"
                  placeholder="e.g., must be under 100 words, include specific keywords, avoid certain phrases"
                  value={formData.constraints}
                  onChange={(e) => handleFieldChange('constraints', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Any specific requirements, word limits, or guidelines?
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" size={16} />
                {isGenerating ? 'Generating...' : 'Generate Marketing Copy Prompt'}
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

      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Tips for Better Marketing Copy Prompts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-800">
            <div className="flex items-start">
              <CheckCircle className="text-orange-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Focus on specific benefits rather than features</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-orange-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Understand your audience's pain points deeply</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-orange-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Include a clear and compelling call to action</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-orange-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Match your tone to your brand and audience</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}