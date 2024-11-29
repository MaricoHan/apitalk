import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { dump } from 'js-yaml';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages, currentSpec, language } = await request.json();

    const systemPrompt = `You are an expert API designer specializing in creating modern, RESTful APIs. Your task is to create or modify OpenAPI 3.0.0 specifications based on user requirements.
Please use ${language === 'zh' ? 'Chinese' : 'English'} language for all descriptions, examples, and documentation.

IMPORTANT: Your response MUST be a valid JSON object with exactly two fields:
1. "specification": The complete OpenAPI 3.0.0 specification object
2. "explanation": A natural language explanation of the API design decisions

Example response format:
{
  "specification": {
    "openapi": "3.0.0",
    "info": {
      "title": "Example API",
      "version": "1.0.0"
    }
  },
  "explanation": "Here is my explanation..."
}

Follow these guidelines:
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Include comprehensive descriptions and examples
- Document all parameters thoroughly
- Follow RESTful best practices
- Ensure proper error responses
- Include security requirements

Remember: Your entire response must be a valid JSON object that can be parsed by JSON.parse().`;

    const apiMessages = [
      {
        role: 'system' as const,
        content: systemPrompt,
      },
      ...(currentSpec
        ? [
          {
            role: 'system' as const,
            content: `Current OpenAPI Specification:\n${currentSpec}\n\nModify this specification according to the user's requirements while maintaining the existing structure where appropriate.`,
          },
        ]
        : []),
      ...messages.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      const jsonResponse = JSON.parse(response);
      if (!jsonResponse.specification || !jsonResponse.explanation) {
        throw new Error('Invalid response format: missing required fields');
      }

      const yamlSpec = dump(jsonResponse.specification);

      return NextResponse.json({
        specification: yamlSpec,
        explanation: jsonResponse.explanation
      });

    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      throw new Error('Invalid response format from OpenAI');
    }

  } catch (error: any) {
    console.error('Error generating API specification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate API specification' },
      { status: 500 }
    );
  }
}
