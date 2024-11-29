import fetch from 'node-fetch';

// API 生成提示词
export const API_PROMPT = `You are an expert API designer. Your task is to create an OpenAPI specification based on the user's requirements.
Please follow these guidelines:
1. Use OpenAPI 3.0.0 specification
2. Include appropriate request/response schemas
3. Add clear descriptions for endpoints and parameters
4. Follow RESTful principles
5. Include common status codes and error responses
6. Output in YAML format

Requirements:`;

// 生成 API 规范
export async function generateApiSpec(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate API specification');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.specification;
  } catch (error) {
    console.error('Error generating API specification:', error);
    throw error;
  }
}
