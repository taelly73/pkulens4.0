import { Activity } from '../types';

// AI Service has been removed as per user request.
// These are placeholder functions to prevent build errors if referenced elsewhere.

export const getAIRecommendation = async (userRole: string, interests: string[], activities: Activity[]): Promise<string> => {
    return "";
};

export const summarizeActivity = async (title: string, description: string): Promise<string> => {
  return description;
};