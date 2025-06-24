import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Wand2, Lightbulb } from "lucide-react";
import { type PromptTemplate } from "@/data/templates";

interface PromptFormProps {
  template: PromptTemplate;
  onSubmit: (data: Record<string, string>) => void;
  onChange: (data: Record<string, string>) => void;
  isGenerating?: boolean;
}

export function PromptForm({ template, onSubmit, onChange, isGenerating = false }: PromptFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.fields.forEach(field => {
      initial[field.name] = '';
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Call onChange whenever form values change
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    template.fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{template.name} Details</CardTitle>
          <div className="hidden md:block">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center text-blue-700">
                <Lightbulb className="mr-2" size={16} />
                <span className="text-sm font-medium">Tip: Be specific for better results</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {template.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === 'text' && (
                <Input 
                  id={field.name}
                  placeholder={field.placeholder} 
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className="transition-colors duration-200"
                />
              )}
              
              {field.type === 'textarea' && (
                <Textarea 
                  id={field.name}
                  placeholder={field.placeholder} 
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  rows={3}
                  className="resize-none transition-colors duration-200"
                />
              )}
              
              {field.type === 'select' && (
                <Select onValueChange={(value) => handleFieldChange(field.name, value)} value={formData[field.name] || ''}>
                  <SelectTrigger className="transition-colors duration-200">
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {field.helpText && (
                <p className="text-xs text-gray-500">
                  {field.helpText}
                </p>
              )}
              
              {errors[field.name] && (
                <p className="text-xs text-red-500">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            disabled={isGenerating}
          >
            <Wand2 className="mr-2" size={16} />
            {isGenerating ? 'Generating...' : 'Generate Prompt'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
