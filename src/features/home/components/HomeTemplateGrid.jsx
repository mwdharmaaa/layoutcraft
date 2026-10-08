import { Layers, ArrowUpRight } from 'lucide-react';
import { BUILDER_TEMPLATES } from '@/features/builder/constants/builder_templates';

export const HomeTemplateGrid = ({ onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {BUILDER_TEMPLATES.map((template, idx) => {
        const boxCount = template.boxes.length;
        const numberTag = String(idx + 1).padStart(2, '0');

        return (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="group relative overflow-hidden bg-[#1c1f23] border border-white/10 hover:border-white/30 rounded-xl flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1"
          >
            {/* Upper Content Section */}
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono-tech tracking-[0.25em] text-slate-400 uppercase">
                  {numberTag} / {template.category}
                </span>
                <span className="text-[10px] font-mono-tech text-slate-500 uppercase flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-400" />
                  <span>{boxCount} BOXES</span>
                </span>
              </div>

              <h4 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-slate-200 transition-colors mb-2">
                {template.name}
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Schematic Miniature Box Layout */}
              <div className="relative w-full h-28 bg-[#141517] border border-white/10 rounded-lg overflow-hidden p-2">
                <div className="relative w-full h-full scale-95">
                  {template.boxes.slice(0, 8).map((box, bIdx) => {
                    const minX = (box.x / 1280) * 100;
                    const minY = (box.y / 1500) * 100;
                    const minW = Math.max(10, (box.width / 1280) * 100);
                    const minH = Math.max(12, (box.height / 1500) * 100);
                    return (
                      <div
                        key={bIdx}
                        style={{
                          left: `${minX}%`,
                          top: `${minY}%`,
                          width: `${minW}%`,
                          height: `${minH}%`,
                          backgroundColor: box.color,
                          borderColor: box.borderColor,
                        }}
                        className="absolute border rounded-xs opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card Info Footer */}
            <div className="px-4 sm:px-5 py-3.5 bg-[#181a1d] border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono-tech tracking-[0.2em] text-slate-300 group-hover:text-white uppercase transition-colors">
                LOAD TEMPLATE
              </span>
              <div className="p-1.5 rounded-full border border-white/20 group-hover:border-white bg-white/5 group-hover:bg-white text-slate-300 group-hover:text-black transition-all">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
