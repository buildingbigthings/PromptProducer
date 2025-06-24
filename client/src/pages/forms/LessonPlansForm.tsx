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

export default function LessonPlansForm() {
  const [formData, setFormData] = useState({
    contentType: '',
    subject: '',
    gradeLevel: '',
    duration: '',
    learningObjectives: '',
    priorKnowledge: '',
    teachingStyle: '',
    resources: '',
    assessment: ''
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
        description: "Your educational prompt has been saved to history.",
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
    
    if (!formData.contentType.trim()) {
      newErrors.contentType = 'Content type is required';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.gradeLevel.trim()) {
      newErrors.gradeLevel = 'Grade level is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-education-prompt", {
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
        templateId: 'lesson-plans',
        templateName: 'Educational Materials',
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
    
    const hasRequiredFields = formData.contentType && formData.subject && formData.gradeLevel;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const hasRequiredFields = formData.contentType && formData.subject && formData.gradeLevel;
    if (!hasRequiredFields) return '';
    
    return `Create ${formData.contentType} for ${formData.subject} at ${formData.gradeLevel} level${formData.duration ? ` lasting ${formData.duration}` : ''}...`;
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
          <h2 className="text-3xl font-bold text-gray-900">Educational Materials & Lesson Plans</h2>
          <p className="text-gray-600 mt-2">Create engaging educational content and lesson plans for various subjects and grade levels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Educational Content Details</CardTitle>
              <div className="hidden md:block">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <div className="flex items-center text-teal-700">
                    <Lightbulb className="mr-2" size={16} />
                    <span className="text-sm font-medium">Make learning engaging</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contentType">
                  Content Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('contentType', value)} value={formData.contentType}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lesson-plan">Lesson Plan</SelectItem>
                    <SelectItem value="curriculum">Curriculum Design</SelectItem>
                    <SelectItem value="worksheet">Worksheet/Activity</SelectItem>
                    <SelectItem value="quiz">Quiz/Assessment</SelectItem>
                    <SelectItem value="project">Project Assignment</SelectItem>
                    <SelectItem value="presentation">Educational Presentation</SelectItem>
                    <SelectItem value="study-guide">Study Guide</SelectItem>
                    <SelectItem value="rubric">Grading Rubric</SelectItem>
                    <SelectItem value="discussion">Discussion Questions</SelectItem>
                    <SelectItem value="experiment">Lab/Experiment</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What type of educational content do you need?
                </p>
                {errors.contentType && (
                  <p className="text-xs text-red-500">{errors.contentType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject/Topic <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="e.g., Algebra, World History, Biology, Creative Writing"
                  value={formData.subject}
                  onChange={(e) => handleFieldChange('subject', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What subject or specific topic will you teach?
                </p>
                {errors.subject && (
                  <p className="text-xs text-red-500">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradeLevel">
                  Grade/Age Level <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('gradeLevel', value)} value={formData.gradeLevel}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preschool">Preschool (3-5 years)</SelectItem>
                    <SelectItem value="elementary">Elementary (K-5)</SelectItem>
                    <SelectItem value="middle-school">Middle School (6-8)</SelectItem>
                    <SelectItem value="high-school">High School (9-12)</SelectItem>
                    <SelectItem value="college">College/University</SelectItem>
                    <SelectItem value="adult-education">Adult Education</SelectItem>
                    <SelectItem value="professional-training">Professional Training</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What grade or age level are you teaching?
                </p>
                {errors.gradeLevel && (
                  <p className="text-xs text-red-500">{errors.gradeLevel}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration/Time Frame
                </Label>
                <Select onValueChange={(value) => handleFieldChange('duration', value)} value={formData.duration}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15-minutes">15 minutes</SelectItem>
                    <SelectItem value="30-minutes">30 minutes</SelectItem>
                    <SelectItem value="45-minutes">45 minutes</SelectItem>
                    <SelectItem value="1-hour">1 hour</SelectItem>
                    <SelectItem value="90-minutes">90 minutes</SelectItem>
                    <SelectItem value="full-day">Full day</SelectItem>
                    <SelectItem value="week-long">Week-long unit</SelectItem>
                    <SelectItem value="semester">Semester course</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  How long is the lesson or course?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningObjectives">
                  Learning Objectives & Goals
                </Label>
                <Textarea
                  id="learningObjectives"
                  placeholder="e.g., students will understand photosynthesis, solve quadratic equations, analyze historical events"
                  value={formData.learningObjectives}
                  onChange={(e) => handleFieldChange('learningObjectives', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What should students learn or be able to do?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priorKnowledge">
                  Prior Knowledge & Prerequisites
                </Label>
                <Textarea
                  id="priorKnowledge"
                  placeholder="e.g., basic arithmetic, familiarity with scientific method, previous history knowledge"
                  value={formData.priorKnowledge}
                  onChange={(e) => handleFieldChange('priorKnowledge', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What should students already know?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teachingStyle">
                  Teaching Style & Approach
                </Label>
                <Select onValueChange={(value) => handleFieldChange('teachingStyle', value)} value={formData.teachingStyle}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select teaching approach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interactive">Interactive/Hands-on</SelectItem>
                    <SelectItem value="lecture">Lecture-based</SelectItem>
                    <SelectItem value="collaborative">Collaborative Learning</SelectItem>
                    <SelectItem value="inquiry-based">Inquiry-based</SelectItem>
                    <SelectItem value="project-based">Project-based</SelectItem>
                    <SelectItem value="flipped-classroom">Flipped Classroom</SelectItem>
                    <SelectItem value="differentiated">Differentiated Instruction</SelectItem>
                    <SelectItem value="gamification">Gamification</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What teaching approach works best for your students?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resources">
                  Available Resources & Materials
                </Label>
                <Textarea
                  id="resources"
                  placeholder="e.g., computers, lab equipment, textbooks, online tools, field trip opportunities"
                  value={formData.resources}
                  onChange={(e) => handleFieldChange('resources', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What resources and materials are available?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessment">
                  Assessment & Evaluation Methods
                </Label>
                <Input
                  id="assessment"
                  placeholder="e.g., quiz, presentation, group project, portfolio, observation"
                  value={formData.assessment}
                  onChange={(e) => handleFieldChange('assessment', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  How will you assess student learning?
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" size={16} />
                {isGenerating ? 'Generating...' : 'Generate Educational Content Prompt'}
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

      <Card className="bg-teal-50 border-teal-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-teal-900 mb-3 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Tips for Better Educational Content
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-teal-800">
            <div className="flex items-start">
              <CheckCircle className="text-teal-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Set clear, measurable learning objectives</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-teal-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Consider different learning styles and abilities</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-teal-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Include interactive and engaging activities</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-teal-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Plan for assessment and feedback opportunities</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}