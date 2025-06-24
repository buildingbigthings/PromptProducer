import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCustomPrompt(data: {
  originalDescription?: string;
  whatToCreate: string;
  targetAudience?: string;
  toneStyle?: string;
  constraints?: string;
  goals?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert AI prompt engineer. Your job is to create highly effective, detailed prompts that will help users get the best results from AI assistants like ChatGPT, Claude, or other AI tools.

Based on the user's requirements, create a comprehensive, well-structured prompt that:
1. Clearly defines the AI's role and expertise
2. Provides specific context and requirements
3. Includes clear formatting instructions
4. Specifies the desired output format
5. Includes any constraints or guidelines

Make the prompt actionable, specific, and optimized for getting high-quality results.`;

    let userPrompt = `Create an AI prompt for: ${data.whatToCreate}`;
    
    if (data.originalDescription) {
      userPrompt += `\n\nOriginal request: "${data.originalDescription}"`;
    }
    
    if (data.targetAudience) {
      userPrompt += `\nTarget audience: ${data.targetAudience}`;
    }
    
    if (data.toneStyle) {
      userPrompt += `\nTone/Style: ${data.toneStyle}`;
    }
    
    if (data.goals) {
      userPrompt += `\nGoals: ${data.goals}`;
    }
    
    if (data.constraints) {
      userPrompt += `\nConstraints: ${data.constraints}`;
    }

    userPrompt += `\n\nPlease create a comprehensive AI prompt that incorporates all these requirements. The prompt should be clear, specific, and designed to get excellent results from an AI assistant.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Failed to generate prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate prompt using AI");
  }
}

export async function generateBlogPrompt(data: {
  topic: string;
  audience: string;
  tone: string;
  keywords?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert content strategist and SEO specialist. Create detailed, actionable prompts for AI assistants to write high-quality blog posts.`;

    const userPrompt = `Create an AI prompt for writing a blog post with these specifications:
- Topic: ${data.topic}
- Target Audience: ${data.audience}
- Tone: ${data.tone}
${data.keywords ? `- SEO Keywords: ${data.keywords}` : ''}

The prompt should instruct the AI to create a comprehensive, engaging blog post that includes:
1. SEO-optimized structure
2. Compelling headlines and subheadings
3. Clear call-to-actions
4. Proper keyword integration
5. Engaging introduction and conclusion

Make the prompt specific and actionable for getting professional blog content.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content || "Failed to generate blog prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate blog prompt using AI");
  }
}

export async function generateEmailPrompt(data: {
  purpose: string;
  recipient: string;
  tone: string;
  keyPoints?: string;
  callToAction?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert email marketing strategist and copywriter. Create detailed prompts for AI assistants to write effective professional emails.`;

    const userPrompt = `Create an AI prompt for writing an email with these specifications:
- Purpose: ${data.purpose}
- Recipient: ${data.recipient}
- Tone: ${data.tone}
${data.keyPoints ? `- Key Points: ${data.keyPoints}` : ''}
${data.callToAction ? `- Call to Action: ${data.callToAction}` : ''}

The prompt should instruct the AI to create a professional email that includes:
1. Compelling subject line
2. Personalized greeting
3. Clear message structure
4. Persuasive content
5. Strong call-to-action
6. Professional closing

Make the prompt specific for getting high-conversion email content.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content || "Failed to generate email prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate email prompt using AI");
  }
}

