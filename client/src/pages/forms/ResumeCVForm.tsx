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

export default function ResumeCVForm() {
  const [formData, setFormData] = useState({
    documentType: '',
    jobTitle: '',
    industry: '',
    experienceLevel: '',
    keySkills: '',
    achievements: '',
    targetCompany: '',
    requirements: ''
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
        description: "Your resume/CV prompt has been saved to history.",
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
    
    if (!formData.documentType.trim()) {
      newErrors.documentType = 'Document type is required';
    }
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.experienceLevel.trim()) {
      newErrors.experienceLevel = 'Experience level is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-resume-prompt", {
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
        templateId: 'resume-cv',
        templateName: 'Resumes & CVs',
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
    
    const hasRequiredFields = formData.documentType && formData.jobTitle && formData.experienceLevel;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const hasRequiredFields = formData.documentType && formData.jobTitle && formData.experienceLevel;
    if (!hasRequiredFields) return '';
    
    return `Create a ${formData.documentType} for a ${formData.experienceLevel} ${formData.jobTitle}${formData.industry ? ` in ${formData.industry}` : ''}...`;
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
          <h2 className="text-3xl font-bold text-gray-900">Resume & CV Builder</h2>
          <p className="text-gray-600 mt-2">Create professional resumes, CVs, and cover letters tailored to specific roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Career Document Details</CardTitle>
              <div className="hidden md:block">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <div className="flex items-center text-indigo-700">
                    <Lightbulb className="mr-2" size={16} />
                    <span className="text-sm font-medium">Highlight your achievements</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="documentType">
                  Document Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('documentType', value)} value={formData.documentType}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resume">Resume</SelectItem>
                    <SelectItem value="cv">CV (Curriculum Vitae)</SelectItem>
                    <SelectItem value="cover-letter">Cover Letter</SelectItem>
                    <SelectItem value="linkedin-summary">LinkedIn Summary</SelectItem>
                    <SelectItem value="portfolio-bio">Portfolio Bio</SelectItem>
                    <SelectItem value="executive-summary">Executive Summary</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What type of document do you need?
                </p>
                {errors.documentType && (
                  <p className="text-xs text-red-500">{errors.documentType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">
                  Target Job Title/Role <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g., Software Engineer, Marketing Manager, Data Scientist"
                  value={formData.jobTitle}
                  onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What position are you applying for?
                </p>
                {errors.jobTitle && (
                  <p className="text-xs text-red-500">{errors.jobTitle}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">
                  Industry/Field
                </Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Finance, Education"
                  value={formData.industry}
                  onChange={(e) => handleFieldChange('industry', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What industry are you targeting?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel">
                  Experience Level <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('experienceLevel', value)} value={formData.experienceLevel}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry-level">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid-level">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior-level">Senior Level (6-10 years)</SelectItem>
                    <SelectItem value="executive">Executive (10+ years)</SelectItem>
                    <SelectItem value="career-change">Career Change</SelectItem>
                    <SelectItem value="returning">Returning to Work</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What's your experience level?
                </p>
                {errors.experienceLevel && (
                  <p className="text-xs text-red-500">{errors.experienceLevel}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="keySkills">
                  Key Skills & Competencies
                </Label>
                <Textarea
                  id="keySkills"
                  placeholder="e.g., Python, project management, data analysis, leadership, communication"
                  value={formData.keySkills}
                  onChange={(e) => handleFieldChange('keySkills', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  List your most relevant skills and competencies
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">
                  Key Achievements & Accomplishments
                </Label>
                <Textarea
                  id="achievements"
                  placeholder="e.g., increased sales by 30%, led team of 10, reduced costs by $50k"
                  value={formData.achievements}
                  onChange={(e) => handleFieldChange('achievements', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Highlight your most impressive achievements with metrics
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetCompany">
                  Target Company/Organization
                </Label>
                <Input
                  id="targetCompany"
                  placeholder="e.g., Google, Mayo Clinic, local startups"
                  value={formData.targetCompany}
                  onChange={(e) => handleFieldChange('targetCompany', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Any specific company or type of organization?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">
                  Special Requirements & Focus Areas
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="e.g., emphasize remote work experience, highlight leadership skills, focus on technical abilities"
                  value={formData.requirements}
                  onChange={(e) => handleFieldChange('requirements', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Any specific requirements or areas to emphasize?
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" size={16} />
                {isGenerating ? 'Generating...' : 'Generate Resume/CV Prompt'}
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

      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Tips for Better Resume/CV Content
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
            <div className="flex items-start">
              <CheckCircle className="text-indigo-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Use specific metrics and numbers in achievements</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-indigo-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Tailor content to match job requirements</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-indigo-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Focus on relevant skills and experiences</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-indigo-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Use action verbs and professional language</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}