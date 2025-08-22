import React from 'react';
import { useDashboardController } from '../controllers/dashboardController';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { Button } from '../components/ui/Button';
import { RefreshCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { cards, refreshData, selectCard } = useDashboardController();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome to your comprehensive application dashboard
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={refreshData}
          className="flex items-center space-x-2"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <DashboardCard
            key={card.id}
            card={card}
            onClick={selectCard}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Activity item {i + 1}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 minutes ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button variant="primary" className="w-full justify-start">
              Create New Project
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Import Data
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};