'use client';

import { useEffect, useState } from 'react';
import yaml from 'js-yaml';
import SwaggerUIWrapper from './SwaggerUIWrapper';
import { i18n, type Language } from '@/config/i18n';

interface ApiViewerProps {
  yamlContent: string;
  error: string | null;
  isLoading: boolean;
  language: Language;
}

export default function ApiViewer({ 
  yamlContent, 
  error, 
  isLoading,
  language,
}: ApiViewerProps) {
  const [spec, setSpec] = useState<any>(null);
  const t = i18n[language];

  useEffect(() => {
    if (yamlContent) {
      try {
        const cleanedContent = yamlContent
          .replace(/^```(?:ya?ml)?\s*/i, '') // 移除开头的 ```yaml 或 ```yml
          .replace(/\s*```\s*$/, '') // 移除结尾的 ```
          .replace(/```\s*$/, '') // 额外检查结尾的 ```
          .trim();
        const jsonSpec = yaml.load(cleanedContent);
        setSpec(jsonSpec);
      } catch (err) {
        console.error('Failed to parse YAML:', err);
      }
    }
  }, [yamlContent]);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm h-[calc(100vh-8rem)] flex flex-col">
      
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t.common.error}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && spec && (
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="swagger-ui h-full">
            <SwaggerUIWrapper spec={spec} />
          </div>
          <div className="h-24" aria-hidden="true" />
        </div>
      )}

      {!isLoading && !error && !spec && (
        <div className="rounded-md bg-gray-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                {t.apiViewer.placeholder}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
