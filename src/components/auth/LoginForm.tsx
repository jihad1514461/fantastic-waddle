import React, { useState } from 'react';
import { useAuthController } from '../../controllers/authController';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const { login, register, isLoading, error, clearError } = useAuthController();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (isRegister) {
      await register(email, password, name);
    } else {
      await login(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400">
            {isRegister ? 'Sign up to get started' : 'Sign in to your account'}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="Enter your full name"
                required
              />
            )}
            
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
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
              className="w-full"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};