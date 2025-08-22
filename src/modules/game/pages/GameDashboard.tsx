import React from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Trophy, Star, Coins, Gem } from 'lucide-react';
import { useGameAuthController } from '../controllers/gameAuthController';

export const GameDashboard: React.FC = () => {
  const { player, achievements } = useGameAuthController();

  const playerStats = [
    { title: 'Level', value: player?.level || 0, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { title: 'Experience', value: player?.experience || 0, icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Coins', value: player?.coins || 0, icon: Coins, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Gems', value: player?.gems || 0, icon: Gem, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {player?.username}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Ready for your next adventure?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {playerStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Achievements
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.slice(0, 5).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-600' :
                    achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                    achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Trophy size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {achievement.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {achievement.points} points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-3 text-left bg-purple-50 dark:bg-purple-900 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-lg transition-colors">
                <div className="font-medium text-purple-900 dark:text-purple-100">Start New Game</div>
                <div className="text-sm text-purple-600 dark:text-purple-300">Jump into action</div>
              </button>
              <button className="w-full p-3 text-left bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors">
                <div className="font-medium text-blue-900 dark:text-blue-100">View Leaderboard</div>
                <div className="text-sm text-blue-600 dark:text-blue-300">See your ranking</div>
              </button>
              <button className="w-full p-3 text-left bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg transition-colors">
                <div className="font-medium text-green-900 dark:text-green-100">Join Tournament</div>
                <div className="text-sm text-green-600 dark:text-green-300">Compete with others</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};