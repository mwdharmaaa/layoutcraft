import { useState } from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import {
  boxesToTailwindCode,
  boxesToHtmlCode,
} from '../utils/box_converter';

export const BuilderExportModal = ({
  isOpen,
  onClose,
  boxes,
  onApplyToStudio,
}) => {
  const [tab, setTab] = useState('tailwind');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getCode = () => {
    if (tab === 'tailwind') return boxesToTailwindCode(boxes);
    if (tab === 'html') return boxesToHtmlCode(boxes);
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

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden select-none">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Export Custom Layout</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Copy production-ready markup or apply directly to Studio
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-800 bg-zinc-950 px-4 pt-2 gap-4 text-xs font-medium">
          {['tailwind', 'html', 'json'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 capitalize transition-colors ${
                tab === t
                  ? 'text-blue-400 border-b-2 border-blue-500 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t === 'tailwind' ? 'Tailwind (React)' : t === 'html' ? 'HTML + CSS' : 'JSON Schema'}
            </button>
          ))}
        </div>

        {/* Code Viewport */}
        <div className="flex-1 p-4 overflow-auto bg-zinc-950 font-mono text-xs text-zinc-300">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed select-text">{code}</pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <button
            onClick={onApplyToStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply to Studio</span>
          </button>

          <div className="flex items-center gap-2">
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
