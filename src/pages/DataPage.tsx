import React, { useState, useEffect } from 'react';
import { useDataController } from '../controllers/dataController';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const DataPage: React.FC = () => {
  const { users, projects, fetchData, createData, deleteData } = useDataController();
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchData('/users', 'users');
    fetchData('/projects', 'projects');
  }, [fetchData]);

  const handleCreateUser = async () => {
    if (userForm.name && userForm.email) {
      await createData('/users', {
        ...userForm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }, 'users');
      
      setUserForm({ name: '', email: '' });
      setShowUserModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Data Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your application data with full CRUD operations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Users ({users.data.length})
              </h3>
              <Button
                size="sm"
                onClick={() => setShowUserModal(true)}
                className="flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Add User</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {users.loading.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : users.data.length > 0 ? (
              <div className="space-y-3">
                {users.data.slice(0, 5).map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <Edit size={14} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteData('/users', user.id, 'users')}
                        className="text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No users found
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Projects ({projects.data.length})
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Project management coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Add New User"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={userForm.name}
            onChange={(value) => setUserForm(prev => ({ ...prev, name: value }))}
            placeholder="Enter full name"
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={userForm.email}
            onChange={(value) => setUserForm(prev => ({ ...prev, email: value }))}
            placeholder="Enter email address"
            required
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowUserModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>
              Create User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};