import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  photon: {
    projectId: process.env.PROJECT_ID || '',
    projectSecret: process.env.PROJECT_SECRET || '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  imessage: {
    address: process.env.SPECTRUM_IMESSAGE_ADDRESS || process.env.IMESSAGE_ADDRESS || '',
    token: process.env.SPECTRUM_IMESSAGE_TOKEN || process.env.IMESSAGE_TOKEN || '',
    phone: process.env.IMESSAGE_PHONE || '',
    local: process.env.IMESSAGE_LOCAL === 'true',
  },
  isDev: process.env.NODE_ENV !== 'production',
};

// Validate critical environment variables
const requiredVars = [
  'PROJECT_ID',
  'PROJECT_SECRET',
  'GEMINI_API_KEY',
];

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.warn(`Warning: Environment variable ${varName} is not set.`);
  }
});
