import axios from 'axios';
import type { AnalysisResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
});

export const githubService = {
  getProfile: async (username: string): Promise<AnalysisResult> => {
    const response = await api.get<AnalysisResult>(`/github/${username}`);
    return response.data;
  },
};
