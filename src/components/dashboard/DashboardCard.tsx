import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { DashboardCard as DashboardCardType } from '../../types';
import { Card, CardContent } from '../ui/Card';

interface DashboardCardProps {
  card: DashboardCardType;
  onClick?: (card: DashboardCardType) => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ card, onClick }) => {
  const IconComponent = Icons[card.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
  
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900',
    emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900',
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900',
    green: 'text-green-600 bg-green-100 dark:bg-green-900',
  };

  return (
    <Card hoverable onClick={() => onClick?.(card)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {card.title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {card.value}
            </p>
            {card.trend && (
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  card.trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend.direction === 'up' ? '+' : '-'}{card.trend.value}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  vs last month
                </span>
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-full ${colorClasses[card.color as keyof typeof colorClasses]}`}>
            <IconComponent size={24} />
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          {card.description}
        </p>
      </CardContent>
    </Card>
  );
};