export async function generateSocialPrompt(data: {
  platform: string;
  contentType: string;
  topic: string;
  tone: string;
  audience?: string;
  hashtags?: string;
  callToAction?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert social media strategist and content creator. Create detailed prompts for AI assistants to write engaging social media content.`;

    const userPrompt = `Create an AI prompt for social media content with these specifications:
- Platform: ${data.platform}
- Content Type: ${data.contentType}
- Topic: ${data.topic}
- Tone: ${data.tone}
${data.audience ? `- Target Audience: ${data.audience}` : ''}
${data.hashtags ? `- Hashtags/Keywords: ${data.hashtags}` : ''}
${data.callToAction ? `- Call to Action: ${data.callToAction}` : ''}

The prompt should instruct the AI to create engaging social media content that includes:
1. Platform-specific formatting
2. Attention-grabbing hooks
3. Engaging content that drives interaction
4. Relevant hashtags for discoverability
5. Clear call-to-action
6. Best practices for ${data.platform}

Make the prompt specific for getting viral-worthy social media content.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content || "Failed to generate social media prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate social media prompt using AI");
  }
}

export async function generateCreativePrompt(data: {
  projectType: string;
  genre: string;
  setting?: string;
  characters?: string;
  tone: string;
  themes?: string;
  length?: string;
  specialRequirements?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert creative writing instructor and prompt engineer. Create detailed, inspiring prompts for AI assistants to help with creative writing projects.`;

    const userPrompt = `Create an AI prompt for a creative writing project with these specifications:
- Project Type: ${data.projectType}
- Genre: ${data.genre}
- Tone/Mood: ${data.tone}
${data.setting ? `- Setting: ${data.setting}` : ''}
${data.characters ? `- Characters: ${data.characters}` : ''}
${data.themes ? `- Themes: ${data.themes}` : ''}
${data.length ? `- Length: ${data.length}` : ''}
${data.specialRequirements ? `- Special Requirements: ${data.specialRequirements}` : ''}

The prompt should instruct the AI to help create compelling creative writing that includes:
1. Well-developed characters with clear motivations
2. Engaging plot structure and pacing
3. Rich, immersive setting details
4. Appropriate tone and atmosphere
5. Strong thematic elements
6. Genre-specific conventions and expectations
7. Professional writing techniques and craft elements

Make the prompt specific for generating high-quality creative content that resonates with readers.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Failed to generate creative writing prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate creative writing prompt using AI");
  }
}

export async function generateMarketingPrompt(data: {
  copyType: string;
  product: string;
  targetAudience: string;
  painPoints?: string;
  benefits?: string;
  tone: string;
  callToAction?: string;
  constraints?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert marketing copywriter and conversion specialist. Create detailed prompts for AI assistants to write high-converting marketing copy.`;

    const userPrompt = `Create an AI prompt for marketing copy with these specifications:
- Copy Type: ${data.copyType}
- Product/Service: ${data.product}
- Target Audience: ${data.targetAudience}
- Brand Tone: ${data.tone}
${data.painPoints ? `- Pain Points: ${data.painPoints}` : ''}
${data.benefits ? `- Key Benefits: ${data.benefits}` : ''}
${data.callToAction ? `- Desired Action: ${data.callToAction}` : ''}
${data.constraints ? `- Constraints: ${data.constraints}` : ''}

The prompt should instruct the AI to create persuasive marketing copy that includes:
1. Attention-grabbing headlines and hooks
2. Clear value propositions and benefits
3. Emotional triggers and pain point solutions
4. Social proof and credibility elements
5. Strong call-to-action statements
6. Audience-specific language and messaging
7. Conversion-optimized structure and flow

Make the prompt specific for generating high-converting marketing materials that drive results.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Failed to generate marketing copy prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate marketing copy prompt using AI");
  }
}

