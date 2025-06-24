export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  fields: FormField[];
  generatePrompt: (data: Record<string, string>) => string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

export const blogPostTemplate: PromptTemplate = {
  id: 'blog-posts',
  name: 'Blog Posts',
  description: 'Generate SEO-optimized blog post prompts with structured outlines and keyword integration.',
  icon: 'edit',
  available: true,
  fields: [
    {
      name: 'topic',
      label: 'Blog Post Topic',
      type: 'text',
      required: true,
      placeholder: "e.g., 'How to Start a Successful E-commerce Business'",
      helpText: 'Enter the main topic or title for your blog post'
    },
    {
      name: 'audience',
      label: 'Target Audience',
      type: 'select',
      required: true,
      options: [
        'beginners',
        'intermediate users',
        'advanced practitioners',
        'business owners',
        'entrepreneurs',
        'students',
        'professionals',
        'general audience'
      ],
      helpText: 'Who is the primary audience for this blog post?'
    },
    {
      name: 'tone',
      label: 'Writing Tone',
      type: 'select',
      required: true,
      options: [
        'professional',
        'conversational',
        'friendly',
        'authoritative',
        'educational',
        'inspiring',
        'casual',
        'formal'
      ],
      helpText: 'Choose the tone that best fits your brand and audience'
    },
    {
      name: 'keywords',
      label: 'SEO Keywords',
      type: 'textarea',
      required: false,
      placeholder: 'e.g., e-commerce, online business, digital marketing, startup tips',
      helpText: 'Enter relevant keywords separated by commas (optional but recommended)'
    }
  ],
  generatePrompt: (data) => {
    const { topic, audience, tone, keywords } = data;
    
    let prompt = `Act as an SEO expert and blog writer. Create a detailed outline for a ~1,500 word blog post on '${topic}'. The tone should be ${tone}, targeting ${audience}.`;
    
    if (keywords && keywords.trim()) {
      prompt += ` Include SEO keywords such as ${keywords}.`;
    }

    prompt += `

Please structure the outline with:
1. Compelling title options
2. Introduction hook and key points
3. Main sections with subheadings
4. Key takeaways for each section
5. Conclusion that drives action
6. Meta description suggestions

Ensure the content is valuable, engaging, and optimized for search engines while maintaining the ${tone} tone throughout.`;

    return prompt;
  }
};

