import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTemplateById } from "@/data/templates";
import { PromptForm } from "@/components/prompt-form";
import { PromptOutput } from "@/components/prompt-output";
import { RoleSelector } from "@/components/role-selector";
import { PromptGoals } from "@/components/prompt-goals";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function CustomerSupportForm() {
  const [searchParams] = useSearchParams();
  const description = searchParams.get('description') || '';
  
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [promptExplanation, setPromptExplanation] = useState('');

  const template = getTemplateById('customer-support');
  if (!template) return <div>Template not found</div>;

  const { mutate: generatePrompt, isPending: isGenerating } = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      return await apiRequest('/api/generate-customer-support-prompt', 'POST', {
        ...data,
        role: selectedRole,
        goal: selectedGoal,
        description
      }) as unknown as { prompt: string; explanation: string };
    },
    onSuccess: (data) => {
      setGeneratedPrompt(data.prompt);
      setPromptExplanation(data.explanation || '');
    }
  });

  const { mutate: refinePrompt, isPending: isRefining } = useMutation({
    mutationFn: async (refinement: string) => {
      return await apiRequest('/api/refine-prompt', 'POST', {
        originalPrompt: generatedPrompt,
        refinement,
        goal: selectedGoal
      }) as unknown as { prompt: string };
    },
    onSuccess: (data) => {
      setGeneratedPrompt(data.prompt);
    }
  });

  const handleFormChange = (data: Record<string, string>) => {
    setFormData(data);
  };

  const handleFormSubmit = (data: Record<string, string>) => {
    const fullData = { ...data, description };
    generatePrompt(fullData);
  };

  const handlePromptRefinement = (refinement: string) => {
    refinePrompt(refinement);
  };

  const getPreviewPrompt = () => {
    if (Object.keys(formData).length === 0) return '';
    const fullData = { ...formData, description };
    return template.generatePrompt(fullData);
  };

  const getPromptStatus = () => {
    if (generatedPrompt) return 'ready';
    if (Object.keys(formData).some(key => formData[key])) return 'preview';
    return 'empty';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
              <ArrowLeft className="mr-2" size={16} />
              Back to Categories
            </Button>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Customer Support Prompt Producer</h2>
          <p className="text-gray-600 mt-2">Write calm replies to frustrated customers, draft refund emails, and create clear support responses.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <PromptGoals 
              onGoalChange={setSelectedGoal}
              className="mb-6"
            />
            
            <RoleSelector
              templateId="customer-support"
              description={description}
              onRoleChange={setSelectedRole}
              className="mb-6"
            />

            {description && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Sparkles className="mr-2" size={16} />
                  Your Support Scenario
                </h3>
                <p className="text-blue-800">{description}</p>
              </div>
            )}

            <PromptForm
              template={template}
              onSubmit={handleFormSubmit}
              onChange={handleFormChange}
              isGenerating={isGenerating}
            />
          </div>

          <div className="lg:sticky lg:top-8">
            <PromptOutput
              prompt={generatedPrompt || getPreviewPrompt()}
              isPreview={!generatedPrompt}
              status={getPromptStatus()}
              onRefine={handlePromptRefinement}
              promptGoal={selectedGoal || undefined}
              promptExplanation={promptExplanation}
              isRefining={isRefining}
            />
          </div>
        </div>
      </div>
    </div>
  );
}