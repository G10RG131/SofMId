import dotenv from 'dotenv';

dotenv.config();

export const LLM_API_KEY = process.env.LLM_API_KEY || '';
export const LLM_API_URL = process.env.LLM_API_URL || '';