export async function generateIdeaPrompt(data: {
  purpose: string;
  ideaType: string;
  domain?: string;
  context?: string;
  targetAudience?: string;
  constraints?: string;
  quantity?: string;
  criteria?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert innovation consultant and creative thinking facilitator. Create detailed prompts for AI assistants to generate creative ideas and brainstorming solutions.`;

    const userPrompt = `Create an AI prompt for idea generation with these specifications:
- Purpose: ${data.purpose}
- Type of Ideas: ${data.ideaType}
${data.domain ? `- Domain/Industry: ${data.domain}` : ''}
${data.context ? `- Context: ${data.context}` : ''}
${data.targetAudience ? `- Target Audience: ${data.targetAudience}` : ''}
${data.constraints ? `- Constraints: ${data.constraints}` : ''}
${data.quantity ? `- Quantity: ${data.quantity}` : ''}
${data.criteria ? `- Success Criteria: ${data.criteria}` : ''}

The prompt should instruct the AI to generate innovative ideas that include:
1. Creative and diverse perspectives
2. Practical implementation considerations
3. Clear explanations of each idea
4. Potential benefits and outcomes
5. Risk assessment and feasibility
6. Next steps for development
7. Prioritization and evaluation criteria

Make the prompt specific for generating actionable, innovative solutions.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Failed to generate idea generation prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate idea generation prompt using AI");
  }
}

export async function generateScriptPrompt(data: {
  scriptType: string;
  topic: string;
  duration?: string;
  audience: string;
  tone?: string;
  objective?: string;
  keyPoints?: string;
  callToAction?: string;
  format?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert scriptwriter and content creator specializing in video, podcast, and presentation scripts. Create detailed prompts for AI assistants to write engaging scripts.`;

    const userPrompt = `Create an AI prompt for script writing with these specifications:
- Script Type: ${data.scriptType}
- Topic: ${data.topic}
- Target Audience: ${data.audience}
${data.duration ? `- Duration: ${data.duration}` : ''}
${data.tone ? `- Tone: ${data.tone}` : ''}
${data.objective ? `- Objective: ${data.objective}` : ''}
${data.keyPoints ? `- Key Points: ${data.keyPoints}` : ''}
${data.callToAction ? `- Call to Action: ${data.callToAction}` : ''}
${data.format ? `- Format Requirements: ${data.format}` : ''}

The prompt should instruct the AI to create an engaging script that includes:
1. Compelling opening hook
2. Clear structure and flow
3. Audience-appropriate language
4. Visual and audio cues where relevant
5. Strong storytelling elements
6. Effective pacing and timing
7. Memorable closing and call-to-action

Make the prompt specific for creating professional, engaging content.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Failed to generate script prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate script prompt using AI");
  }
}

export async function generateCodePrompt(data: {
  taskType: string;
  description: string;
  programmingLanguage?: string;
  framework?: string;
  skillLevel?: string;
  context?: string;
  requirements?: string;
  constraints?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert software engineer and programming mentor. Create detailed prompts for AI assistants to help with coding tasks, debugging, and programming challenges.`;

    const userPrompt = `Create an AI prompt for programming assistance with these specifications:
- Task Type: ${data.taskType}
- Description: ${data.description}
${data.programmingLanguage ? `- Programming Language: ${data.programmingLanguage}` : ''}
${data.framework ? `- Framework/Technology: ${data.framework}` : ''}
${data.skillLevel ? `- User Experience Level: ${data.skillLevel}` : ''}
${data.context ? `- Project Context: ${data.context}` : ''}
${data.requirements ? `- Requirements: ${data.requirements}` : ''}
${data.constraints ? `- Constraints: ${data.constraints}` : ''}

The prompt should instruct the AI to provide programming help that includes:
1. Clear, well-commented code examples
2. Step-by-step explanations
3. Best practices and conventions
4. Error handling and edge cases
5. Testing considerations
6. Performance optimization tips
7. Alternative approaches when relevant

Make the prompt specific for getting high-quality, production-ready code assistance.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Failed to generate code help prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate code help prompt using AI");
  }
}

