import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Wand2 } from "lucide-react";

interface RoleSelectorProps {
  templateId: string;
  description: string;
  onRoleChange: (role: string | null) => void;
  className?: string;
}

const roleMapping: Record<string, string[]> = {
  'blog-posts': [
    'SEO content strategist',
    'expert blog writer',
    'content marketing specialist',
    'industry thought leader',
    'digital marketing expert'
  ],
  'social-media': [
    'social media manager',
    'brand strategist',
    'community manager',
    'viral content creator',
    'social media influencer'
  ],
  'emails': [
    'email marketing specialist',
    'customer success manager',
    'sales professional',
    'business communication expert',
    'relationship manager'
  ],
  'creative-writing': [
    'creative writing instructor',
    'storytelling expert',
    'fiction writer',
    'narrative consultant',
    'creative director'
  ],
  'marketing-copy': [
    'conversion copywriter',
    'brand strategist',
    'marketing psychologist',
    'sales funnel expert',
    'direct response marketer'
  ],
  'idea-generation': [
    'innovation consultant',
    'creative thinking facilitator',
    'design thinking expert',
    'business strategist',
    'brainstorming facilitator'
  ],
  'scripts': [
    'YouTube scriptwriter',
    'video content creator',
    'podcast producer',
    'presentation coach',
    'media production expert'
  ],
  'code-help': [
    'senior software engineer',
    'coding mentor',
    'technical architect',
    'full-stack developer',
    'programming instructor'
  ],
  'resumes-cvs': [
    'career coach',
    'HR specialist',
    'recruitment expert',
    'professional development consultant',
    'executive resume writer'
  ],
  'lesson-plans': [
    'educational consultant',
    'curriculum designer',
    'instructional designer',
    'teaching specialist',
    'learning experience designer'
  ]
};

export function RoleSelector({ templateId, description, onRoleChange, className = '' }: RoleSelectorProps) {
  const [useAISuggestion, setUseAISuggestion] = useState(true);
  const [customRole, setCustomRole] = useState('');
  const [suggestedRole, setSuggestedRole] = useState<string | null>(null);
  const [isGeneratingRole, setIsGeneratingRole] = useState(false);

  const defaultRoles = roleMapping[templateId] || ['expert consultant', 'specialist', 'professional advisor'];

  useEffect(() => {
    if (useAISuggestion && description && description.length > 10) {
      generateRoleSuggestion();
    } else if (!useAISuggestion) {
      setSuggestedRole(null);
      onRoleChange(customRole || null);
    }
  }, [description, useAISuggestion, customRole]);

  const generateRoleSuggestion = async () => {
    if (!description || description.length < 10) return;
    
    setIsGeneratingRole(true);
    try {
      const response = await fetch('/api/suggest-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description, 
          templateId,
          defaultRoles 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuggestedRole(data.role);
        onRoleChange(data.role);
      }
    } catch (error) {
      console.error('Failed to generate role suggestion:', error);
      // Fallback to a default role from the template
      const fallbackRole = defaultRoles[0];
      setSuggestedRole(fallbackRole);
      onRoleChange(fallbackRole);
    } finally {
      setIsGeneratingRole(false);
    }
  };

  const handleCustomRoleChange = (value: string) => {
    setCustomRole(value);
    if (!useAISuggestion) {
      onRoleChange(value || null);
    }
  };

  const handleUseAISuggestionChange = (checked: boolean) => {
    setUseAISuggestion(checked);
    if (checked && description) {
      generateRoleSuggestion();
    } else {
      setSuggestedRole(null);
      onRoleChange(customRole || null);
    }
  };

  const selectDefaultRole = (role: string) => {
    setCustomRole(role);
    setUseAISuggestion(false);
    onRoleChange(role);
  };

  return (
    <Card className={`border border-indigo-200 bg-indigo-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-indigo-900 flex items-center">
          <User className="mr-2" size={18} />
          Act-As Role
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-ai-suggestion"
            checked={useAISuggestion}
            onCheckedChange={handleUseAISuggestionChange}
          />
          <Label htmlFor="use-ai-suggestion" className="text-sm text-indigo-800">
            Let AI suggest the best role based on my description
          </Label>
        </div>

        {useAISuggestion && (
          <div>
            {isGeneratingRole ? (
              <div className="flex items-center space-x-2 text-indigo-700">
                <Wand2 className="animate-pulse" size={16} />
                <span className="text-sm">Analyzing your request to suggest the best role...</span>
              </div>
            ) : suggestedRole ? (
              <div className="space-y-2">
                <Label className="text-sm text-indigo-800">AI Suggested Role:</Label>
                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Act as a {suggestedRole}
                </Badge>
              </div>
            ) : description && description.length > 10 ? (
              <div className="text-sm text-indigo-600">
                Add more details to your description for better role suggestions
              </div>
            ) : null}
          </div>
        )}

        {!useAISuggestion && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="custom-role" className="text-sm text-indigo-800">
                Specify your own role:
              </Label>
              <Input
                id="custom-role"
                placeholder="e.g., marketing expert, data scientist, creative director"
                value={customRole}
                onChange={(e) => handleCustomRoleChange(e.target.value)}
                className="mt-1 bg-white"
              />
            </div>
            
            <div>
              <Label className="text-sm text-indigo-800">Or choose from common roles:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {defaultRoles.map((role, index) => (
                  <button
                    key={index}
                    onClick={() => selectDefaultRole(role)}
                    className="text-xs px-3 py-1 bg-white border border-indigo-300 rounded-full hover:bg-indigo-100 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-indigo-600 leading-relaxed">
          <strong>Why roles matter:</strong> Starting your prompt with "Act as a [role]" dramatically improves AI responses by giving context about expertise level, perspective, and expected output quality.
        </div>
      </CardContent>
    </Card>
  );
}