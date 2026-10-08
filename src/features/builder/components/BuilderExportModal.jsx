import { useState } from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
import {
  boxesToTailwindCode,
} from '../utils/box_converter';
import {
  generateStandaloneHtml,
  generateHtmlSnippet,
  downloadFile,
} from '../utils/html_exporter';

export const BuilderExportModal = ({
  isOpen,
  onClose,
  boxes,
}) => {
  const [tab, setTab] = useState('html');
  const [htmlMode, setHtmlMode] = useState('document');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getCode = () => {
    if (tab === 'tailwind') return boxesToTailwindCode(boxes);
    if (tab === 'html') {
      return htmlMode === 'document'
        ? generateStandaloneHtml(boxes)
        : generateHtmlSnippet(boxes);
    }
    return JSON.stringify(boxes, null, 2);
  };

  const code = getCode();

  const handleCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (tab === 'html') {
      downloadFile('layoutcraft-layout.html', code, 'text/html;charset=utf-8');
    } else if (tab === 'tailwind') {
      downloadFile('LayoutCraftComponent.jsx', code, 'text/javascript;charset=utf-8');
    } else {
      downloadFile('layoutcraft-schema.json', code, 'application/json;charset=utf-8');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden select-none">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Export & Download Layout</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Download ready-to-run HTML or copy component markup
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Sub-Toggle */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 pt-2 text-xs font-medium">
          <div className="flex gap-4">
            {['html', 'tailwind', 'json'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 capitalize transition-colors ${
                  tab === t
                    ? 'text-blue-400 border-b-2 border-blue-500 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t === 'html' ? 'HTML + CSS' : t === 'tailwind' ? 'Tailwind (React)' : 'JSON Schema'}
              </button>
            ))}
          </div>

          {tab === 'html' && (
            <div className="flex items-center gap-1 mb-2 bg-zinc-900 border border-zinc-800 rounded-md p-0.5 text-[11px]">
              <button
                onClick={() => setHtmlMode('document')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  htmlMode === 'document'
                    ? 'bg-zinc-800 text-blue-400 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Full Document
              </button>
              <button
                onClick={() => setHtmlMode('snippet')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  htmlMode === 'snippet'
                    ? 'bg-zinc-800 text-blue-400 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Snippet
              </button>
            </div>
          )}
        </div>

        {/* Code Viewport */}
        <div className="flex-1 p-4 overflow-auto bg-zinc-950 font-mono text-xs text-zinc-300">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed select-text">{code}</pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready for production</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/60 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Download {tab === 'html' ? 'HTML' : tab === 'tailwind' ? 'JSX' : 'JSON'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
