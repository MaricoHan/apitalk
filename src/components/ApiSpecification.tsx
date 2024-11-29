import { type Language } from '@/config/i18n';
import { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('yaml', yaml);

interface Props {
  specification: string;
  error: string | null;
  isLoading: boolean;
  language: Language;
  streamProgress?: {
    status: 'analyzing' | 'generating' | 'complete';
    progress: number;
  };
}

export default function ApiSpecification({ specification, error, isLoading, language, streamProgress }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(specification);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderProgress = () => {
    if (!streamProgress) return null;

    const statusText = {
      analyzing: language === 'zh' ? '分析需求中...' : 'Analyzing requirements...',
      generating: language === 'zh' ? '生成API规范中...' : 'Generating API specification...',
      complete: language === 'zh' ? '完成' : 'Complete'
    }[streamProgress.status];

    return (
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{statusText}</span>
              <span className="text-sm text-gray-500">{streamProgress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${streamProgress.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm h-[calc(100vh-8rem)] flex flex-col">
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex-1 min-h-0">
        {renderProgress()}
        <div className="h-full overflow-auto rounded-lg bg-[#282c34]">
          {specification ? (
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="absolute right-2 top-2 z-10 rounded-md bg-white/90 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300/50 hover:border-gray-300 backdrop-blur-sm transition-colors"
              >
                {copied ? (language === 'zh' ? '已复制' : 'Copied') : (language === 'zh' ? '复制' : 'Copy')}
              </button>
              <SyntaxHighlighter
                language="yaml"
                style={atomOneDark}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  lineHeight: '1.5rem',
                }}
              >
                {specification}
              </SyntaxHighlighter>
            </div>
          ) : !isLoading && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              {language === 'zh' ? '输入您的 API 需求以查看 YAML 规范' : 'Enter your API requirements to see the YAML specification'}
            </div>
          )}
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}
