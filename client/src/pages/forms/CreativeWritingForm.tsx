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

export default function CreativeWritingForm() {
  const [formData, setFormData] = useState({
    projectType: '',
    genre: '',
    setting: '',
    characters: '',
    tone: '',
    themes: '',
    length: '',
    specialRequirements: ''
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
        description: "Your creative writing prompt has been saved to history.",
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
    
    if (!formData.projectType.trim()) {
      newErrors.projectType = 'Project type is required';
    }
    
    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required';
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
      const response = await fetch("/api/generate-creative-prompt", {
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
        templateId: 'creative-writing',
        templateName: 'Creative Writing',
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
    
    const hasRequiredFields = formData.projectType && formData.genre && formData.tone;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const hasRequiredFields = formData.projectType && formData.genre && formData.tone;
    if (!hasRequiredFields) return '';
    
    return `Create a ${formData.tone} ${formData.genre} ${formData.projectType}${formData.setting ? ` set in ${formData.setting}` : ''}...`;
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
          <h2 className="text-3xl font-bold text-gray-900">Creative Writing Prompt Producer</h2>
          <p className="text-gray-600 mt-2">Create compelling prompts for fiction, poetry, and creative projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Creative Project Details</CardTitle>
              <div className="hidden md:block">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center text-purple-700">
                    <Lightbulb className="mr-2" size={16} />
                    <span className="text-sm font-medium">Be creative and specific</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectType">
                  Project Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('projectType', value)} value={formData.projectType}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short-story">Short Story</SelectItem>
                    <SelectItem value="novel">Novel</SelectItem>
                    <SelectItem value="novella">Novella</SelectItem>
                    <SelectItem value="poem">Poem</SelectItem>
                    <SelectItem value="screenplay">Screenplay</SelectItem>
                    <SelectItem value="character-development">Character Development</SelectItem>
                    <SelectItem value="world-building">World Building</SelectItem>
                    <SelectItem value="dialogue">Dialogue</SelectItem>
                    <SelectItem value="flash-fiction">Flash Fiction</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What type of creative writing project are you working on?
                </p>
                {errors.projectType && (
                  <p className="text-xs text-red-500">{errors.projectType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">
                  Genre <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('genre', value)} value={formData.genre}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="science-fiction">Science Fiction</SelectItem>
                    <SelectItem value="mystery">Mystery</SelectItem>
                    <SelectItem value="thriller">Thriller</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="literary-fiction">Literary Fiction</SelectItem>
                    <SelectItem value="historical-fiction">Historical Fiction</SelectItem>
                    <SelectItem value="horror">Horror</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="contemporary">Contemporary</SelectItem>
                    <SelectItem value="magical-realism">Magical Realism</SelectItem>
                    <SelectItem value="experimental">Experimental</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Choose the primary genre for your project
                </p>
                {errors.genre && (
                  <p className="text-xs text-red-500">{errors.genre}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="setting">
                  Setting/World
                </Label>
                <Input
                  id="setting"
                  placeholder="e.g., Victorian London, distant planet, small town in 1950s America"
                  value={formData.setting}
                  onChange={(e) => handleFieldChange('setting', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Describe the time period, location, or world where your story takes place
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="characters">
                  Main Characters
                </Label>
                <Textarea
                  id="characters"
                  placeholder="e.g., a reluctant hero seeking redemption, a mysterious stranger with a dark secret"
                  value={formData.characters}
                  onChange={(e) => handleFieldChange('characters', e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Describe the main characters, their roles, or personality traits
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">
                  Tone/Mood <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('tone', value)} value={formData.tone}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="lighthearted">Lighthearted</SelectItem>
                    <SelectItem value="mysterious">Mysterious</SelectItem>
                    <SelectItem value="romantic">Romantic</SelectItem>
                    <SelectItem value="suspenseful">Suspenseful</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="melancholic">Melancholic</SelectItem>
                    <SelectItem value="uplifting">Uplifting</SelectItem>
                    <SelectItem value="gritty">Gritty</SelectItem>
                    <SelectItem value="whimsical">Whimsical</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="intimate">Intimate</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What mood or atmosphere should your writing convey?
                </p>
                {errors.tone && (
                  <p className="text-xs text-red-500">{errors.tone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="themes">
                  Themes/Messages
                </Label>
                <Textarea
                  id="themes"
                  placeholder="e.g., love conquers all, the cost of ambition, finding one's identity"
                  value={formData.themes}
                  onChange={(e) => handleFieldChange('themes', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What themes or messages do you want to explore?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">
                  Target Length
                </Label>
                <Select onValueChange={(value) => handleFieldChange('length', value)} value={formData.length}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select target length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flash-fiction">Flash Fiction (under 1,000 words)</SelectItem>
                    <SelectItem value="short-story">Short Story (1,000-7,500 words)</SelectItem>
                    <SelectItem value="novelette">Novelette (7,500-17,500 words)</SelectItem>
                    <SelectItem value="novella">Novella (17,500-40,000 words)</SelectItem>
                    <SelectItem value="novel">Novel (40,000+ words)</SelectItem>
                    <SelectItem value="poem">Poem (varies)</SelectItem>
                    <SelectItem value="chapter">Single Chapter</SelectItem>
                    <SelectItem value="scene">Single Scene</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  How long do you want the finished piece to be?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequirements">
                  Special Requirements
                </Label>
                <Textarea
                  id="specialRequirements"
                  placeholder="e.g., first-person narration, multiple POVs, specific literary devices"
                  value={formData.specialRequirements}
                  onChange={(e) => handleFieldChange('specialRequirements', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Any specific writing techniques, constraints, or requirements?
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" size={16} />
                {isGenerating ? 'Generating...' : 'Generate Creative Writing Prompt'}
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

      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Tips for Better Creative Writing Prompts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
            <div className="flex items-start">
              <CheckCircle className="text-purple-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Be specific about your genre and setting details</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-purple-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Include character motivations and conflicts</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-purple-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Define the emotional tone you want to achieve</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-purple-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Consider what themes resonate with your story</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}