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

export default function SocialForm() {
  const [formData, setFormData] = useState({
    platform: '',
    contentType: '',
    topic: '',
    tone: '',
    audience: '',
    hashtags: '',
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
        description: "Your social media prompt has been saved to history.",
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

  const generateSocialPrompt = (data: typeof formData) => {
    let prompt = `Act as a social media content creator and marketing expert. Create engaging ${data.contentType || 'social media content'} for ${data.platform || 'social media platforms'}.

Content requirements:
- Platform: ${data.platform}
- Content type: ${data.contentType}
- Topic: ${data.topic}
- Target audience: ${data.audience || 'general audience'}
- Tone: ${data.tone || 'engaging'}`;

    if (data.hashtags) {
      prompt += `
- Include hashtags: ${data.hashtags}`;
    }

    if (data.callToAction) {
      prompt += `
- Call to action: ${data.callToAction}`;
    }

    prompt += `

Please provide:
1. Compelling post copy optimized for ${data.platform}
2. Relevant hashtags to increase reach
3. Engaging hook to capture attention
4. Clear call to action if applicable
5. Platform-specific formatting suggestions

Make the content shareable, engaging, and aligned with current social media best practices for ${data.platform}.`;

    return prompt;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.platform.trim()) {
      newErrors.platform = 'Platform is required';
    }
    
    if (!formData.contentType.trim()) {
      newErrors.contentType = 'Content type is required';
    }

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
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
      const response = await fetch("/api/generate-social-prompt", {
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
        templateId: 'social-media',
        templateName: 'Social Media',
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
    
    const hasRequiredFields = formData.platform && formData.contentType && formData.topic && formData.tone;
    if (hasRequiredFields) return 'preview';
    
    return 'empty';
  };

  const getPreviewPrompt = () => {
    if (generatedPrompt) return generatedPrompt;
    
    const hasRequiredFields = formData.platform && formData.contentType && formData.topic && formData.tone;
    if (!hasRequiredFields) return '';
    
    return generateSocialPrompt(formData);
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
          <h2 className="text-3xl font-bold text-gray-900">Social Media Prompt Producer</h2>
          <p className="text-gray-600 mt-2">Create engaging social media content prompts for various platforms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Social Media Details</CardTitle>
              <div className="hidden md:block">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center text-blue-700">
                    <Lightbulb className="mr-2" size={16} />
                    <span className="text-sm font-medium">Platform-specific content works best</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform">
                  Platform <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('platform', value)} value={formData.platform}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select social media platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="pinterest">Pinterest</SelectItem>
                    <SelectItem value="threads">Threads</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Choose the primary platform for this content
                </p>
                {errors.platform && (
                  <p className="text-xs text-red-500">{errors.platform}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentType">
                  Content Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('contentType', value)} value={formData.contentType}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post">Regular Post</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="reel">Reel/Short Video</SelectItem>
                    <SelectItem value="carousel">Carousel Post</SelectItem>
                    <SelectItem value="poll">Poll</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="behind-the-scenes">Behind the Scenes</SelectItem>
                    <SelectItem value="user-generated">User Generated Content</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  What type of content are you creating?
                </p>
                {errors.contentType && (
                  <p className="text-xs text-red-500">{errors.contentType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">
                  Topic/Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., new product launch, tips for productivity, company culture"
                  value={formData.topic}
                  onChange={(e) => handleFieldChange('topic', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What is the main topic or subject of your content?
                </p>
                {errors.topic && (
                  <p className="text-xs text-red-500">{errors.topic}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">
                  Tone <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('tone', value)} value={formData.tone}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="funny">Funny</SelectItem>
                    <SelectItem value="inspiring">Inspiring</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="trendy">Trendy</SelectItem>
                    <SelectItem value="authentic">Authentic</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Choose the tone that matches your brand voice
                </p>
                {errors.tone && (
                  <p className="text-xs text-red-500">{errors.tone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">
                  Target Audience
                </Label>
                <Input
                  id="audience"
                  placeholder="e.g., young professionals, fitness enthusiasts, small business owners"
                  value={formData.audience}
                  onChange={(e) => handleFieldChange('audience', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Who is your target audience?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hashtags">
                  Relevant Keywords/Hashtags
                </Label>
                <Textarea
                  id="hashtags"
                  placeholder="e.g., productivity, workfromhome, entrepreneur, motivation"
                  value={formData.hashtags}
                  onChange={(e) => handleFieldChange('hashtags', e.target.value)}
                  rows={2}
                  className="resize-none transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  Enter relevant keywords or hashtags (comma separated)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="callToAction">
                  Call to Action
                </Label>
                <Input
                  id="callToAction"
                  placeholder="e.g., visit website, sign up, share your thoughts, tag a friend"
                  value={formData.callToAction}
                  onChange={(e) => handleFieldChange('callToAction', e.target.value)}
                  className="transition-colors duration-200"
                />
                <p className="text-xs text-gray-500">
                  What action do you want your audience to take?
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" size={16} />
                {isGenerating ? 'Generating...' : 'Generate Social Media Prompt'}
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
            Tips for Better Social Media Content
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Tailor content to each platform's unique audience and format</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Use relevant hashtags to increase discoverability</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Include clear calls to action to drive engagement</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>Keep your brand voice consistent across all content</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}