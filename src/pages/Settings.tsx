import React from 'react';
import { useThemeController } from '../controllers/themeController';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useThemeController();

  const themeOptions = [
    { label: 'Light Mode', value: 'light' },
    { label: 'Dark Mode', value: 'dark' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure your application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Appearance
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Theme"
              options={themeOptions}
              value={theme.mode}
              onChange={(value) => setTheme(value as 'light' | 'dark')}
            />
            
            <div className="pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose between light and dark modes. Your preference will be saved automatically.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Browser notifications</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};