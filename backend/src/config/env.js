import "dotenv/config";

export const config = {
  port: process.env.PORT || 5000,
  githubToken: process.env.GITHUB_TOKEN,
};
