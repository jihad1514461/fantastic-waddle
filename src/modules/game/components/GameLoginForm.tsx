import React, { useState } from 'react';
import { useGameAuthController } from '../controllers/gameAuthController';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Gamepad2 } from 'lucide-react';
import { GAME_CONFIG } from '../config/game.config';

interface GameLoginFormProps {
  onBack: () => void;
}

export const GameLoginForm: React.FC<GameLoginFormProps> = ({ onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useGameAuthController();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 dark:from-purple-900 dark:via-blue-900 dark:to-purple-800 px-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${GAME_CONFIG.module.gradient} flex items-center justify-center shadow-lg`}>
            <Gamepad2 size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {GAME_CONFIG.branding.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {GAME_CONFIG.branding.subtitle}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="Enter your username"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              required
            />

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={isLoading}
              className={`w-full bg-gradient-to-r ${GAME_CONFIG.module.gradient} hover:opacity-90`}
            >
              Enter Game Hub
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};