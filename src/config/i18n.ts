export interface I18n {
  common: {
    error: string;
    loading: string;
    clear: string;
    clearConfirm: string;
    download: string;
    title: string;
    import: string;
  };
  home: {
    title: string;
    description: string;
    tabs: {
      docs: string;
      yaml: string;
    };
  };
  apiViewer: {
    title: string;
    placeholder: string;
  };
  apiSpec: {
    title: string;
    placeholder: string;
    copy: string;
    copied: string;
    download: string;
  };
  import: {
    title: string;
    or: string;
    description: string;
    error: string;
  };
  chat: {
    title: string;
    placeholder: string;
    success: string;
    error: string;
    send: string;
  };
  tabs: {
    spec: string;
    docs: string;
  };
  error: {
    title: string;
    retry: string;
  };
}

export type Language = 'zh' | 'en';

export const i18n: Record<Language, I18n> = {
  zh: {
    common: {
      error: '错误',
      loading: '加载中...',
      clear: '全部清除',
      clearConfirm: '确定要清除所有内容吗？',
      download: '下载',
      title: 'APITalk - AI 驱动的 API 设计工具',
      import: '导入',
    },
    home: {
      title: 'API 设计器',
      description: '使用自然语言生成 OpenAPI 规范',
      tabs: {
        docs: '交互文档',
        yaml: 'YAML',
      },
    },
    apiViewer: {
      title: 'API 文档',
      placeholder: '输入您的 API 需求以查看交互式文档。',
    },
    apiSpec: {
      title: 'API 规范',
      placeholder: '输入您的 API 需求以查看规范。',
      copy: '复制',
      copied: '已复制',
      download: '下载',
    },
    import: {
      title: '导入 OpenAPI 规范',
      or: '导入已有的 OpenAPI 规范',
      description: '拖放您的 YAML 文件到此处或点击选择',
      error: '导入文件失败',
    },
    chat: {
      title: '对话',
      placeholder: '输入你的需求，让我帮你生成 API 规范',
      success: '我已经根据您的要求更新了 API 规范。您可以在左侧编辑器中查看更改。您是否需要进行其他调整？',
      error: '抱歉，更新 API 规范时遇到错误。请重试。',
      send: '发送',
    },
    tabs: {
      spec: 'YAML 文档',
      docs: '交互文档',
    },
    error: {
      title: '错误',
      retry: '重试',
    },
  },
  en: {
    common: {
      error: 'Error',
      loading: 'Loading...',
      clear: 'Clear All',
      clearConfirm: 'Are you sure you want to clear all content?',
      download: 'Download',
      title: 'APITalk - AI-Powered API Designer',
      import: 'Import',
    },
    home: {
      title: 'API Designer',
      description: 'Generate OpenAPI specifications using natural language',
      tabs: {
        docs: 'Interactive Docs',
        yaml: 'YAML',
      },
    },
    apiViewer: {
      title: 'API Documentation',
      placeholder: 'Enter your API requirements to view interactive documentation.',
    },
    apiSpec: {
      title: 'API Specification',
      placeholder: 'Enter your API requirements to view the specification.',
      copy: 'Copy',
      copied: 'Copied',
      download: 'Download',
    },
    import: {
      title: 'Import OpenAPI Specification',
      or: 'Import existing OpenAPI specification',
      description: 'Drop your YAML file here or click to select',
      error: 'Failed to import file',
    },
    chat: {
      title: 'Chat',
      placeholder: 'Enter your requirements and I\'ll help generate API specifications',
      success: 'I have updated the API specification based on your requirements. You can view the changes in the editor on the left. Would you like to make any additional adjustments?',
      error: 'Sorry, I encountered an error while updating the API specification. Please try again.',
      send: 'Send',
    },
    tabs: {
      spec: 'YAML Documentation',
      docs: 'Interactive Documentation',
    },
    error: {
      title: 'Error',
      retry: 'Retry',
    },
  },
};
