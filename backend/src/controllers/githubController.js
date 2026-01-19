import axios from "axios";
import { analyzeRepos } from "../utils/githubAnalysis.js";
import { mockUser, mockRepos } from "../utils/mockData.js";

import { config } from "../config/env.js";

export const getProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const token = config.githubToken;
    const headers = (token && token !== "your_github_token_here") 
      ? { Authorization: `token ${token}` } 
      : {};

    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers })
    ]);

    const analysis = await analyzeRepos(reposRes.data);
    
    res.json({
        ...analysis,
        avatarUrl: userRes.data.avatar_url,
        name: userRes.data.name || username,
        bio: userRes.data.bio,
        followers: userRes.data.followers,
        following: userRes.data.following
    });
  } catch (error) {
    // Graceful Fallback for Rate Limits
    if (error.response?.status === 403) {
        console.warn("Rate Limit Hit. Serving Mock Data.");
        const analysis = await analyzeRepos(mockRepos);
        return res.json({
            ...analysis,
            avatarUrl: mockUser.avatar_url,
            name: mockUser.name,
            bio: mockUser.bio,
            followers: mockUser.followers,
            following: mockUser.following,
            mock: true // Flag to indicate mock data
        });
    }

    console.error("Controller Error:", error);
    res.status(500).json({ 
        message: "GitHub user not found or API error", 
        details: error.message 
    });
  }
};
