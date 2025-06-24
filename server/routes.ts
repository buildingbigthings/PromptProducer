import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPromptHistorySchema } from "@shared/schema";
import { generateCustomPrompt, generateBlogPrompt, generateEmailPrompt, generateSocialPrompt, generateCreativePrompt, generateMarketingPrompt, generateIdeaPrompt, generateScriptPrompt, generateCodePrompt, generateResumePrompt, generateEducationPrompt, generateImagePrompt, generateVideoPrompt, generateCustomerSupportPrompt, generateMeetingPrompt, generateProductDescriptionPrompt, refinePrompt, explainPrompt, suggestRole, improvePrompt } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/healthcheck", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Save prompt to history
  app.post("/api/prompts", async (req, res) => {
    try {
      const validatedData = insertPromptHistorySchema.parse(req.body);
      const savedPrompt = await storage.savePromptHistory(validatedData);
      res.json(savedPrompt);
    } catch (error) {
      console.error(`Error saving prompt: ${error}`);
      res.status(400).json({ error: "Invalid prompt data" });
    }
  });

  // Get prompt history
  app.get("/api/prompts", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const prompts = await storage.getPromptHistory(userId, limit);
      res.json(prompts);
    } catch (error) {
      console.error(`Error fetching prompt history: ${error}`);
      res.status(500).json({ error: "Failed to fetch prompt history" });
    }
  });

  // Generate AI-powered prompts
  app.post("/api/generate-custom-prompt", async (req, res) => {
    try {
      const prompt = await generateCustomPrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating custom prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/generate-blog-prompt", async (req, res) => {
    try {
      const prompt = await generateBlogPrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating blog prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/generate-email-prompt", async (req, res) => {
    try {
      const prompt = await generateEmailPrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating email prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/generate-social-prompt", async (req, res) => {
    try {
      const prompt = await generateSocialPrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating social prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/generate-creative-prompt", async (req, res) => {
    try {
      const prompt = await generateCreativePrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating creative prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/generate-marketing-prompt", async (req, res) => {
    try {
      const prompt = await generateMarketingPrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating marketing prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/generate-idea-prompt", async (req, res) => {
    try {
      const prompt = await generateIdeaPrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating idea prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/generate-script-prompt", async (req, res) => {
    try {
      const prompt = await generateScriptPrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating script prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/generate-code-prompt", async (req, res) => {
    try {
      const prompt = await generateCodePrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating code prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/generate-resume-prompt", async (req, res) => {
    try {
      const prompt = await generateResumePrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating resume prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/generate-education-prompt", async (req, res) => {
    try {
      const prompt = await generateEducationPrompt(req.body);
      res.json({ prompt });
    } catch (error) {
      console.error(`Error generating education prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  app.post("/api/refine-prompt", async (req, res) => {
    try {
      const refinedPrompt = await refinePrompt(req.body);
      res.json({ prompt: refinedPrompt });
    } catch (error) {
      console.error(`Error refining prompt: ${error}`);
      res.status(500).json({ error: "Failed to refine prompt" });
    }
  });

  app.post("/api/explain-prompt", async (req, res) => {
    try {
      const explanation = await explainPrompt(req.body);
      res.json({ explanation });
    } catch (error) {
      console.error(`Error explaining prompt: ${error}`);
      res.status(500).json({ error: "Failed to explain prompt" });
    }
  });

  app.post("/api/suggest-role", async (req, res) => {
    try {
      const role = await suggestRole(req.body);
      res.json({ role });
    } catch (error) {
      console.error(`Error suggesting role: ${error}`);
      res.status(500).json({ error: "Failed to suggest role" });
    }
  });

  app.post("/api/generate-image-prompt", async (req, res) => {
    try {
      const result = await generateImagePrompt(req.body);
      res.json(result);
    } catch (error) {
      console.error(`Error generating image prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate image prompt" });
    }
  });

  app.post("/api/generate-video-prompt", async (req, res) => {
    try {
      const result = await generateVideoPrompt(req.body);
      res.json(result);
    } catch (error) {
      console.error(`Error generating video prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate video prompt" });
    }
  });

  app.post("/api/generate-customer-support-prompt", async (req, res) => {
    try {
      const result = await generateCustomerSupportPrompt(req.body);
      res.json(result);
    } catch (error) {
      console.error(`Error generating customer support prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate customer support prompt" });
    }
  });

  app.post("/api/generate-meeting-prompt", async (req, res) => {
    try {
      const result = await generateMeetingPrompt(req.body);
      res.json(result);
    } catch (error) {
      console.error(`Error generating meeting prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate meeting prompt" });
    }
  });

  app.post("/api/generate-product-description-prompt", async (req, res) => {
    try {
      const result = await generateProductDescriptionPrompt(req.body);
      res.json(result);
    } catch (error) {
      console.error(`Error generating product description prompt: ${error}`);
      res.status(500).json({ error: "Failed to generate product description prompt" });
    }
  });

  app.post("/api/improve-prompt", async (req, res) => {
    try {
      const improvedPrompt = await improvePrompt(req.body);
      res.json({ prompt: improvedPrompt });
    } catch (error) {
      console.error(`Error improving prompt: ${error}`);
      res.status(500).json({ error: "Failed to improve prompt" });
    }
  });

  app.patch("/api/prompts/:id", async (req, res) => {
    try {
      const promptId = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedPrompt = await storage.updatePromptHistory(promptId, updateData);
      res.json(updatedPrompt);
    } catch (error) {
      console.error(`Error updating prompt: ${error}`);
      res.status(500).json({ error: "Failed to update prompt" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
