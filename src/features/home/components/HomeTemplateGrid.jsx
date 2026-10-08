import { Layers, ArrowRight } from 'lucide-react';
import { BUILDER_TEMPLATES } from '@/features/builder/constants/builder_templates';

export const HomeTemplateGrid = ({ onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {BUILDER_TEMPLATES.map((template) => {
        const boxCount = template.boxes.length;
        return (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex flex-col justify-between transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                  {template.name}
                </h4>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-750">
                  {template.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed mb-3 line-clamp-2">
                {template.description}
              </p>

              {/* Schematic Miniature Box Layout */}
              <div className="relative w-full h-28 bg-zinc-950/80 border border-zinc-800/80 rounded-lg overflow-hidden p-2 mb-3">
                <div className="relative w-full h-full scale-95">
                  {template.boxes.slice(0, 8).map((box, idx) => {
                    const minX = (box.x / 1280) * 100;
                    const minY = (box.y / 1500) * 100;
                    const minW = Math.max(10, (box.width / 1280) * 100);
                    const minH = Math.max(12, (box.height / 1500) * 100);
                    return (
                      <div
                        key={idx}
                        style={{
                          left: `${minX}%`,
                          top: `${minY}%`,
                          width: `${minW}%`,
                          height: `${minH}%`,
                          backgroundColor: box.color,
                          borderColor: box.borderColor,
                        }}
                        className="absolute border rounded-xs opacity-70 group-hover:opacity-90 transition-opacity"
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                <Layers className="w-3 h-3" />
                <span>{boxCount} Editable Boxes</span>
              </div>

              <span className="flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all">
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
