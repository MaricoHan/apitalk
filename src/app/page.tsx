'use client';

import { useState, useEffect } from 'react';
import ApiSpecification from '@/components/ApiSpecification';
import ChatPanel from '@/components/ChatPanel';
import ApiViewer from '@/components/ApiViewer';
import ImportPanel from '@/components/ImportPanel';
import LanguageToggle from '@/components/LanguageToggle';
import { i18n, type Language } from '@/config/i18n';
import yaml from 'js-yaml';

type TabType = 'spec' | 'docs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface StreamResponse {
  specification?: any;
  explanation?: string;
}

export default function Home() {
  const [specification, setSpecification] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('docs');
  const [language, setLanguage] = useState<Language>(() => {
    // 检测浏览器语言
    if (typeof window !== 'undefined') {
      const browserLang = window.navigator.language;
      return browserLang.startsWith('zh') ? 'zh' : 'en';
    }
    return 'zh';
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [key, setKey] = useState(0);
  const [streamedText, setStreamedText] = useState('');
  const [streamProgress, setStreamProgress] = useState<{
    status: 'analyzing' | 'generating' | 'complete';
    progress: number;
  }>({ status: 'analyzing', progress: 0 });

  const t = i18n[language];

  const handleSubmit = async (message: Message) => {
    if (isLoading) return;

    const newMessages = [...messages, message];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);
    setSpecification('');
    setStreamProgress({ status: 'analyzing', progress: 20 });

    try {
      console.log('Sending request to API...');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          language,
          currentSpec: specification
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setStreamProgress({ status: 'generating', progress: 60 });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSpecification(data.specification);
      setMessages([...newMessages, { role: 'assistant', content: data.explanation }]);
      setStreamProgress({ status: 'complete', progress: 100 });

    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
      setStreamProgress({ status: 'complete', progress: 100 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = (content: string) => {
    try {
      setSpecification(content);
      setShowImport(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleClear = () => {
    if (window.confirm(t.common.clearConfirm)) {
      setSpecification('');
      setStreamedText('');
      setMessages([]);
      setError(null);
      setKey(prevKey => prevKey + 1);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex justify-between items-center border-b border-gray-200 px-6 py-2">
        <h1 className="text-xl font-semibold">{t.home.title}</h1>
        <div className="flex items-center gap-6">
          <LanguageToggle language={language} onChange={setLanguage} />
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {t.common.clear}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/2 flex-col border-r border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200">
            <div className="flex">
              <button
                className={`min-w-[120px] px-4 py-2 text-sm ${activeTab === 'docs'
                    ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab('docs')}
              >
                {t.tabs.docs}
              </button>
              <button
                className={`min-w-[120px] px-4 py-2 text-sm ${activeTab === 'spec'
                    ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab('spec')}
              >
                {t.tabs.spec}
              </button>
            </div>
            {specification && (
              <button
                onClick={() => {
                  const blob = new Blob([specification], { type: 'text/yaml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'api-specification.yaml';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 transition-colors mr-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {t.common.download}
              </button>
            )}
          </div>

          <div className="relative flex-1">
            {activeTab === 'docs' ? (
              <ApiViewer
                yamlContent={specification}
                error={error}
                isLoading={isLoading}
                language={language}
                key={key}
              />
            ) : (
              <div className="relative flex-1">
                {streamedText && !specification && (
                  <div className="absolute inset-0 bg-gray-50 p-4 overflow-auto">
                    <div className="font-mono text-sm text-gray-600 whitespace-pre-wrap">
                      <div className="animate-pulse mb-2">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                      </div>
                      {streamedText}
                    </div>
                  </div>
                )}
                <ApiSpecification
                  specification={specification}
                  error={error}
                  isLoading={isLoading}
                  language={language}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex w-1/2 flex-col">
          {!specification && messages.length === 0 && (
            <div className="border-b border-gray-200 p-4">
              <ImportPanel onImport={handleImport} onCancel={() => setShowImport(false)} language={language} />
            </div>
          )}
          <ChatPanel
            messages={messages}
            onSendMessage={handleSubmit}
            isLoading={isLoading}
            language={language}
          />
        </div>
      </div>
    </main>
  );
}