export async function generateResumePrompt(data: {
  documentType: string;
  jobTitle: string;
  industry?: string;
  experienceLevel: string;
  keySkills?: string;
  achievements?: string;
  targetCompany?: string;
  requirements?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert career counselor and resume writer with extensive experience in recruitment and HR. Create detailed prompts for AI assistants to write compelling career documents.`;

    const userPrompt = `Create an AI prompt for career document creation with these specifications:
- Document Type: ${data.documentType}
- Target Job Title: ${data.jobTitle}
- Experience Level: ${data.experienceLevel}
${data.industry ? `- Industry: ${data.industry}` : ''}
${data.keySkills ? `- Key Skills: ${data.keySkills}` : ''}
${data.achievements ? `- Achievements: ${data.achievements}` : ''}
${data.targetCompany ? `- Target Company: ${data.targetCompany}` : ''}
${data.requirements ? `- Special Requirements: ${data.requirements}` : ''}

The prompt should instruct the AI to create professional career content that includes:
1. ATS-optimized formatting and keywords
2. Quantified achievements and metrics
3. Industry-specific language and terminology
4. Compelling value propositions
5. Action-oriented language
6. Proper structure and organization
7. Tailored content for the target role

Make the prompt specific for creating standout career documents that get results.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.4,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Failed to generate resume prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate resume prompt using AI");
  }
}

export async function generateEducationPrompt(data: {
  contentType: string;
  subject: string;
  gradeLevel: string;
  duration?: string;
  learningObjectives?: string;
  priorKnowledge?: string;
  teachingStyle?: string;
  resources?: string;
  assessment?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert educator and instructional designer with extensive experience in curriculum development and pedagogy. Create detailed prompts for AI assistants to develop effective educational content.`;

    const userPrompt = `Create an AI prompt for educational content development with these specifications:
- Content Type: ${data.contentType}
- Subject: ${data.subject}
- Grade/Age Level: ${data.gradeLevel}
${data.duration ? `- Duration: ${data.duration}` : ''}
${data.learningObjectives ? `- Learning Objectives: ${data.learningObjectives}` : ''}
${data.priorKnowledge ? `- Prior Knowledge: ${data.priorKnowledge}` : ''}
${data.teachingStyle ? `- Teaching Style: ${data.teachingStyle}` : ''}
${data.resources ? `- Available Resources: ${data.resources}` : ''}
${data.assessment ? `- Assessment Methods: ${data.assessment}` : ''}

The prompt should instruct the AI to create educational content that includes:
1. Clear learning objectives and outcomes
2. Age-appropriate content and language
3. Engaging activities and exercises
4. Differentiated instruction strategies
5. Assessment and evaluation methods
6. Real-world applications and examples
7. Interactive and multimedia elements

Make the prompt specific for creating effective, engaging educational materials that promote learning.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Failed to generate education prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate education prompt using AI");
  }
}

export async function refinePrompt(data: {
  originalPrompt: string;
  refinementRequest: string;
  templateId?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert prompt engineer who specializes in refining and improving AI prompts. Your job is to take an existing prompt and improve it based on specific refinement requests while maintaining its core purpose and effectiveness.`;

    const userPrompt = `Please refine this AI prompt based on the following request:

Original Prompt:
"${data.originalPrompt}"

Refinement Request: ${data.refinementRequest}

Please provide the refined prompt that incorporates the requested changes while maintaining clarity, specificity, and effectiveness. Return only the improved prompt without additional commentary.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.4,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Failed to refine prompt";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to refine prompt using AI");
  }
}

export async function explainPrompt(data: {
  prompt: string;
  templateId?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert AI assistant who explains what prompts do in clear, simple language. Help users understand exactly what their prompt will ask an AI to accomplish.`;

    const userPrompt = `Please explain what this AI prompt is asking the AI to do. Be clear and concise, focusing on the key outcomes and deliverables the user can expect:

Prompt:
"${data.prompt}"

Provide a brief explanation (2-3 sentences) that helps the user understand what results they can expect when using this prompt with an AI assistant.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    return response.choices[0].message.content || "This prompt will help you get AI assistance for your request.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to explain prompt using AI");
  }
}

