import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PromptForm } from "@/components/prompt-form";
import { PromptOutput } from "@/components/prompt-output";
import { RoleSelector } from "@/components/role-selector";
import { PromptGoals } from "@/components/prompt-goals";
import { blogPostTemplate } from "@/data/templates";

export default function BlogPosts() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [promptExplanation, setPromptExplanation] = useState<string>('');
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
        description: "Your prompt has been saved to history.",
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

  const handleFormChange = (data: Record<string, string>) => {
    setFormData(data);
  };

  const handleFormSubmit = async (data: Record<string, string>) => {
    setIsGenerating(true);
    
    try {
      // Generate prompt using OpenAI
      const response = await fetch("/api/generate-blog-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      const result = await response.json();
      let prompt = result.prompt;
      
      // Add role prefix if selected
      if (selectedRole) {
        prompt = `Act as a ${selectedRole}. ${prompt}`;
      }
      
      setGeneratedPrompt(prompt);
      setIsGenerating(false);

      // Generate explanation for the prompt
      await generatePromptExplanation(prompt);

      // Save to database with enhanced metadata
      await savePromptMutation.mutateAsync({
        templateId: blogPostTemplate.id,
        templateName: blogPostTemplate.name,
        formData: data,
        generatedPrompt: prompt,
        promptGoal: selectedGoal,
        promptRole: selectedRole,
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

  const generatePromptExplanation = async (prompt: string) => {
    try {
      const response = await fetch("/api/explain-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, templateId: 'blog-posts' }),
      });

      if (response.ok) {
        const result = await response.json();
        setPromptExplanation(result.explanation);
      }
    } catch (error) {
      console.error("Failed to generate explanation:", error);
    }
  };

  const handlePromptRefinement = async (refinementRequest: string) => {
    if (!generatedPrompt) return;
    
    setIsRefining(true);
    try {
      const response = await fetch("/api/refine-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalPrompt: generatedPrompt,
          refinementRequest,
          templateId: 'blog-posts'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedPrompt(result.prompt);
        await generatePromptExplanation(result.prompt);
        
        toast({
          title: "Prompt refined!",
          description: "Your prompt has been improved based on your request.",
        });
      }
    } catch (error) {
      toast({
        title: "Refinement failed",
        description: "Could not refine prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const getPromptStatus = () => {
    if (generatedPrompt) return 'ready';
    
    const hasRequiredFields = formData.topic && formData.audience && formData.tone;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const { topic, audience, tone, keywords } = formData;
    const hasRequiredFields = topic && audience && tone;
    
    if (!hasRequiredFields) return '';
    
    let previewText = `Act as an SEO expert and blog writer. Create a detailed outline for a ~1,500 word blog post on '${topic}'. The tone should be ${tone}, targeting ${audience}.`;
    if (keywords && keywords.trim()) {
      previewText += ` Include SEO keywords such as ${keywords}.`;
    }
    
    return previewText;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/">
            <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4 p-0">
              <ArrowLeft className="mr-2" size={16} />
              Back to Categories
            </Button>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Blog Post Prompt Producer</h2>
          <p className="text-gray-600 mt-2">Fill out the details below to generate your custom blog post prompt.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <PromptGoals 
            onGoalChange={setSelectedGoal}
          />
          
          <RoleSelector 
            templateId="blog-posts"
            description={formData.topic || ''}
            onRoleChange={setSelectedRole}
          />
          
          <PromptForm
            template={blogPostTemplate}
            onSubmit={handleFormSubmit}
            onChange={handleFormChange}
            isGenerating={isGenerating}
          />
        </div>
        
        <PromptOutput
          prompt={getPreviewPrompt()}
          isPreview={!generatedPrompt}
          status={getPromptStatus()}
          onRefine={handlePromptRefinement}
          promptGoal={selectedGoal || undefined}
          promptExplanation={promptExplanation}
          isRefining={isRefining}
          templateCategory="blog-posts"
          originalGoal={formData.purpose || formData.topic || "Create engaging blog post"}
          onPromptUpdate={(newPrompt) => setGeneratedPrompt(newPrompt)}
        />
      </div>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Tips for Better Prompts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Be specific about your topic and target audience for more relevant results</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Include relevant SEO keywords to improve content discoverability</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Choose a tone that matches your brand voice and audience expectations</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>You can modify the generated prompt before using it with AI tools</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
