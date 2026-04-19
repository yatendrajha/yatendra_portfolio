import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Product" | "Fintech" | "Technology and Innovation" | "AI" | "Automation";
  date: string;
  author: string;
}

// Simple in-memory cache for blog posts
let cachedPosts: BlogPost[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const now = Date.now();
  if (cachedPosts.length > 0 && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedPosts;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing. Please set it in your environment variables.");
    return cachedPosts;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 12 high-quality, trending blog posts for a professional fintech/AI portfolio. Topics MUST be from early 2026. Categories: Product, Fintech, Technology and Innovation, AI, Automation. Ensure dates are in 2026. Return as JSON array.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { 
                type: Type.STRING,
                enum: ["Product", "Fintech", "Technology and Innovation", "AI", "Automation"]
              },
              date: { type: Type.STRING },
              author: { type: Type.STRING }
            },
            required: ["id", "title", "excerpt", "content", "category", "date", "author"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return cachedPosts;
    
    const posts = JSON.parse(text);
    cachedPosts = posts;
    lastFetchTime = now;
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return cachedPosts;
  }
}
