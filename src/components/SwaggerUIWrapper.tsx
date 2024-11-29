'use client';

import { useEffect, useRef } from 'react';
import { SwaggerUIBundle } from 'swagger-ui-dist';
import 'swagger-ui-dist/swagger-ui.css';

interface SwaggerUIWrapperProps {
  spec: any;
}

export default function SwaggerUIWrapper({ spec }: SwaggerUIWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建新的 UI 实例
    const ui = SwaggerUIBundle({
      dom_id: '#swagger-ui',
      spec,
      docExpansion: 'list',
      defaultModelsExpandDepth: -1,
      displayOperationId: false,
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      layout: "BaseLayout",
      supportedSubmitMethods: []  // 禁用 "Try it out" 按钮
    });

    uiRef.current = ui;

    // 添加自定义样式
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .swagger-ui .wrapper {
        padding-bottom: 8rem !important;
      }
      .swagger-ui .opblock {
        margin-bottom: 1.5rem !important;
      }
      .swagger-ui .opblock:last-child {
        margin-bottom: 0 !important;
      }
    `;
    containerRef.current.appendChild(styleEl);

    // 组件卸载时清理
    return () => {
      if (containerRef.current) {
        // 清空容器内容
        containerRef.current.innerHTML = '';
      }
      uiRef.current = null;
    };
  }, [spec]);

  return <div id="swagger-ui" ref={containerRef} className="pb-24" />;
}
