import React from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Trophy, Medal, Award } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const leaderboard = [
    { rank: 1, username: 'ProGamer123', score: 15420, level: 25, avatar: '🏆' },
    { rank: 2, username: 'GameMaster', score: 14850, level: 23, avatar: '🥈' },
    { rank: 3, username: 'SkillzPlayer', score: 14200, level: 22, avatar: '🥉' },
    { rank: 4, username: 'EliteGamer', score: 13800, level: 21, avatar: '⭐' },
    { rank: 5, username: 'ChampionX', score: 13500, level: 20, avatar: '🎮' },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          See how you rank against other players
        </p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Players This Week
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((player) => (
              <div
                key={player.rank}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                  player.rank <= 3 
                    ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 border border-yellow-200 dark:border-yellow-700' 
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(player.rank)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{player.avatar}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {player.username}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Level {player.level}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {player.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    points
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};