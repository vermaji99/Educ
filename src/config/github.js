import dotenv from 'dotenv';

dotenv.config();

export const GITHUB_CONFIG = {
  BASE_URL: process.env.GITHUB_API_URL || 'https://api.github.com',
  TOKEN: process.env.GITHUB_TOKEN,
  HEADERS: {
    'Accept': 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }),
  },
  TIMEOUT: 10000, // 10 seconds
};
