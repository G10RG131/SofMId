import axios from 'axios';
import { generateFlashcardFront } from '../src/logic/llmService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('generateFlashcardFront', () => {
  const mockBackText = 'Paris is the capital of France.';
  const mockFrontText = 'What is the capital of France?';

  it('should return the generated front text on success', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { front: mockFrontText },
    });

    const result = await generateFlashcardFront(mockBackText);
    expect(result).toBe(mockFrontText);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { prompt: expect.stringContaining(mockBackText) },
      expect.any(Object)
    );
  });

  it('should throw an error if the API response is invalid', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {},
    });

    await expect(generateFlashcardFront(mockBackText)).rejects.toThrow(
      'Invalid response from LLM API.'
    );
  });

  it('should throw an error if the API call fails', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { status: 500, data: { message: 'Internal Server Error' } },
    });

    await expect(generateFlashcardFront(mockBackText)).rejects.toThrow(
      'LLM API error: 500 - Internal Server Error'
    );
  });

  it('should throw an error if the API does not respond', async () => {
    mockedAxios.post.mockRejectedValueOnce({ request: {} });

    await expect(generateFlashcardFront(mockBackText)).rejects.toThrow(
      'LLM API did not respond.'
    );
  });

  it('should throw an error for network issues', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

    await expect(generateFlashcardFront(mockBackText)).rejects.toThrow(
      'LLM API request failed: Network Error'
    );
  });
});