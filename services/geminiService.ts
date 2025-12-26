
import { Activity } from '../types';

// Mock AI Service - No API Key required
// This replaces the actual Google Gemini call with local logic

export const getAIRecommendation = async (userRole: string, interests: string[], activities: Activity[]): Promise<string> => {
    // Simulate a short network delay to feel like "thinking"
    await new Promise(resolve => setTimeout(resolve, 1500));

    const openActivities = activities.filter(a => a.status === 'registering');
    const count = openActivities.length;

    // Simple mock logic to generate a response
    return `[模拟 AI 回复] 
你好！作为一名 **${userRole}**，并考虑到你对 **${interests.join(', ')}** 的兴趣，我为你分析了当前正在报名的 ${count} 个活动。

推荐你关注以下方向：
1. **学术讲座**：查看首页的 "Featured" 推荐，通常有高质量的讲座。
2. **社交活动**：社团招新是结识新朋友的好机会。

(注：此为演示模式，未连接真实 AI 模型)`;
};

export const summarizeActivity = async (title: string, description: string): Promise<string> => {
    // Just return the original description in mock mode
    return description;
};
