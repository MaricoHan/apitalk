import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { dump } from 'js-yaml';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  defaultQuery: {},
  timeout: 30000,
});

export async function POST(request: Request) {
  try {
    const { messages, currentSpec, language } = await request.json();

    const systemPrompt = `You are an API designer that creates OpenAPI 3.0.0 specifications.
Your response must be a JSON object with exactly these fields:
1. "specification": A complete OpenAPI 3.0.0 object
2. "explanation": A brief explanation in ${language === 'zh' ? 'Chinese' : 'English'}

Example format:
{
  "specification": {
    "openapi": "3.0.0",
    "info": {
      "title": "Example API",
      "version": "1.0.0"
    },
    "paths": {
      "/example": {
        "get": {
          "summary": "Example endpoint"
        }
      }
    }
  },
  "explanation": "Brief explanation of the API design"
}

Guidelines:
- Use proper HTTP methods
- Include descriptions and examples
- Document all parameters
- Follow RESTful practices
- Include security requirements`;

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
      model: process.env.OPENAI_MODEL || 'gpt-4-1106-preview',  // 确保使用支持 JSON 模式的模型
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }  // 强制返回 JSON
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
    console.error('Error generating API specification:', {
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code,
      param: error.param,
      details: error.error,
    });

    return NextResponse.json(
      {
        error: error.message,
        details: {
          status: error.status,
          type: error.type,
          code: error.code,
        }
      },
      { status: error.status || 500 }
    );
  }
}
