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

export default function CodeHelpForm() {
  const [formData, setFormData] = useState({
    taskType: '',
    programmingLanguage: '',
    framework: '',
    description: '',
    skillLevel: '',
    context: '',
    requirements: '',
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
        description: "Your code help prompt has been saved to history.",
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
    
    if (!formData.taskType.trim()) {
      newErrors.taskType = 'Task type is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-code-prompt", {
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
        templateId: 'code-help',
        templateName: 'Code Generation',
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
    
    const hasRequiredFields = formData.taskType && formData.description;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const hasRequiredFields = formData.taskType && formData.description;
    if (!hasRequiredFields) return '';
    
    return `Help with ${formData.taskType}${formData.programmingLanguage ? ` in ${formData.programmingLanguage}` : ''}: ${formData.description}...`;
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
          <h2 className="text-3xl font-bold text-gray-900">Code Generation & Help</h2>
          <p className="text-gray-600 mt-2">Get assistance with coding tasks, debugging, and programming challenges.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Programming Task Details</CardTitle>
              <div className="hidden md:block">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center text-green-700">
                    <Lightbulb className="mr-2" size={16} />
                    <span className="text-sm font-medium">Be specific about your needs</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="taskType">
                  What do you need help with? <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('taskType', value)} value={formData.taskType}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code-generation">Code Generation</SelectItem>
                    <SelectItem value="debugging">Debugging & Error Fixing</SelectItem>
                    <SelectItem value="code-review">Code Review & Optimization</SelectItem>
                    <SelectItem value="algorithm">Algorithm Development</SelectItem>
                    <SelectItem value="api-integration">API Integration</SelectItem>
                    <SelectItem value="database-queries">Database Queries</SelectItem>
                    <SelectItem value="testing">Testing & Unit Tests</SelectItem>
                    <SelectItem value="documentation">Code Documentation</SelectItem>
                    <SelectItem value="refactoring">Code Refactoring</SelectItem>
                    <SelectItem value="learning">Learning & Explanation</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What type of programming assistance do you need?
                </p>
                {errors.taskType && (
                  <p className="text-xs text-red-500">{errors.taskType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="programmingLanguage">
                  Programming Language
                </Label>
                <Select onValueChange={(value) => handleFieldChange('programmingLanguage', value)} value={formData.programmingLanguage}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="swift">Swift</SelectItem>
                    <SelectItem value="kotlin">Kotlin</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Which programming language are you working with?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="framework">
                  Framework/Technology
                </Label>
                <Input
                  id="framework"
                  placeholder="e.g., React, Django, Spring Boot, Laravel"
                  value={formData.framework}
                  onChange={(e) => handleFieldChange('framework', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Any specific frameworks or technologies involved?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Detailed Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="e.g., I need to create a function that validates email addresses, or I'm getting an error when trying to connect to my database"
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={4}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Describe exactly what you need help with
                </p>
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillLevel">
                  Your Experience Level
                </Label>
                <Select onValueChange={(value) => handleFieldChange('skillLevel', value)} value={formData.skillLevel}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  This helps tailor the explanation level
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">
                  Project Context
                </Label>
                <Textarea
                  id="context"
                  placeholder="e.g., building an e-commerce site, working on a data analysis project, fixing a legacy system"
                  value={formData.context}
                  onChange={(e) => handleFieldChange('context', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What's the broader context of your project?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">
                  Specific Requirements
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="e.g., must be performant, needs to handle large datasets, should follow best practices"
                  value={formData.requirements}
                  onChange={(e) => handleFieldChange('requirements', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Any specific requirements or goals?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">
                  Constraints & Limitations
                </Label>
                <Textarea
                  id="constraints"
                  placeholder="e.g., can't use external libraries, must be compatible with older browsers, memory limitations"
                  value={formData.constraints}
                  onChange={(e) => handleFieldChange('constraints', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Any constraints or limitations to consider?
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" size={16} />
                {isGenerating ? 'Generating...' : 'Generate Code Help Prompt'}
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

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Tips for Better Code Assistance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Include specific error messages if debugging</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Mention your programming experience level</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Provide context about your project goals</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Specify any constraints or requirements</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}