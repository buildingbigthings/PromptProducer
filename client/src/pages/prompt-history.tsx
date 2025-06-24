import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Copy, Clock, FileText, Heart, MessageSquare, Tag, Search, Star, Filter, Edit3, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function PromptHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<any>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["/api/prompts"],
    queryFn: () => fetch("/api/prompts").then(res => res.json()),
  });

  const updatePromptMutation = useMutation({
    mutationFn: async (data: { id: number; isFavorite?: boolean; notes?: string; tags?: string[] }) => {
      const response = await fetch(`/api/prompts/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update prompt');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      toast({
        title: "Updated!",
        description: "Prompt has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Could not update prompt.",
        variant: "destructive",
      });
    },
  });

  const handleCopy = async (prompt: string) => {
    const success = await copyToClipboard(prompt);
    if (success) {
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard.",
      });
    }
  };

  const toggleFavorite = (promptId: number, currentFavorite: boolean) => {
    updatePromptMutation.mutate({
      id: promptId,
      isFavorite: !currentFavorite
    });
  };

  const handleEditPrompt = (prompt: any) => {
    setEditingPrompt(prompt);
    setEditNotes(prompt.notes || '');
    setEditTags(prompt.tags ? prompt.tags.join(', ') : '');
  };

  const savePromptEdits = () => {
    if (!editingPrompt) return;
    
    const tagsArray = editTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    updatePromptMutation.mutate({
      id: editingPrompt.id,
      notes: editNotes,
      tags: tagsArray
    });
    
    setEditingPrompt(null);
    setEditNotes('');
    setEditTags('');
  };

  const filteredPrompts = prompts?.filter((prompt: any) => {
    const matchesSearch = prompt.generatedPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (prompt.notes && prompt.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || prompt.templateId === filterCategory;
    const matchesFavorites = !showFavoritesOnly || prompt.isFavorite;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  }) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <h2 className="text-3xl font-bold text-gray-900">Prompt History</h2>
          <p className="text-gray-600 mt-2">View and manage your previously generated prompts with notes, tags, and favorites.</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search prompts, notes, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="blog-posts">Blog Posts</SelectItem>
                <SelectItem value="social-media">Social Media</SelectItem>
                <SelectItem value="emails">Emails</SelectItem>
                <SelectItem value="creative-writing">Creative Writing</SelectItem>
                <SelectItem value="marketing-copy">Marketing Copy</SelectItem>
                <SelectItem value="idea-generation">Idea Generation</SelectItem>
                <SelectItem value="scripts">Scripts</SelectItem>
                <SelectItem value="code-help">Code Help</SelectItem>
                <SelectItem value="resumes-cvs">Resumes & CVs</SelectItem>
                <SelectItem value="lesson-plans">Educational Materials</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={showFavoritesOnly ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <Heart className="mr-2" size={16} />
              Favorites
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPrompts && filteredPrompts.length > 0 ? (
        <div className="grid gap-4">
          {filteredPrompts.map((prompt: any) => (
            <Card key={prompt.id} className={`transition-all duration-200 ${prompt.isFavorite ? 'ring-2 ring-red-200 bg-red-50' : 'bg-white'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-lg">{prompt.templateName}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {prompt.templateId}
                    </Badge>
                    {prompt.promptGoal && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        Goal: {prompt.promptGoal}
                      </Badge>
                    )}
                    {prompt.promptRole && (
                      <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                        Role: {prompt.promptRole}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(prompt.id, prompt.isFavorite)}
                      className={prompt.isFavorite ? "text-red-600 hover:text-red-700" : "text-gray-400 hover:text-red-600"}
                    >
                      <Heart className={prompt.isFavorite ? "fill-current" : ""} size={16} />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleEditPrompt(prompt)}>
                          <Edit3 size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Prompt Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea
                              placeholder="Add notes about this prompt's performance, use cases, or effectiveness..."
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Tags</label>
                            <Input
                              placeholder="Add tags separated by commas (e.g., high-converting, GPT-4, Claude)"
                              value={editTags}
                              onChange={(e) => setEditTags(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingPrompt(null)}>
                              Cancel
                            </Button>
                            <Button onClick={savePromptEdits}>
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="mr-1" size={14} />
                      {formatDate(prompt.createdAt)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags Display */}
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Tag size={14} className="text-gray-500" />
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes Display */}
                  {prompt.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare size={14} className="text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Notes</span>
                      </div>
                      <p className="text-sm text-yellow-700">{prompt.notes}</p>
                    </div>
                  )}

                  {/* Form Data Summary */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Input Details:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(prompt.formData).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium text-gray-600">{key}:</span>
                          <span className="text-gray-800 ml-1">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Prompt */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Prompt:</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {prompt.generatedPrompt}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={() => handleCopy(prompt.generatedPrompt)}
                      className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
                    >
                      <Copy className="mr-2" size={16} />
                      Copy Prompt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts yet</h3>
              <p className="text-gray-500 mb-4">
                Start generating prompts to see them appear here.
              </p>
              <Link to="/form/blog-posts">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Your First Prompt
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}