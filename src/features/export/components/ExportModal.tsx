import React, { useState } from 'react';
import { X, Copy, Check, Download, Upload, Code2 } from 'lucide-react';
import type { LayoutNode } from '@/core/types/element.types';
import {
  generateStandardHtml,
  generateReactComponent,
  generateProjectJson,
} from '../utils/code_generator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  rootNode: LayoutNode;
  onImportLayout: (importedRoot: LayoutNode) => void;
}

type ExportTab = 'html' | 'react' | 'json';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  rootNode,
  onImportLayout,
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getCode = () => {
    switch (activeTab) {
      case 'html': return generateStandardHtml(rootNode);
      case 'react': return generateReactComponent(rootNode);
      case 'json': return generateProjectJson(rootNode);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'html' ? 'html' : activeTab === 'react' ? 'tsx' : 'json';
    const blob = new Blob([getCode()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `layoutcraft-export.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.id && parsed.styles) {
          onImportLayout(parsed);
          onClose();
        }
      } catch (err) {
        alert('Invalid JSON layout file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-zinc-100 text-base">Export & Share Layout</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950/40">
          <div className="flex gap-2">
            {(['html', 'react', 'json'] as ExportTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {tab === 'html' ? 'HTML + CSS' : tab === 'react' ? 'React JSX' : 'JSON Schema'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-5 flex-1 overflow-auto bg-zinc-950">
          <pre className="font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre selection:bg-blue-900 selection:text-white">
            {getCode()}
          </pre>
        </div>
      </div>
    </div>
  );
};
