import { useRef } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { AmbientGlow } from './AmbientGlow';
import { HomeTemplateGrid } from './HomeTemplateGrid';

export const MainMenuView = ({
  onStartBlank,
  onSelectTemplate,
}) => {
  const templatesRef = useRef(null);

  const scrollToTemplates = () => {
    templatesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-canvas-texture text-slate-100 flex flex-col font-sans select-none">
      {/* Background Lighting from project0002 */}
      <AmbientGlow />

      {/* Primary Navigation Bar (project0002 layout) */}
      <header className="relative z-20 px-6 sm:px-12 md:px-16 py-6 sm:py-8 flex items-center justify-between pointer-events-auto">
        {/* Brand Moniker */}
        <div className="flex items-center gap-3">
          <span className="font-display text-xl sm:text-2xl font-black tracking-[0.15em] text-white">
            LAYOUTCRAFT
          </span>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={onStartBlank}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/20 bg-[#1e2124]/80 hover:bg-white hover:text-black text-[11px] font-mono-tech tracking-[0.15em] text-slate-200 transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>BLANK CANVAS</span>
          </button>
        </div>
      </header>

      {/* Hero Section (in project0002 moniker style) */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 sm:px-12 pb-24">
        <section className="min-h-[82vh] w-full flex flex-col items-center justify-center text-center max-w-5xl mx-auto py-12">
          {/* Intro Tagline */}
          <p className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-slate-400 uppercase mb-3 sm:mb-4">
            VISUAL FRONTEND ENGINE
          </p>

          {/* Hero Display Moniker */}
          <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-black tracking-tight text-white leading-none drop-shadow-md transform hover:scale-[1.01] transition-transform duration-300">
            LAYOUT
          </h1>

          {/* Centered Subtitle Block */}
          <div className="w-full flex justify-center text-center mt-3 sm:mt-5">
            <div className="text-center flex flex-col items-center gap-0.5">
              <span className="block text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.3em] text-slate-300 uppercase">
                A SPECIAL
              </span>
              <span className="block text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.3em] text-slate-400 uppercase">
                LAYOUT BUILDER
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center gap-4 w-full">
            {/* Primary Spotlight Create Button */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/20 via-white/40 to-white/20 opacity-70 blur-md group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <button
                onClick={onStartBlank}
                className="relative flex items-center justify-center gap-3 px-10 py-4 sm:px-12 sm:py-4.5 rounded-full bg-white hover:bg-slate-100 text-black text-xs sm:text-sm font-mono-tech font-bold tracking-[0.25em] transition-all transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer shadow-2xl shadow-black/80 border border-white"
              >
                <span>CREATE FROM SCRATCH</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Secondary Templates Button Placed Underneath */}
            <button
              onClick={scrollToTemplates}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 hover:border-white/25 bg-[#141517]/60 hover:bg-white/10 text-xs font-mono-tech tracking-[0.2em] text-slate-400 hover:text-white transition-all transform hover:translate-y-0.5 group cursor-pointer"
            >
              <span>EXPLORE TEMPLATES</span>
              <ArrowDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-y-0.5 transition-all" />
            </button>
          </div>
        </section>

        {/* Mode Selector Triptych (Dual Showcase Cards) */}
        <section className="w-full max-w-5xl mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Card 01: Blank Canvas */}
            <div
              onClick={onStartBlank}
              className="group relative overflow-hidden bg-[#1c1f23] border border-white/10 hover:border-white/30 rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-2xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono-tech tracking-[0.25em] text-slate-400 uppercase">
                    MODE .01 / SCRATCHPAD
                  </span>
                  <div className="p-1.5 rounded-full border border-white/20 group-hover:border-white bg-white/5 group-hover:bg-white text-slate-300 group-hover:text-black transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 group-hover:text-slate-200 transition-colors">
                  Bikin Layout Sendiri
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Mulai dari kanvas kosong tanpa batas. Tambah kotak bebas, atur ukuran tiap sisi dengan pegangan interaktif, atur grid snap presisi, dan download file HTML mandiri.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono-tech text-slate-400">
                <span>EMPTY 1280PX BOARD</span>
                <span className="text-white group-hover:underline">OPEN CANVAS</span>
              </div>
            </div>

            {/* Card 02: Starter Templates */}
            <div
              onClick={scrollToTemplates}
              className="group relative overflow-hidden bg-[#1c1f23] border border-white/10 hover:border-white/30 rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-2xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono-tech tracking-[0.25em] text-slate-400 uppercase">
                    MODE .02 / TEMPLATES
                  </span>
                  <div className="p-1.5 rounded-full border border-white/20 group-hover:border-white bg-white/5 group-hover:bg-white text-slate-300 group-hover:text-black transition-all">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 group-hover:text-slate-200 transition-colors">
                  Pake Template Siap Pakai
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Pilih dari arsitektur tata letak siap pakai: SaaS Landing Page, Analytics Dashboard, Bento Grid Portfolio, Editorial Magazine, atau Mobile Wireframe.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono-tech text-slate-400">
                <span>5 CURATED STARTERS</span>
                <span className="text-white group-hover:underline">VIEW GALLERY</span>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Gallery Section (project0002 portfolio style) */}
        <section ref={templatesRef} className="w-full max-w-5xl mx-auto pt-16 pb-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] sm:text-xs font-mono-tech tracking-[0.3em] text-slate-400 uppercase block">
              COLLECTION // STARTERS
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
              TEMPLATE LAYOUT SIAP PAKAI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono-tech tracking-wider uppercase">
              SEMUA KOTAK DAPAT DIGESER, DIUBAH UKURANNYA, DAN DI-DOWNLOAD
            </p>
          </div>

          <HomeTemplateGrid onSelectTemplate={onSelectTemplate} />
        </section>
      </main>

      {/* Minimalist Site Footer (project0002 style) */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6 text-center text-[10px] sm:text-xs font-mono-tech tracking-[0.25em] text-slate-500 uppercase">
        LAYOUTCRAFT // VISUAL FRONTEND ARCHITECTURE // YEAR 2026
      </footer>
    </div>
  );
};
