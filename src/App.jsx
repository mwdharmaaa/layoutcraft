import { useState } from 'react';
import { MainMenuView } from '@/features/home/components/MainMenuView';
import { LayoutBuilderView } from '@/features/builder/components/LayoutBuilderView';

export default function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [activeTemplate, setActiveTemplate] = useState(null);

  const handleStartBlank = () => {
    setActiveTemplate(null);
    setCurrentView('builder');
  };

  const handleSelectTemplate = (template) => {
    setActiveTemplate(template);
    setCurrentView('builder');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  if (currentView === 'builder') {
    return (
      <LayoutBuilderView
        key={activeTemplate ? activeTemplate.id : 'blank'}
        onBackToMenu={handleBackToMenu}
        initialTemplate={activeTemplate}
        initialBoxes={activeTemplate ? activeTemplate.boxes : []}
      />
    );
  }

  return (
    <MainMenuView
      onStartBlank={handleStartBlank}
      onSelectTemplate={handleSelectTemplate}
    />
  );
}
