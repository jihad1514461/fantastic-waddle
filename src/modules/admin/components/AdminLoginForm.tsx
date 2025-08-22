import React, { useState } from 'react';
import { useAdminAuthController } from '../controllers/adminAuthController';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Shield } from 'lucide-react';
import { ADMIN_CONFIG } from '../config/admin.config';

interface AdminLoginFormProps {
  onBack: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAdminAuthController();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-red-100 dark:from-red-900 dark:via-orange-900 dark:to-red-800 px-4">
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
              label="Admin Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your admin email"
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
              className={`w-full bg-gradient-to-r ${ADMIN_CONFIG.module.gradient} hover:opacity-90`}
            >
              Sign In to Admin Portal
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};