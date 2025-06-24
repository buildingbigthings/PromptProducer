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

export default function EmailForm() {
  const [formData, setFormData] = useState({
    purpose: '',
    recipient: '',
    tone: '',
    keyPoints: '',
    callToAction: ''
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
        description: "Your email prompt has been saved to history.",
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

  const generateEmailPrompt = (data: typeof formData) => {
    let prompt = `Act as a professional email writer. Create a ${data.tone || 'professional'} email for ${data.purpose || 'communication'}.

Target recipient: ${data.recipient || 'specified audience'}

Email requirements:
- Purpose: ${data.purpose}
- Tone: ${data.tone}`;

    if (data.keyPoints) {
      prompt += `
- Key points to include: ${data.keyPoints}`;
    }

    if (data.callToAction) {
      prompt += `
- Call to action: ${data.callToAction}`;
    }

    prompt += `

Please provide:
1. A compelling subject line
2. Professional greeting
3. Clear and concise body content
4. Appropriate call to action
5. Professional closing

Make the email engaging, clear, and actionable while maintaining the specified tone.`;

    return prompt;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }
    
    if (!formData.recipient.trim()) {
      newErrors.recipient = 'Recipient is required';
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
      // Generate prompt using OpenAI
      const response = await fetch("/api/generate-email-prompt", {
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
        templateId: 'emails',
        templateName: 'Email',
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
    
    const hasRequiredFields = formData.purpose && formData.recipient && formData.tone;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const hasRequiredFields = formData.purpose && formData.recipient && formData.tone;
    if (!hasRequiredFields) return '';
    
    return generateEmailPrompt(formData);
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
          <h2 className="text-3xl font-bold text-gray-900">Email Prompt Producer</h2>
          <p className="text-gray-600 mt-2">Create professional email prompts for various purposes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Email Details</CardTitle>
              <div className="hidden md:block">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center text-blue-700">
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
                <Label htmlFor="purpose">
                  Email Purpose <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="purpose"
                  placeholder="e.g., follow up on meeting, introduce new service, request information"
                  value={formData.purpose}
                  onChange={(e) => handleFieldChange('purpose', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What is the main purpose of this email?
                </p>
                {errors.purpose && (
                  <p className="text-xs text-red-500">{errors.purpose}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">
                  Target Recipient <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="recipient"
                  placeholder="e.g., potential clients, existing customers, business partners"
                  value={formData.recipient}
                  onChange={(e) => handleFieldChange('recipient', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Who will receive this email?
                </p>
                {errors.recipient && (
                  <p className="text-xs text-red-500">{errors.recipient}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">
                  Email Tone <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('tone', value)} value={formData.tone}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select email tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="appreciative">Appreciative</SelectItem>
                    <SelectItem value="informative">Informative</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Choose the appropriate tone for your audience
                </p>
                {errors.tone && (
                  <p className="text-xs text-red-500">{errors.tone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyPoints">
                  Key Points to Include
                </Label>
                <Textarea
                  id="keyPoints"
                  placeholder="e.g., project timeline, pricing details, next steps"
                  value={formData.keyPoints}
                  onChange={(e) => handleFieldChange('keyPoints', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Important information to include in the email
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="callToAction">
                  Call to Action
                </Label>
                <Input
                  id="callToAction"
                  placeholder="e.g., schedule a meeting, reply with questions, visit our website"
                  value={formData.callToAction}
                  onChange={(e) => handleFieldChange('callToAction', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What action do you want the recipient to take?
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" size={16} />
                {isGenerating ? 'Generating...' : 'Generate Email Prompt'}
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

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Tips for Better Email Prompts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Be clear about your email's purpose and goal</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Consider your recipient's perspective and needs</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Choose an appropriate tone for your relationship</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Include a clear call to action to drive response</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}