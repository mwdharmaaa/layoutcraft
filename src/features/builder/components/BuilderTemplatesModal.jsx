import { useState } from 'react';
import { X, LayoutTemplate, Layers, Check } from 'lucide-react';
import { BUILDER_TEMPLATES } from '../constants/builder_templates';

export const BuilderTemplatesModal = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Landing', 'Dashboard', 'Bento', 'Editorial', 'Mobile'];

  const filteredTemplates = selectedCategory === 'All'
    ? BUILDER_TEMPLATES
    : BUILDER_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1c1f23] border border-white/15 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden select-none">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/5 border border-white/15 text-slate-300">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-black tracking-[0.15em] text-white uppercase">
                LAYOUT STARTER TEMPLATES
              </h3>
              <p className="text-[10px] font-mono-tech tracking-[0.2em] text-slate-400 uppercase mt-0.5">
                SELECT A STARTER ARCHITECTURE TO LOAD AND EDIT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-[#181a1d] overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1 rounded-full text-[11px] font-mono-tech tracking-[0.15em] uppercase transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#141517]">
          {filteredTemplates.map((template) => {
            const boxCount = template.boxes.length;
            return (
              <div
                key={template.id}
                className="bg-[#1c1f23] border border-white/10 hover:border-white/30 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 shadow-lg hover:-translate-y-0.5 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-display font-bold text-sm sm:text-base text-white group-hover:text-slate-200 transition-colors">
                      {template.name}
                    </span>
                    <span className="text-[10px] font-mono-tech uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-[#141517] text-slate-300 border border-white/10">
                      {template.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 font-sans">
                    {template.description}
                  </p>

                  {/* Schematic Box Preview */}
                  <div className="relative w-full h-24 bg-[#141517] border border-white/10 rounded-lg overflow-hidden p-1.5 mb-3 flex items-center justify-center">
                    <div className="relative w-full h-full scale-95">
                      {template.boxes.slice(0, 7).map((box, idx) => {
                        const minX = (box.x / 1280) * 100;
                        const minY = (box.y / 1500) * 100;
                        const minW = Math.max(8, (box.width / 1280) * 100);
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
                            className="absolute border rounded-xs opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono-tech uppercase tracking-wider">
                    <Layers className="w-3 h-3 text-slate-400" />
                    <span>{boxCount} BOXES</span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono-tech tracking-[0.15em] uppercase font-semibold bg-[#1e2124] hover:bg-white hover:text-black text-slate-200 border border-white/20 transition-all cursor-pointer shadow-sm"
                  >
                    <Check className="w-3 h-3" />
                    <span>LOAD TEMPLATE</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