export async function suggestRole(data: {
  description: string;
  templateId: string;
  defaultRoles: string[];
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert at identifying the most effective professional roles for AI prompts. Based on the user's description and context, suggest the single most appropriate "Act as a [role]" that will produce the highest quality AI response.`;

    const userPrompt = `Based on this user description and context, suggest the most effective professional role for an AI prompt:

User Description: "${data.description}"
Template Category: ${data.templateId}
Common roles for this category: ${data.defaultRoles.join(', ')}

Return only the role name (without "Act as a" prefix), focusing on the specific expertise that would best help with this request. Be specific and professional. Examples: "conversion copywriter", "senior software engineer", "brand strategist"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    return response.choices[0].message.content?.trim() || data.defaultRoles[0];
  } catch (error) {
    console.error("OpenAI API error:", error);
    return data.defaultRoles[0];
  }
}

export async function generateImagePrompt(data: {
  subject: string;
  style: string;
  mood: string;
  lighting?: string;
  composition?: string;
  colors?: string;
  details?: string;
  role?: string;
  goal?: string;
  description?: string;
}): Promise<{ prompt: string; explanation: string }> {
  try {
    const systemPrompt = `You are an expert AI image generation specialist with deep knowledge of DALL-E, Midjourney, Stable Diffusion, and other AI art tools. You understand how to craft detailed, effective prompts that produce stunning visual results.

Your expertise includes:
- Visual composition and artistic techniques
- Lighting and atmosphere creation
- Style specifications and artistic movements
- Technical prompt optimization for AI models
- Color theory and visual harmony`;

    const roleContext = data.role ? `Acting as ${data.role}, ` : '';
    const goalContext = data.goal ? `with the goal to ${data.goal.toLowerCase()}, ` : '';
    const descriptionContext = data.description ? `Based on this concept: "${data.description}". ` : '';

    const userPrompt = `${roleContext}${goalContext}create a detailed AI image generation prompt ${descriptionContext}

Image specifications:
- Main Subject: ${data.subject}
- Art Style: ${data.style}
- Mood/Atmosphere: ${data.mood}
${data.lighting ? `- Lighting: ${data.lighting}` : ''}
${data.composition ? `- Composition: ${data.composition}` : ''}
${data.colors ? `- Color Palette: ${data.colors}` : ''}
${data.details ? `- Additional Details: ${data.details}` : ''}

Create a comprehensive prompt that includes:
1. The main subject and scene description
2. Artistic style and visual approach
3. Lighting and atmosphere details
4. Composition and framing guidance
5. Color specifications
6. Technical quality descriptors
7. Any specific details or elements

Also provide a brief explanation of why this prompt structure will be effective for AI image generation.

Return your response as JSON with "prompt" and "explanation" fields.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1200,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      prompt: result.prompt || "Failed to generate image prompt",
      explanation: result.explanation || ""
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate image prompt using AI");
  }
}

