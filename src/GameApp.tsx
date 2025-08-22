import React, { useState } from 'react';
import { GameLayout, GameDashboard, Leaderboard } from './modules/game';

type GamePage = 'dashboard' | 'leaderboard' | 'achievements' | 'tournaments' | 'profile' | 'store';

export const GameApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<GamePage>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <GameDashboard />;
      case 'leaderboard': return <Leaderboard />;
      case 'achievements': return <Placeholder title="Achievements" />;
      case 'tournaments': return <Placeholder title="Tournaments" />;
      case 'profile': return <Placeholder title="Player Profile" />;
      case 'store': return <Placeholder title="Game Store" />;
      default: return <GameDashboard />;
    }
  };

  return (
    <GameLayout currentPage={currentPage} onPageChange={(p) => setCurrentPage(p as GamePage)}>
      {renderPage()}
    </GameLayout>
  );
};

const Placeholder = ({ title }: { title: string }) => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
    <p className="text-gray-600 dark:text-gray-400">{title} page coming soon</p>
  </div>
);
