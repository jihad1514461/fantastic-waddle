import React from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { TableColumn } from '../../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive', lastLogin: '2024-01-10' },
  ];

  const columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'lastLogin', label: 'Last Login' },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost">
            <Edit size={14} />
          </Button>
          <Button size="sm" variant="ghost" className="text-red-600">
            <Trash2 size={14} />
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage system users and their permissions
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add User</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Users
          </h3>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            data={users}
            striped
            hoverable
          />
        </CardContent>
      </Card>
    </div>
  );
};