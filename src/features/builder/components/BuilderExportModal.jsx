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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1c1f23] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden select-none">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-display font-black tracking-[0.15em] text-white uppercase">
              EXPORT & DOWNLOAD LAYOUT
            </h3>
            <p className="text-[10px] font-mono-tech tracking-[0.2em] text-slate-400 uppercase mt-0.5">
              DOWNLOAD RUNNABLE HTML OR COPY CODE SNIPPETS
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Sub-Toggle */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#181a1d] px-5 py-2.5 text-xs">
          <div className="flex items-center gap-1.5">
            {['html', 'tailwind', 'json'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono-tech tracking-[0.15em] uppercase transition-all cursor-pointer ${
                  tab === t
                    ? 'bg-white text-black font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t === 'html' ? 'HTML + CSS' : t === 'tailwind' ? 'Tailwind (React)' : 'JSON Schema'}
              </button>
            ))}
          </div>

          {tab === 'html' && (
            <div className="flex items-center gap-1 bg-[#141517] border border-white/10 rounded-full p-0.5 text-[10px] font-mono-tech">
              <button
                onClick={() => setHtmlMode('document')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  htmlMode === 'document'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DOCUMENT
              </button>
              <button
                onClick={() => setHtmlMode('snippet')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  htmlMode === 'snippet'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SNIPPET
              </button>
            </div>
          )}
        </div>

        {/* Code Viewport */}
        <div className="flex-1 p-5 overflow-auto bg-[#141517] font-mono-tech text-xs text-slate-300">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed select-text">{code}</pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between bg-[#181a1d]">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono-tech uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>READY FOR PRODUCTION</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono-tech tracking-[0.15em] uppercase font-bold bg-[#1e2124] hover:bg-white hover:text-black text-slate-200 border border-white/20 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD {tab === 'html' ? 'HTML' : tab === 'tailwind' ? 'JSX' : 'JSON'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono-tech tracking-[0.15em] uppercase font-bold bg-white hover:bg-slate-200 text-black border border-white/40 transition-all cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY CODE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
