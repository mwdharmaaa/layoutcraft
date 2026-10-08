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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden select-none">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Layout Starter Templates</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Select a responsive architecture template to load and customize
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-800 bg-zinc-950/60 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-zinc-950">
          {filteredTemplates.map((template) => {
            const boxCount = template.boxes.length;
            return (
              <div
                key={template.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-zinc-700 transition-all hover:shadow-lg group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                      {template.name}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-750">
                      {template.category}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                    {template.description}
                  </p>

                  {/* Schematic Box Preview */}
                  <div className="relative w-full h-24 bg-zinc-950/80 border border-zinc-800/80 rounded-md overflow-hidden p-1.5 mb-3 flex items-center justify-center">
                    <div className="relative w-full h-full scale-95">
                      {template.boxes.slice(0, 7).map((box, idx) => {
                        // Scaled down miniature
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
                            className="absolute border rounded-xs opacity-70"
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                    <Layers className="w-3 h-3" />
                    <span>{boxCount} Editable Boxes</span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-zinc-800 hover:bg-blue-600 text-zinc-200 hover:text-white border border-zinc-700/60 hover:border-blue-500 transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Load Template</span>
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
