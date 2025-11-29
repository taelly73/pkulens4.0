import { GoogleGenAI } from "@google/genai";
import { Activity } from '../types';

// Initialize the GoogleGenAI client with the API key from environment variables
// The API key is injected via the define plugin in vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIRecommendation = async (userRole: string, interests: string[], activities: Activity[]): Promise<string> => {
  try {
    const isEnglish = userRole === 'International Student';
    
    // Create a concise context of available activities
    const activityContext = activities.map(a => 
      `- ${a.title} (Category: ${a.category}, Date: ${a.date})`
    ).join('\n');

    const prompt = `
      You are a helpful AI assistant for the PKU Lens campus app.
      
      User Profile:
      - Role: ${userRole}
      - Interests: ${interests.join(', ')}
      
      Available Activities:
      ${activityContext}
      
      Task:
      Recommend 2 specific activities from the list that best match the user's role and interests.
      
      Format your response in Markdown:
      1. **Activity Title**: Reason for recommendation.
      
      Language Requirement:
      - If the user is an "International Student", respond in English.
      - Otherwise, respond in Chinese.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || (isEnglish ? "No recommendations available." : "暂无推荐。");
  } catch (error) {
    console.error("Gemini API Error:", error);
    const isEnglish = userRole === 'International Student';
    return isEnglish 
      ? "AI service is currently unavailable. Please explore the activities list manually." 
      : "AI 服务暂时不可用，请手动浏览活动列表。";
  }
};

export const summarizeActivity = async (title: string, description: string): Promise<string> => {
  // Simple truncation to avoid excessive API calls for list rendering
  return description.length > 50 ? description.substring(0, 50) + '...' : description;
};