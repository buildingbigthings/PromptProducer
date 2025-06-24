// Simple keyword-based category detection
export function detectCategory(description: string): string | null {
  const lowerDesc = description.toLowerCase();
  
  // Blog post keywords
  const blogKeywords = ['blog', 'article', 'post', 'content', 'write', 'writing', 'seo', 'topic'];
  if (blogKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return 'blog-posts';
  }
  
  // Social media keywords
  const socialKeywords = ['social media', 'instagram', 'facebook', 'twitter', 'linkedin', 'post', 'caption', 'hashtag'];
  if (socialKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return 'social-media';
  }
  
  // Email keywords
  const emailKeywords = ['email', 'newsletter', 'message', 'send', 'contact', 'outreach', 'pitch'];
  if (emailKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return 'emails';
  }
  
  // Marketing keywords
  const marketingKeywords = ['marketing', 'campaign', 'promotion', 'sales', 'advertising', 'copy'];
  if (marketingKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return 'marketing-copy';
  }
  
  // Creative writing keywords
  const creativeKeywords = ['story', 'creative', 'fiction', 'narrative', 'character', 'plot'];
  if (creativeKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return 'creative-writing';
  }
  
  // Default to custom if no category detected
  return 'custom';
}