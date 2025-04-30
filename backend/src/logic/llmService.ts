import axios from 'axios';
import { LLM_API_KEY, LLM_API_URL } from '../config';

/**
 * Generates a flashcard front text based on the provided back text.
 * @param backText - The back text of the flashcard.
 * @returns The generated front text.
 * @throws Error if the API call fails or returns an invalid response.
 */
export async function generateFlashcardFront(backText: string): Promise<string> {
  if (!LLM_API_KEY || !LLM_API_URL) {
    throw new Error('LLM API configuration is missing.');
  }

  try {
    const response = await axios.post(
      LLM_API_URL,
      {
        prompt: `Generate a flashcard front for the following back text:\n"${backText}"`,
      },
      {
        headers: {
          'Authorization': `Bearer ${LLM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200 || !response.data || !response.data.front) {
      throw new Error('Invalid response from LLM API.');
    }

    return response.data.front;
  } catch (error: any) {
    if (error.response) {
      // API responded with a status code outside the 2xx range
      throw new Error(
        `LLM API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      // No response received from the API
      throw new Error('LLM API did not respond.');
    } else {
      // Other errors (e.g., network issues)
      throw new Error(`LLM API request failed: ${error.message}`);
    }
  }
}