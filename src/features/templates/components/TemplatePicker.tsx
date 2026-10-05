import type { FC } from 'react';
import { LayoutTemplate, Sparkles } from 'lucide-react';
import { TEMPLATES_DATA, type TemplateDefinition } from '../constants/templates_data';

interface TemplatePickerProps {
  onSelectTemplate: (template: TemplateDefinition) => void;
}

export const TemplatePicker: FC<TemplatePickerProps> = ({ onSelectTemplate }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
        <LayoutTemplate className="w-4 h-4 text-zinc-400" />
        <h4 className="text-xs font-semibold text-zinc-300">Layout Presets</h4>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {TEMPLATES_DATA.map((template) => (
          <div
            key={template.id}
            className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-850/60 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors">
                  {template.name}
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {template.category}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal mb-3">
                {template.description}
              </p>
            </div>

            <button
              onClick={() => onSelectTemplate(template)}
              className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-zinc-800 hover:bg-blue-600 text-zinc-300 hover:text-white rounded-md text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Template</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
