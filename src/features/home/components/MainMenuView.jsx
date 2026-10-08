import { useRef } from 'react';
import { Boxes, PlusCircle, LayoutTemplate, Sparkles, ArrowDown } from 'lucide-react';
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none overflow-y-auto">
      {/* Top Navbar */}
      <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Boxes className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white">LayoutCraft</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-750">
              v2.5
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
            Interactive Visual Architecture
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 flex flex-col gap-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/40 text-blue-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Frontend Layout Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
            Pilih Mode Rancang Tata Letak
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Mulai dari kanvas kosong untuk kebebasan penuh, atau pilih salah satu template arsitektur responsif yang siap kamu modifikasi langsung.
          </p>
        </div>

        {/* Primary Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Bikin Layout Sendiri */}
          <div
            onClick={onStartBlank}
            className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Bikin Layout Sendiri
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                Mulai dari kanvas kosong tanpa batas. Tambah kotak dengan mudah, seret posisi, sesuaikan ukuran tiap sisi lewat pegangan interaktif, dan atur grid snap presisi.
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartBlank();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md shadow-blue-600/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buka Kanvas Kosong</span>
            </button>
          </div>

          {/* Option 2: Pake Template */}
          <div
            onClick={scrollToTemplates}
            className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Pake Template Siap Pakai
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                Pilih dari 5 tata letak siap pakai: Landing Page, Dashboard, Bento Grid, Editorial, atau Mobile Wireframe. Semua elemen tetap 100% bisa digeser dan diedit.
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                scrollToTemplates();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-colors shadow-md"
            >
              <ArrowDown className="w-4 h-4 text-emerald-400" />
              <span>Pilih Dari Template Tersedia</span>
            </button>
          </div>
        </div>

        {/* Templates Gallery Section */}
        <section ref={templatesRef} className="pt-4 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-zinc-100">
                Koleksi Template Siap Modifikasi
              </h3>
              <p className="text-xs text-zinc-400">
                Klik template mana pun untuk langsung membukanya di kanvas visual.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              5 Template Tersedia
            </span>
          </div>

          <HomeTemplateGrid onSelectTemplate={onSelectTemplate} />
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-500">
        LayoutCraft - Production-Grade Visual Layout Architecture & Standalone HTML Exporter
      </footer>
    </div>
  );
};