export const promptTemplates: PromptTemplate[] = [
  blogPostTemplate,
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Create engaging social media content prompts for various platforms and audiences.',
    icon: 'twitter',
    available: true,
    fields: [],
    generatePrompt: () => ''
  },
  {
    id: 'creative-writing',
    name: 'Creative Writing',
    description: 'Develop creative storytelling and narrative prompts for fiction and creative projects.',
    icon: 'feather-alt',
    available: true,
    fields: [],
    generatePrompt: () => ''
  },
  {
    id: 'marketing-copy',
    name: 'Marketing Copy',
    description: 'Generate persuasive marketing and sales copy for various campaigns and channels.',
    icon: 'bullhorn',
    available: true,
    fields: [],
    generatePrompt: () => ''
  },
  {
    id: 'emails',
    name: 'Emails',
    description: 'Create professional email templates and communication prompts for various purposes.',
    icon: 'envelope',
    available: true,
    fields: [],
    generatePrompt: () => ''
  },
  {
    id: 'idea-generation',
    name: 'Idea Generation',
    description: 'Generate creative ideas and brainstorming prompts for projects and innovations.',
    icon: 'lightbulb',
    available: true,
    fields: [],
    generatePrompt: () => ''
  },
  {
    id: 'scripts',
    name: 'Scripts',
    description: 'Create engaging scripts for videos, podcasts, explainers, and presentations.',
    icon: 'video',
    available: true,
    fields: [],
    generatePrompt: () => ''
  },
  {
    id: 'code-help',
    name: 'Code Generation',
    description: 'Generate code snippets, debug help, and programming assistance prompts.',
    icon: 'code',
    available: true,
    fields: [],
    generatePrompt: () => ''
  },
  {
    id: 'resumes-cvs',
    name: 'Resumes & CVs',
    description: 'Create professional resumes, CVs, and cover letters tailored to specific roles.',
    icon: 'user',
    available: true,
    fields: [],
    generatePrompt: () => ''
  },
  {
    id: 'lesson-plans',
    name: 'Educational Materials',
    description: 'Develop lesson plans, educational content, and learning materials for various subjects.',
    icon: 'book',
    available: true,
    fields: [],
    generatePrompt: () => ''
  },
  {
    id: 'image-generation',
    name: 'Image Generation',
    description: 'Create detailed prompts for AI image generators like DALL-E, Midjourney, and Stable Diffusion.',
    icon: 'image',
    available: true,
    fields: [
      {
        name: 'subject',
        label: 'Main Subject',
        type: 'text',
        required: true,
        placeholder: 'A majestic mountain landscape...',
        helpText: 'Describe the main focus of your image'
      },
      {
        name: 'style',
        label: 'Art Style',
        type: 'select',
        required: true,
        options: [
          'Photorealistic',
          'Digital Art',
          'Oil Painting',
          'Watercolor',
          'Pencil Sketch',
          'Abstract',
          'Minimalist',
          'Vintage/Retro',
          'Cartoon/Animation',
          'Fantasy Art',
          'Concept Art',
          'Street Art'
        ],
        helpText: 'Choose the artistic style for your image'
      },
      {
        name: 'mood',
        label: 'Mood/Atmosphere',
        type: 'select',
        required: true,
        options: [
          'Serene/Peaceful',
          'Dramatic/Intense',
          'Mysterious/Dark',
          'Bright/Cheerful',
          'Romantic/Dreamy',
          'Epic/Heroic',
          'Cozy/Warm',
          'Futuristic/Sci-fi',
          'Nostalgic/Vintage',
          'Surreal/Otherworldly'
        ],
        helpText: 'Set the emotional tone of the image'
      },
      {
        name: 'lighting',
        label: 'Lighting',
        type: 'select',
        required: false,
        options: [
          'Natural daylight',
          'Golden hour',
          'Blue hour',
          'Dramatic shadows',
          'Soft diffused light',
          'Neon lighting',
          'Candlelight/Fire',
          'Moonlight',
          'Studio lighting',
          'Backlit/Silhouette'
        ],
        helpText: 'Specify the lighting conditions'
      },
      {
        name: 'composition',
        label: 'Composition',
        type: 'select',
        required: false,
        options: [
          'Close-up/Portrait',
          'Medium shot',
          'Wide shot/Landscape',
          'Bird\'s eye view',
          'Low angle',
          'High angle',
          'Rule of thirds',
          'Centered composition',
          'Symmetrical',
          'Dynamic/Action shot'
        ],
        helpText: 'Choose the framing and perspective'
      },
      {
        name: 'colors',
        label: 'Color Palette',
        type: 'text',
        required: false,
        placeholder: 'Warm earth tones, vibrant blues...',
        helpText: 'Describe preferred colors or color schemes'
      },
      {
        name: 'details',
        label: 'Specific Details',
        type: 'textarea',
        required: false,
        placeholder: 'Include specific elements, textures, objects...',
        helpText: 'Add any specific details or elements you want included'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.subject) {
        parts.push(data.subject);
      }
      
      if (data.style) {
        parts.push(`in ${data.style.toLowerCase()} style`);
      }
      
      if (data.mood) {
        parts.push(`with a ${data.mood.toLowerCase()} atmosphere`);
      }
      
      if (data.lighting) {
        parts.push(`lit by ${data.lighting.toLowerCase()}`);
      }
      
      if (data.composition) {
        parts.push(`${data.composition.toLowerCase()} composition`);
      }
      
      if (data.colors) {
        parts.push(`featuring ${data.colors.toLowerCase()}`);
      }
      
      if (data.details) {
        parts.push(`including ${data.details}`);
      }
      
      parts.push('high quality, detailed, professional');
      
      return parts.join(', ');
    }
  },
  {
    id: 'video-generation',
    name: 'Video Generation',
    description: 'Create prompts for AI video generators like Runway, Pika Labs, and Stable Video Diffusion.',
    icon: 'video',
    available: true,
    fields: [
      {
        name: 'concept',
        label: 'Video Concept',
        type: 'textarea',
        required: true,
        placeholder: 'A time-lapse of a flower blooming in a garden...',
        helpText: 'Describe what happens in your video'
      },
      {
        name: 'duration',
        label: 'Video Length',
        type: 'select',
        required: true,
        options: [
          'Short (2-4 seconds)',
          'Medium (4-8 seconds)',
          'Long (8-16 seconds)',
          'Extended (16+ seconds)'
        ],
        helpText: 'Choose the desired video duration'
      },
      {
        name: 'movement',
        label: 'Camera Movement',
        type: 'select',
        required: true,
        options: [
          'Static/No movement',
          'Slow pan left',
          'Slow pan right',
          'Zoom in',
          'Zoom out',
          'Dolly forward',
          'Dolly backward',
          'Orbit around subject',
          'Tilt up',
          'Tilt down',
          'Smooth tracking shot'
        ],
        helpText: 'Specify how the camera should move'
      },
      {
        name: 'style',
        label: 'Visual Style',
        type: 'select',
        required: true,
        options: [
          'Cinematic/Film-like',
          'Documentary style',
          'Music video aesthetic',
          'Commercial/Advertisement',
          'Artistic/Experimental',
          'Vintage/Retro',
          'Futuristic/Sci-fi',
          'Natural/Realistic',
          'Stylized/Animated',
          'Time-lapse',
          'Slow motion'
        ],
        helpText: 'Choose the overall visual style'
      },
      {
        name: 'mood',
        label: 'Mood/Tone',
        type: 'select',
        required: true,
        options: [
          'Peaceful/Serene',
          'Energetic/Dynamic',
          'Dramatic/Intense',
          'Mysterious/Suspenseful',
          'Joyful/Uplifting',
          'Melancholic/Emotional',
          'Epic/Grand',
          'Intimate/Personal',
          'Surreal/Dreamlike',
          'Professional/Corporate'
        ],
        helpText: 'Set the emotional tone of the video'
      },
      {
        name: 'lighting',
        label: 'Lighting Setup',
        type: 'select',
        required: false,
        options: [
          'Natural sunlight',
          'Golden hour lighting',
          'Blue hour ambiance',
          'Studio lighting',
          'Dramatic shadows',
          'Soft diffused light',
          'Neon/Artificial lighting',
          'Candlelight/Warm glow',
          'Moonlight/Night scene',
          'High contrast lighting'
        ],
        helpText: 'Specify the lighting conditions'
      },
      {
        name: 'setting',
        label: 'Setting/Location',
        type: 'text',
        required: false,
        placeholder: 'Modern office, forest clearing, urban rooftop...',
        helpText: 'Describe where the video takes place'
      },
      {
        name: 'details',
        label: 'Additional Details',
        type: 'textarea',
        required: false,
        placeholder: 'Specific objects, effects, transitions...',
        helpText: 'Include any specific elements or effects you want'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.concept) {
        parts.push(data.concept);
      }
      
      if (data.duration) {
        parts.push(`Duration: ${data.duration.toLowerCase()}`);
      }
      
      if (data.movement) {
        parts.push(`Camera: ${data.movement.toLowerCase()}`);
      }
      
      if (data.style) {
        parts.push(`Style: ${data.style.toLowerCase()}`);
      }
      
      if (data.mood) {
        parts.push(`Mood: ${data.mood.toLowerCase()}`);
      }
      
      if (data.lighting) {
        parts.push(`Lighting: ${data.lighting.toLowerCase()}`);
      }
      
      if (data.setting) {
        parts.push(`Setting: ${data.setting}`);
      }
      
      if (data.details) {
        parts.push(`Details: ${data.details}`);
      }
      
      parts.push('high quality, smooth motion, professional cinematography');
      
      return parts.join('. ');
    }
  },
  {
    id: 'customer-support',
    name: 'Customer Support & Communication',
    description: 'Write calm replies to frustrated customers, draft refund emails, and create clear support responses.',
    icon: 'headphones',
    available: true,
    fields: [
      {
        name: 'situation',
        label: 'Customer Situation',
        type: 'textarea',
        required: true,
        placeholder: 'Customer is frustrated about delayed delivery and requesting refund...',
        helpText: 'Describe the customer issue or situation'
      },
      {
        name: 'responseType',
        label: 'Response Type',
        type: 'select',
        required: true,
        options: [
          'Apologetic response to complaint',
          'Refund/compensation email',
          'Clear answer to complex question',
          'Follow-up after resolution',
          'Escalation to manager',
          'Product/service explanation',
          'Policy clarification'
        ],
        helpText: 'Choose the type of customer communication'
      },
      {
        name: 'tone',
        label: 'Desired Tone',
        type: 'select',
        required: true,
        options: [
          'Empathetic and understanding',
          'Professional and direct',
          'Apologetic and solution-focused',
          'Warm and friendly',
          'Confident and reassuring',
          'Formal and respectful'
        ],
        helpText: 'Set the tone for the customer interaction'
      },
      {
        name: 'outcome',
        label: 'Desired Outcome',
        type: 'select',
        required: false,
        options: [
          'Resolve and retain customer',
          'Provide refund gracefully',
          'Offer alternative solution',
          'Set clear expectations',
          'Escalate appropriately',
          'Build customer confidence'
        ],
        helpText: 'What outcome are you hoping to achieve?'
      },
      {
        name: 'constraints',
        label: 'Constraints/Policies',
        type: 'textarea',
        required: false,
        placeholder: 'Cannot offer full refund, but can provide store credit...',
        helpText: 'Any company policies or constraints to consider'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.situation) {
        parts.push(`Customer situation: ${data.situation}`);
      }
      
      if (data.responseType) {
        parts.push(`Type: ${data.responseType.toLowerCase()}`);
      }
      
      if (data.tone) {
        parts.push(`Tone: ${data.tone.toLowerCase()}`);
      }
      
      if (data.outcome) {
        parts.push(`Goal: ${data.outcome.toLowerCase()}`);
      }
      
      if (data.constraints) {
        parts.push(`Constraints: ${data.constraints}`);
      }
      
      parts.push('professional customer service, clear communication, solution-oriented');
      
      return parts.join('. ');
    }
  },
  {
    id: 'meeting-prep',
    name: 'Meeting Prep & Summaries',
    description: 'Turn agendas into structured plans, summarize transcripts, and create follow-up emails.',
    icon: 'calendar',
    available: true,
    fields: [
      {
        name: 'taskType',
        label: 'Task Type',
        type: 'select',
        required: true,
        options: [
          'Structure meeting agenda',
          'Summarize meeting transcript',
          'Create follow-up email',
          'Extract action items',
          'Prepare talking points',
          'Generate meeting minutes'
        ],
        helpText: 'Choose what you need help with'
      },
      {
        name: 'content',
        label: 'Meeting Content',
        type: 'textarea',
        required: true,
        placeholder: 'Paste meeting agenda, transcript, or notes here...',
        helpText: 'Provide the meeting material to work with'
      },
      {
        name: 'meetingType',
        label: 'Meeting Type',
        type: 'select',
        required: true,
        options: [
          'Team standup',
          'Client presentation',
          'Strategy session',
          'Project kickoff',
          'Performance review',
          'Board meeting',
          'Sales call',
          'All-hands meeting'
        ],
        helpText: 'What type of meeting is this?'
      },
      {
        name: 'audience',
        label: 'Audience',
        type: 'text',
        required: false,
        placeholder: 'Senior management, client stakeholders, development team...',
        helpText: 'Who will receive this output?'
      },
      {
        name: 'focus',
        label: 'Key Focus Areas',
        type: 'textarea',
        required: false,
        placeholder: 'Budget decisions, timeline concerns, next quarter goals...',
        helpText: 'What should be emphasized or highlighted?'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.taskType) {
        parts.push(`Task: ${data.taskType.toLowerCase()}`);
      }
      
      if (data.content) {
        parts.push(`Content: ${data.content}`);
      }
      
      if (data.meetingType) {
        parts.push(`Meeting type: ${data.meetingType.toLowerCase()}`);
      }
      
      if (data.audience) {
        parts.push(`Audience: ${data.audience}`);
      }
      
      if (data.focus) {
        parts.push(`Focus areas: ${data.focus}`);
      }
      
      parts.push('clear structure, actionable outcomes, professional format');
      
      return parts.join('. ');
    }
  },
  {
    id: 'product-descriptions',
    name: 'Product Descriptions & E-commerce',
    description: 'Optimize Shopify descriptions for SEO, write persuasive Etsy copy, and generate Amazon-style bullet points.',
    icon: 'shopping-cart',
    available: true,
    fields: [
      {
        name: 'platform',
        label: 'E-commerce Platform',
        type: 'select',
        required: true,
        options: [
          'Shopify (SEO-optimized)',
          'Etsy (handmade/vintage)',
          'Amazon (bullet points)',
          'eBay (auction style)',
          'Facebook Marketplace',
          'General online store'
        ],
        helpText: 'Choose the platform for optimization'
      },
      {
        name: 'product',
        label: 'Product Details',
        type: 'textarea',
        required: true,
        placeholder: 'Handmade ceramic coffee mug, 12oz capacity, dishwasher safe...',
        helpText: 'Describe your product in detail'
      },
      {
        name: 'targetAudience',
        label: 'Target Audience',
        type: 'text',
        required: true,
        placeholder: 'Coffee enthusiasts, home decorators, gift buyers...',
        helpText: 'Who is your ideal customer?'
      },
      {
        name: 'keyFeatures',
        label: 'Key Features/Benefits',
        type: 'textarea',
        required: true,
        placeholder: 'Unique glaze pattern, microwave safe, perfect gift...',
        helpText: 'List the main selling points'
      },
      {
        name: 'keywords',
        label: 'Keywords to Include',
        type: 'text',
        required: false,
        placeholder: 'ceramic mug, handmade pottery, coffee gift...',
        helpText: 'Important keywords for SEO (comma-separated)'
      },
      {
        name: 'priceRange',
        label: 'Price Range',
        type: 'select',
        required: false,
        options: [
          'Budget ($1-20)',
          'Mid-range ($20-100)',
          'Premium ($100-500)',
          'Luxury ($500+)'
        ],
        helpText: 'What price tier is this product?'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.platform) {
        parts.push(`Platform: ${data.platform}`);
      }
      
      if (data.product) {
        parts.push(`Product: ${data.product}`);
      }
      
      if (data.targetAudience) {
        parts.push(`Target audience: ${data.targetAudience}`);
      }
      
      if (data.keyFeatures) {
        parts.push(`Key features: ${data.keyFeatures}`);
      }
      
      if (data.keywords) {
        parts.push(`Keywords: ${data.keywords}`);
      }
      
      if (data.priceRange) {
        parts.push(`Price range: ${data.priceRange}`);
      }
      
      parts.push('persuasive copy, SEO-optimized, conversion-focused');
      
      return parts.join('. ');
    }
  },
  {
    id: 'personal-development',
    name: 'Personal Development & Journaling',
    description: 'Create reflective prompts, gratitude journal starters, and mental reset exercises for stress and anxiety.',
    icon: 'heart',
    available: true,
    fields: [
      {
        name: 'journalType',
        label: 'Journal Type',
        type: 'select',
        required: true,
        options: [
          'Reflective prompts',
          'Gratitude journal',
          'Mental reset/stress relief',
          'Goal setting',
          'Daily check-in',
          'Growth mindset',
          'Self-compassion',
          'Mindfulness practice'
        ],
        helpText: 'What type of journaling practice?'
      },
      {
        name: 'timeframe',
        label: 'Time Frame',
        type: 'select',
        required: true,
        options: [
          'Daily practice',
          'Weekly reflection',
          'Monthly review',
          'End of year',
          'After challenging events',
          'Morning routine',
          'Evening wind-down'
        ],
        helpText: 'When will this be used?'
      },
      {
        name: 'focus',
        label: 'Focus Area',
        type: 'select',
        required: false,
        options: [
          'Personal growth',
          'Stress management',
          'Relationship building',
          'Career development',
          'Health and wellness',
          'Creativity and inspiration',
          'Financial mindset',
          'Life transitions'
        ],
        helpText: 'What area of life to focus on?'
      },
      {
        name: 'challenge',
        label: 'Current Challenge',
        type: 'textarea',
        required: false,
        placeholder: 'Feeling overwhelmed at work, relationship difficulties...',
        helpText: 'Any specific challenges you are facing?'
      },
      {
        name: 'tone',
        label: 'Desired Tone',
        type: 'select',
        required: true,
        options: [
          'Gentle and supportive',
          'Challenging and motivating',
          'Calm and meditative',
          'Practical and action-oriented',
          'Curious and exploratory',
          'Compassionate and healing'
        ],
        helpText: 'What tone feels right for you?'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.journalType) {
        parts.push(`Journal type: ${data.journalType.toLowerCase()}`);
      }
      
      if (data.timeframe) {
        parts.push(`Timeframe: ${data.timeframe.toLowerCase()}`);
      }
      
      if (data.focus) {
        parts.push(`Focus: ${data.focus.toLowerCase()}`);
      }
      
      if (data.challenge) {
        parts.push(`Current challenge: ${data.challenge}`);
      }
      
      if (data.tone) {
        parts.push(`Tone: ${data.tone.toLowerCase()}`);
      }
      
      parts.push('thoughtful questions, personal growth, self-reflection');
      
      return parts.join('. ');
    }
  },
  {
    id: 'thinking-tools',
    name: 'Thinking Tools & Frameworks',
    description: 'Generate SWOT analysis, turn thoughts into SMART goals, use 5 Whys method, and build 30-60-90 day plans.',
    icon: 'brain',
    available: true,
    fields: [
      {
        name: 'framework',
        label: 'Thinking Framework',
        type: 'select',
        required: true,
        options: [
          'SWOT Analysis',
          'SMART Goals',
          '5 Whys Method',
          '30-60-90 Day Plan',
          'Pros and Cons List',
          'Decision Matrix',
          'Root Cause Analysis',
          'Force Field Analysis'
        ],
        helpText: 'Choose the thinking framework to apply'
      },
      {
        name: 'context',
        label: 'Context/Situation',
        type: 'textarea',
        required: true,
        placeholder: 'Starting a new job, launching a product, making a career change...',
        helpText: 'Describe the situation or decision you are facing'
      },
      {
        name: 'rawThoughts',
        label: 'Raw Thoughts/Notes',
        type: 'textarea',
        required: false,
        placeholder: 'Paste your messy notes, ideas, or initial thoughts here...',
        helpText: 'Any existing thoughts or notes to organize?'
      },
      {
        name: 'timeHorizon',
        label: 'Time Horizon',
        type: 'select',
        required: false,
        options: [
          'Next 30 days',
          'Next 3 months',
          'Next 6 months',
          'Next year',
          'Long-term (2+ years)'
        ],
        helpText: 'What timeframe are you planning for?'
      },
      {
        name: 'stakeholders',
        label: 'Key Stakeholders',
        type: 'text',
        required: false,
        placeholder: 'Team members, customers, investors, family...',
        helpText: 'Who else is involved or affected?'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.framework) {
        parts.push(`Framework: ${data.framework}`);
      }
      
      if (data.context) {
        parts.push(`Context: ${data.context}`);
      }
      
      if (data.rawThoughts) {
        parts.push(`Raw thoughts: ${data.rawThoughts}`);
      }
      
      if (data.timeHorizon) {
        parts.push(`Time horizon: ${data.timeHorizon.toLowerCase()}`);
      }
      
      if (data.stakeholders) {
        parts.push(`Stakeholders: ${data.stakeholders}`);
      }
      
      parts.push('structured thinking, clear analysis, actionable insights');
      
      return parts.join('. ');
    }
  },
  {
    id: 'ad-copy',
    name: 'Ad Copy Variations',
    description: 'Create platform-specific ad copy for Facebook, Google, YouTube with pain-point focus and hooks.',
    icon: 'megaphone',
    available: true,
    fields: [
      {
        name: 'platform',
        label: 'Ad Platform',
        type: 'select',
        required: true,
        options: [
          'Facebook Ad (pain-point focus)',
          'Google Ad (short & punchy)',
          'YouTube Ad (spoken hook)',
          'Instagram Story',
          'LinkedIn Sponsored',
          'Twitter/X Promoted',
          'TikTok Ad'
        ],
        helpText: 'Choose the advertising platform'
      },
      {
        name: 'product',
        label: 'Product/Service',
        type: 'text',
        required: true,
        placeholder: 'Project management software, online course, fitness app...',
        helpText: 'What are you advertising?'
      },
      {
        name: 'targetAudience',
        label: 'Target Audience',
        type: 'text',
        required: true,
        placeholder: 'Busy entrepreneurs, new parents, college students...',
        helpText: 'Who is your ideal customer?'
      },
      {
        name: 'painPoint',
        label: 'Main Pain Point',
        type: 'textarea',
        required: true,
        placeholder: 'Struggling to stay organized, feeling overwhelmed by tasks...',
        helpText: 'What problem does your product solve?'
      },
      {
        name: 'benefit',
        label: 'Key Benefit',
        type: 'text',
        required: true,
        placeholder: 'Save 2 hours per day, lose 10 pounds in 30 days...',
        helpText: 'What is the main benefit or outcome?'
      },
      {
        name: 'callToAction',
        label: 'Call to Action',
        type: 'select',
        required: true,
        options: [
          'Sign up for free trial',
          'Download now',
          'Learn more',
          'Get started today',
          'Book a demo',
          'Buy now',
          'Join waitlist'
        ],
        helpText: 'What action do you want people to take?'
      },
      {
        name: 'urgency',
        label: 'Urgency/Scarcity',
        type: 'text',
        required: false,
        placeholder: 'Limited time offer, only 100 spots available...',
        helpText: 'Any urgency or scarcity elements?'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.platform) {
        parts.push(`Platform: ${data.platform}`);
      }
      
      if (data.product) {
        parts.push(`Product: ${data.product}`);
      }
      
      if (data.targetAudience) {
        parts.push(`Target: ${data.targetAudience}`);
      }
      
      if (data.painPoint) {
        parts.push(`Pain point: ${data.painPoint}`);
      }
      
      if (data.benefit) {
        parts.push(`Benefit: ${data.benefit}`);
      }
      
      if (data.callToAction) {
        parts.push(`CTA: ${data.callToAction}`);
      }
      
      if (data.urgency) {
        parts.push(`Urgency: ${data.urgency}`);
      }
      
      parts.push('compelling copy, conversion-focused, platform-optimized');
      
      return parts.join('. ');
    }
  },
  {
    id: 'how-to-generator',
    name: 'How-To Generator',
    description: 'Build clear how-to prompts with complexity sliders and format options (paragraphs, steps, bullets).',
    icon: 'list-ordered',
    available: true,
    fields: [
      {
        name: 'topic',
        label: 'How-To Topic',
        type: 'text',
        required: true,
        placeholder: 'How to start a podcast, How to fix a leaky faucet...',
        helpText: 'What do you want to explain how to do?'
      },
      {
        name: 'audience',
        label: 'Audience Level',
        type: 'select',
        required: true,
        options: [
          'Complete beginner',
          'Some experience',
          'Intermediate',
          'Advanced/Expert'
        ],
        helpText: 'What is the skill level of your audience?'
      },
      {
        name: 'format',
        label: 'Format',
        type: 'select',
        required: true,
        options: [
          'Numbered steps',
          'Bullet point list',
          'Paragraph format',
          'Visual guide (with descriptions)',
          'Quick reference card',
          'Detailed tutorial'
        ],
        helpText: 'How should the instructions be formatted?'
      },
      {
        name: 'timeframe',
        label: 'Time to Complete',
        type: 'select',
        required: false,
        options: [
          '5 minutes or less',
          '15-30 minutes',
          '1 hour',
          '2-4 hours',
          'Multiple sessions',
          'Ongoing process'
        ],
        helpText: 'How long should this take?'
      },
      {
        name: 'tools',
        label: 'Tools/Materials Needed',
        type: 'textarea',
        required: false,
        placeholder: 'Computer, microphone, recording software...',
        helpText: 'What tools or materials are required?'
      },
      {
        name: 'commonMistakes',
        label: 'Common Mistakes to Avoid',
        type: 'textarea',
        required: false,
        placeholder: 'Not testing audio levels, forgetting to backup files...',
        helpText: 'What pitfalls should people watch out for?'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.topic) {
        parts.push(`Topic: ${data.topic}`);
      }
      
      if (data.audience) {
        parts.push(`Audience: ${data.audience.toLowerCase()}`);
      }
      
      if (data.format) {
        parts.push(`Format: ${data.format.toLowerCase()}`);
      }
      
      if (data.timeframe) {
        parts.push(`Duration: ${data.timeframe.toLowerCase()}`);
      }
      
      if (data.tools) {
        parts.push(`Tools needed: ${data.tools}`);
      }
      
      if (data.commonMistakes) {
        parts.push(`Avoid: ${data.commonMistakes}`);
      }
      
      parts.push('clear instructions, step-by-step guidance, practical advice');
      
      return parts.join('. ');
    }
  },
  {
    id: 'roleplay-simulation',
    name: 'Roleplay & AI Simulation',
    description: 'Simulate debates, interview historical figures, and play devil\'s advocate for business ideas.',
    icon: 'users',
    available: true,
    fields: [
      {
        name: 'simulationType',
        label: 'Simulation Type',
        type: 'select',
        required: true,
        options: [
          'Debate simulation',
          'Historical figure interview',
          'Devil\'s advocate session',
          'Expert consultation',
          'Customer interview',
          'Negotiation practice',
          'Public speaking practice',
          'Conflict resolution'
        ],
        helpText: 'What type of roleplay scenario?'
      },
      {
        name: 'topic',
        label: 'Topic/Subject',
        type: 'textarea',
        required: true,
        placeholder: 'Climate change policy, my new business idea, marketing strategy...',
        helpText: 'What is the main topic or subject?'
      },
      {
        name: 'role',
        label: 'Character/Role to Play',
        type: 'text',
        required: false,
        placeholder: 'Albert Einstein, skeptical investor, industry expert...',
        helpText: 'Who should the AI roleplay as?'
      },
      {
        name: 'perspective',
        label: 'Perspective/Stance',
        type: 'select',
        required: false,
        options: [
          'Supportive and encouraging',
          'Critical and challenging',
          'Neutral and analytical',
          'Enthusiastic advocate',
          'Skeptical questioner',
          'Practical advisor'
        ],
        helpText: 'What perspective should they take?'
      },
      {
        name: 'goals',
        label: 'Learning Goals',
        type: 'textarea',
        required: false,
        placeholder: 'Test my arguments, find weak points, explore different viewpoints...',
        helpText: 'What do you hope to learn or achieve?'
      },
      {
        name: 'context',
        label: 'Additional Context',
        type: 'textarea',
        required: false,
        placeholder: 'This is for a school project, preparing for investor pitch...',
        helpText: 'Any additional background or context?'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.simulationType) {
        parts.push(`Simulation: ${data.simulationType.toLowerCase()}`);
      }
      
      if (data.topic) {
        parts.push(`Topic: ${data.topic}`);
      }
      
      if (data.role) {
        parts.push(`Role: ${data.role}`);
      }
      
      if (data.perspective) {
        parts.push(`Perspective: ${data.perspective.toLowerCase()}`);
      }
      
      if (data.goals) {
        parts.push(`Goals: ${data.goals}`);
      }
      
      if (data.context) {
        parts.push(`Context: ${data.context}`);
      }
      
      parts.push('engaging roleplay, authentic character, educational dialogue');
      
      return parts.join('. ');
    }
  },
  {
    id: 'copy-editing',
    name: 'Copy Editing & Rewriting',
    description: 'Improve tone, clarity, and flow. Rewrite in different voices and convert between formats.',
    icon: 'edit',
    available: true,
    fields: [
      {
        name: 'originalText',
        label: 'Original Text',
        type: 'textarea',
        required: true,
        placeholder: 'Paste the text you want to improve or rewrite...',
        helpText: 'Provide the text that needs editing'
      },
      {
        name: 'editingGoal',
        label: 'Editing Goal',
        type: 'select',
        required: true,
        options: [
          'Improve clarity and flow',
          'Change tone/voice',
          'Make more concise',
          'Make more detailed',
          'Fix grammar and style',
          'Convert format',
          'Improve readability',
          'Make more persuasive'
        ],
        helpText: 'What type of editing do you need?'
      },
      {
        name: 'targetTone',
        label: 'Target Tone/Voice',
        type: 'select',
        required: false,
        options: [
          'Professional/Formal',
          'Casual/Conversational',
          'Friendly/Warm',
          'Authoritative/Expert',
          'Persuasive/Sales',
          'Academic/Scholarly',
          'Empathetic/Supportive',
          'Confident/Bold'
        ],
        helpText: 'What tone should the final version have?'
      },
      {
        name: 'targetFormat',
        label: 'Target Format',
        type: 'select',
        required: false,
        options: [
          'Bullet points to paragraphs',
          'Paragraphs to bullet points',
          'Long form to summary',
          'Summary to detailed',
          'Email format',
          'Blog post format',
          'Social media post'
        ],
        helpText: 'Convert to a different format?'
      },
      {
        name: 'audience',
        label: 'Target Audience',
        type: 'text',
        required: false,
        placeholder: 'Business executives, college students, general public...',
        helpText: 'Who will read the final version?'
      },
      {
        name: 'constraints',
        label: 'Length/Style Constraints',
        type: 'text',
        required: false,
        placeholder: 'Keep under 200 words, include specific keywords...',
        helpText: 'Any specific requirements or limitations?'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.originalText) {
        parts.push(`Original text: ${data.originalText}`);
      }
      
      if (data.editingGoal) {
        parts.push(`Goal: ${data.editingGoal.toLowerCase()}`);
      }
      
      if (data.targetTone) {
        parts.push(`Target tone: ${data.targetTone.toLowerCase()}`);
      }
      
      if (data.targetFormat) {
        parts.push(`Format: ${data.targetFormat.toLowerCase()}`);
      }
      
      if (data.audience) {
        parts.push(`Audience: ${data.audience}`);
      }
      
      if (data.constraints) {
        parts.push(`Constraints: ${data.constraints}`);
      }
      
      parts.push('improved clarity, better flow, enhanced readability');
      
      return parts.join('. ');
    }
  },
  {
    id: 'travel-planning',
    name: 'Travel Planning',
    description: 'Create itineraries, budget travel checklists, and local dining recommendations for any destination.',
    icon: 'map-pin',
    available: true,
    fields: [
      {
        name: 'planningType',
        label: 'Planning Type',
        type: 'select',
        required: true,
        options: [
          'Multi-day itinerary',
          'Budget travel checklist',
          'Local dining guide',
          'Transportation planning',
          'Accommodation recommendations',
          'Activity suggestions',
          'Packing checklist',
          'Cultural etiquette guide'
        ],
        helpText: 'What type of travel planning help do you need?'
      },
      {
        name: 'destination',
        label: 'Destination',
        type: 'text',
        required: true,
        placeholder: 'Tokyo, Japan or Paris, France or San Francisco, CA...',
        helpText: 'Where are you traveling to?'
      },
      {
        name: 'duration',
        label: 'Trip Duration',
        type: 'select',
        required: false,
        options: [
          'Weekend (2-3 days)',
          'Short trip (4-6 days)',
          'Week long (7-9 days)',
          'Extended trip (10+ days)',
          'Day trip only'
        ],
        helpText: 'How long is your trip?'
      },
      {
        name: 'budget',
        label: 'Budget Level',
        type: 'select',
        required: false,
        options: [
          'Backpacker/Budget',
          'Mid-range/Moderate',
          'Luxury/High-end',
          'Mixed (budget conscious with splurges)'
        ],
        helpText: 'What is your budget level?'
      },
      {
        name: 'interests',
        label: 'Interests/Preferences',
        type: 'textarea',
        required: false,
        placeholder: 'Museums, food tours, nightlife, nature, history, shopping...',
        helpText: 'What are you most interested in?'
      },
      {
        name: 'travelStyle',
        label: 'Travel Style',
        type: 'select',
        required: false,
        options: [
          'Solo traveler',
          'Couple/romantic',
          'Family with kids',
          'Group of friends',
          'Business travel',
          'Adventure/active',
          'Relaxation/leisure'
        ],
        helpText: 'What is your travel style?'
      },
      {
        name: 'constraints',
        label: 'Special Considerations',
        type: 'textarea',
        required: false,
        placeholder: 'Dietary restrictions, mobility needs, first time visiting...',
        helpText: 'Any special needs or constraints?'
      }
    ],
    generatePrompt: (data: Record<string, string>) => {
      const parts = [];
      
      if (data.planningType) {
        parts.push(`Planning type: ${data.planningType.toLowerCase()}`);
      }
      
      if (data.destination) {
        parts.push(`Destination: ${data.destination}`);
      }
      
      if (data.duration) {
        parts.push(`Duration: ${data.duration.toLowerCase()}`);
      }
      
      if (data.budget) {
        parts.push(`Budget: ${data.budget.toLowerCase()}`);
      }
      
      if (data.interests) {
        parts.push(`Interests: ${data.interests}`);
      }
      
      if (data.travelStyle) {
        parts.push(`Travel style: ${data.travelStyle.toLowerCase()}`);
      }
      
      if (data.constraints) {
        parts.push(`Considerations: ${data.constraints}`);
      }
      
      parts.push('practical recommendations, local insights, detailed planning');
      
      return parts.join('. ');
    }
  }
];

export function getTemplateById(id: string): PromptTemplate | undefined {
  return promptTemplates.find(template => template.id === id);
}