export async function generateVideoPrompt(data: {
  concept: string;
  duration: string;
  movement: string;
  style: string;
  mood: string;
  lighting?: string;
  setting?: string;
  details?: string;
  role?: string;
  goal?: string;
  description?: string;
}): Promise<{ prompt: string; explanation: string }> {
  try {
    const systemPrompt = `You are an expert AI video generation specialist with extensive knowledge of Runway, Pika Labs, Stable Video Diffusion, and other AI video tools. You understand how to create effective prompts for cinematic, professional video generation.

Your expertise includes:
- Cinematography and video composition
- Camera movements and techniques
- Visual storytelling and pacing
- Lighting design for video
- Video style and aesthetic direction
- Technical optimization for AI video models`;

    const roleContext = data.role ? `Acting as ${data.role}, ` : '';
    const goalContext = data.goal ? `with the goal to ${data.goal.toLowerCase()}, ` : '';
    const descriptionContext = data.description ? `Based on this concept: "${data.description}". ` : '';

    const userPrompt = `${roleContext}${goalContext}create a detailed AI video generation prompt ${descriptionContext}

Video specifications:
- Video Concept: ${data.concept}
- Duration: ${data.duration}
- Camera Movement: ${data.movement}
- Visual Style: ${data.style}
- Mood/Tone: ${data.mood}
${data.lighting ? `- Lighting Setup: ${data.lighting}` : ''}
${data.setting ? `- Setting/Location: ${data.setting}` : ''}
${data.details ? `- Additional Details: ${data.details}` : ''}

Create a comprehensive video prompt that includes:
1. Clear scene description and action
2. Camera movement and cinematography
3. Visual style and aesthetic direction
4. Lighting and atmosphere
5. Duration and pacing guidance
6. Technical quality specifications
7. Any specific elements or effects

Also provide a brief explanation of why this prompt structure will be effective for AI video generation.

Return your response as JSON with "prompt" and "explanation" fields.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1200,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      prompt: result.prompt || "Failed to generate video prompt",
      explanation: result.explanation || ""
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate video prompt using AI");
  }
}

export async function generateCustomerSupportPrompt(data: {
  situation: string;
  responseType: string;
  tone: string;
  outcome?: string;
  constraints?: string;
  role?: string;
  goal?: string;
  description?: string;
}): Promise<{ prompt: string; explanation: string }> {
  try {
    const systemPrompt = `You are an expert customer service specialist with extensive experience in customer communication, conflict resolution, and brand management. You understand how to craft responses that maintain customer relationships while addressing concerns professionally.

Your expertise includes:
- De-escalation techniques and empathetic communication
- Policy explanation and solution-oriented responses
- Brand voice consistency and professional tone
- Customer retention strategies and satisfaction recovery`;

    const roleContext = data.role ? `Acting as ${data.role}, ` : '';
    const goalContext = data.goal ? `with the goal to ${data.goal.toLowerCase()}, ` : '';
    const descriptionContext = data.description ? `Based on this scenario: "${data.description}". ` : '';

    const userPrompt = `${roleContext}${goalContext}create a customer service prompt ${descriptionContext}

Customer situation:
- Situation: ${data.situation}
- Response Type: ${data.responseType}
- Desired Tone: ${data.tone}
${data.outcome ? `- Desired Outcome: ${data.outcome}` : ''}
${data.constraints ? `- Constraints/Policies: ${data.constraints}` : ''}

Create a prompt that will help generate:
1. An empathetic and professional response
2. Clear acknowledgment of the customer's concern
3. Solution-oriented language
4. Appropriate tone matching the situation
5. Brand-protecting communication
6. Next steps or follow-up actions

Also provide a brief explanation of why this approach will be effective for customer service.

Return your response as JSON with "prompt" and "explanation" fields.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      prompt: result.prompt || "Failed to generate customer support prompt",
      explanation: result.explanation || ""
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate customer support prompt using AI");
  }
}

