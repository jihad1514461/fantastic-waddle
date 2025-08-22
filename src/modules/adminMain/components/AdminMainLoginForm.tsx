import React, { useState } from 'react';
import { useAdminAuthController } from '../controllers/adminMainAuthController';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Shield } from 'lucide-react';
import { ADMIN_CONFIG } from '../config/adminMain.config';

interface AdminLoginFormProps {
  onBack: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onBack }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAdminAuthController();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(userName, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-blue-900 dark:via-purple-900 dark:to-blue-800 px-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${ADMIN_CONFIG.module.gradient} flex items-center justify-center shadow-lg`}>
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {ADMIN_CONFIG.branding.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {ADMIN_CONFIG.branding.subtitle}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin UserName"
              type="text"
              value={userName}
              onChange={setUserName}
              placeholder="Enter your admin userName"
              
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              
            />

            {error && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={isLoading}
              className={`w-full bg-gradient-to-r ${ADMIN_CONFIG.module.gradient} hover:opacity-90`}
            >
              Sign In to Admin Portal
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};