export async function generateMeetingPrompt(data: {
  taskType: string;
  content: string;
  meetingType: string;
  audience?: string;
  focus?: string;
  role?: string;
  goal?: string;
  description?: string;
}): Promise<{ prompt: string; explanation: string }> {
  try {
    const systemPrompt = `You are an expert meeting facilitator and business communication specialist with extensive experience in meeting management, agenda structuring, and executive communication.

Your expertise includes:
- Meeting efficiency and productive agenda design
- Executive summary writing and action item extraction
- Professional communication for various business contexts
- Stakeholder management and clear reporting`;

    const roleContext = data.role ? `Acting as ${data.role}, ` : '';
    const goalContext = data.goal ? `with the goal to ${data.goal.toLowerCase()}, ` : '';
    const descriptionContext = data.description ? `Based on this context: "${data.description}". ` : '';

    const userPrompt = `${roleContext}${goalContext}create a meeting management prompt ${descriptionContext}

Meeting details:
- Task Type: ${data.taskType}
- Meeting Content: ${data.content}
- Meeting Type: ${data.meetingType}
${data.audience ? `- Audience: ${data.audience}` : ''}
${data.focus ? `- Focus Areas: ${data.focus}` : ''}

Create a prompt that will help:
1. Structure information clearly and professionally
2. Extract key insights and action items
3. Maintain appropriate tone for the audience
4. Organize information logically
5. Highlight important decisions and next steps
6. Create actionable outcomes

Also provide a brief explanation of why this approach will be effective for meeting management.

Return your response as JSON with "prompt" and "explanation" fields.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      prompt: result.prompt || "Failed to generate meeting prompt",
      explanation: result.explanation || ""
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate meeting prompt using AI");
  }
}

export async function improvePrompt(data: {
  originalPrompt: string;
  userFeedback: string[];
  userEdits?: string;
  originalGoal: string;
  templateCategory: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert AI prompt engineer. Your job is to improve existing prompts based on user feedback and edits.

Analyze the original prompt, the user's feedback about what didn't work, any manual edits they made, and the original goal. Then create an improved version that addresses all the issues while maintaining the core intent.

Focus on:
1. Addressing specific feedback points (tone, clarity, length, etc.)
2. Incorporating any manual edits the user made
3. Maintaining alignment with the original goal and category
4. Improving overall effectiveness and clarity
5. Ensuring the prompt will get better AI results

Return only the improved prompt, nothing else.`;

    let userPrompt = `Original prompt:\n"${data.originalPrompt}"\n\n`;
    userPrompt += `Original goal: ${data.originalGoal}\n`;
    userPrompt += `Template category: ${data.templateCategory}\n\n`;
    userPrompt += `User feedback on what didn't work:\n${data.userFeedback.join(', ')}\n\n`;
    
    if (data.userEdits) {
      userPrompt += `User's manual edits:\n"${data.userEdits}"\n\n`;
    }
    
    userPrompt += `Please create an improved version of this prompt that addresses all the feedback and incorporates the edits while maintaining the original intent and improving overall effectiveness.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content?.trim() || data.originalPrompt;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to improve prompt");
  }
}

export async function generateProductDescriptionPrompt(data: {
  platform: string;
  product: string;
  targetAudience: string;
  keyFeatures: string;
  keywords?: string;
  priceRange?: string;
  role?: string;
  goal?: string;
  description?: string;
}): Promise<{ prompt: string; explanation: string }> {
  try {
    const systemPrompt = `You are an expert e-commerce copywriter and digital marketing specialist with deep knowledge of platform-specific optimization, SEO, and conversion psychology.

Your expertise includes:
- Platform-specific optimization (Shopify, Amazon, Etsy, etc.)
- SEO keyword integration and ranking strategies
- Conversion-focused copywriting and persuasion techniques
- Target audience psychology and buying behavior`;

    const roleContext = data.role ? `Acting as ${data.role}, ` : '';
    const goalContext = data.goal ? `with the goal to ${data.goal.toLowerCase()}, ` : '';
    const descriptionContext = data.description ? `Based on this concept: "${data.description}". ` : '';

    const userPrompt = `${roleContext}${goalContext}create an e-commerce product description prompt ${descriptionContext}

Product details:
- Platform: ${data.platform}
- Product: ${data.product}
- Target Audience: ${data.targetAudience}
- Key Features: ${data.keyFeatures}
${data.keywords ? `- Keywords: ${data.keywords}` : ''}
${data.priceRange ? `- Price Range: ${data.priceRange}` : ''}

Create a prompt that will generate:
1. Platform-optimized product descriptions
2. SEO-friendly keyword integration
3. Conversion-focused copy that drives sales
4. Target audience-specific language
5. Feature highlighting and benefit explanation
6. Compelling calls-to-action

Also provide a brief explanation of why this approach will be effective for e-commerce sales.

Return your response as JSON with "prompt" and "explanation" fields.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      prompt: result.prompt || "Failed to generate product description prompt",
      explanation: result.explanation || ""
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate product description prompt using AI");
  }
}