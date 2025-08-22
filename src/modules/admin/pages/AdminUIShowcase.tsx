import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Pagination } from '../../../components/ui/Pagination';
import { Alert } from '../../../components/ui/Alert';
import { Dropdown } from '../../../components/ui/Dropdown';
import { Checkbox } from '../../../components/ui/Checkbox';
import { ToggleSwitch } from '../../../components/ui/ToggleSwitch';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Spinner } from '../../../components/ui/Spinner';
import { Textarea } from '../../../components/ui/Textarea';
import { DatePicker } from '../../../components/ui/DatePicker';
import { FileUpload } from '../../../components/ui/FileUpload';
import { TabbedModal } from '../../../components/ui/TabbedModal';
import { MultiSelect, MultiSelectOption } from '../../../components/ui/MultiSelect';
import { RadioGroup, RadioOption } from '../../../components/ui/RadioGroup';
import { Typeahead } from '../../../components/ui/Typeahead';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
import { useToast } from '../../../hooks/useToast';
import { TableColumn, TableData, DropdownItem } from '../../../types';
import { 
  Settings, Users, Database, FileText, Star, Heart, Bookmark, Edit, Trash2, 
  MoreVertical, Shield, Lock, Activity, AlertTriangle, UserPlus, Ban, 
  CheckCircle, XCircle, Eye, Download, Upload, Filter, Search, RefreshCw,
  Calendar, Clock, TrendingUp, BarChart3, PieChart, Mail, Bell, Key
} from 'lucide-react';

export const AdminUIShowcase: React.FC = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTabbedModal, setShowTabbedModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [multiSelectValues, setMultiSelectValues] = useState<string[]>([]);
  const [radioValue, setRadioValue] = useState('');
  const [typeaheadValue, setTypeaheadValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [progressValue, setProgressValue] = useState(75);
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showAlert, setShowAlert] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' });
  
  const toast = useToast();
  const itemsPerPage = 5;

  // Admin-specific sample data
  const adminUsers = [
    { id: 1, name: 'John Admin', email: 'john@admin.com', role: 'Super Admin', status: 'Active', lastLogin: '2024-01-15', permissions: 'All' },
    { id: 2, name: 'Jane Manager', email: 'jane@admin.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-14', permissions: 'Limited' },
    { id: 3, name: 'Bob Moderator', email: 'bob@admin.com', role: 'Moderator', status: 'Inactive', lastLogin: '2024-01-10', permissions: 'Basic' },
    { id: 4, name: 'Alice Support', email: 'alice@admin.com', role: 'Support', status: 'Active', lastLogin: '2024-01-12', permissions: 'Support' },
    { id: 5, name: 'Charlie Viewer', email: 'charlie@admin.com', role: 'Viewer', status: 'Suspended', lastLogin: '2024-01-08', permissions: 'Read Only' },
  ];

  const systemLogs = [
    { id: 1, timestamp: '2024-01-15 10:30:00', event: 'User Login', severity: 'info', user: 'john@admin.com', description: 'Successful admin login' },
    { id: 2, timestamp: '2024-01-15 10:25:00', event: 'Failed Login', severity: 'warning', user: 'unknown@test.com', description: 'Multiple failed login attempts' },
    { id: 3, timestamp: '2024-01-15 10:20:00', event: 'System Update', severity: 'info', user: 'system', description: 'Database maintenance completed' },
    { id: 4, timestamp: '2024-01-15 10:15:00', event: 'Security Alert', severity: 'high', user: 'system', description: 'Suspicious activity detected' },
  ];

  const adminTableColumns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'role', 
      label: 'Role',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Super Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          value === 'Admin' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
          value === 'Moderator' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
          value === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          value === 'Suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {value === 'Active' ? <CheckCircle size={12} /> : 
           value === 'Suspended' ? <XCircle size={12} /> : 
           <Clock size={12} />}
          <span>{value}</span>
        </span>
      )
    },
    { key: 'lastLogin', label: 'Last Login' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Dropdown
          trigger={<MoreVertical size={16} />}
          items={[
            { label: 'View Details', value: 'view', icon: <Eye size={14} />, onClick: () => toast.info(`View ${row.name}`) },
            { label: 'Edit User', value: 'edit', icon: <Edit size={14} />, onClick: () => toast.info(`Edit ${row.name}`) },
            { label: 'Reset Password', value: 'reset', icon: <Key size={14} />, onClick: () => toast.warning(`Reset password for ${row.name}`) },
            { label: 'Suspend User', value: 'suspend', icon: <Ban size={14} />, onClick: () => toast.error(`Suspend ${row.name}`) },
          ]}
        />
      )
    },
  ];

  const logTableColumns: TableColumn[] = [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'event', label: 'Event' },
    { 
      key: 'severity', 
      label: 'Severity',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          value === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        }`}>
          {value.toUpperCase()}
        </span>
      )
    },
    { key: 'user', label: 'User' },
    { key: 'description', label: 'Description' },
  ];

  // Filter and paginate data
  const filteredUsers = adminUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const roleOptions = [
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'Admin', value: 'admin' },
    { label: 'Moderator', value: 'moderator' },
    { label: 'Support', value: 'support' },
    { label: 'Viewer', value: 'viewer' },
  ];

  const permissionOptions: MultiSelectOption[] = [
    { label: 'User Management', value: 'user_management', description: 'Create, edit, and delete users' },
    { label: 'System Settings', value: 'system_settings', description: 'Modify system configuration' },
    { label: 'Analytics', value: 'analytics', description: 'View system analytics and reports' },
    { label: 'Security', value: 'security', description: 'Manage security settings and logs' },
    { label: 'Content Management', value: 'content_management', description: 'Manage application content' },
    { label: 'API Access', value: 'api_access', description: 'Access to API endpoints' },
  ];

  const departmentOptions: RadioOption[] = [
    { label: 'IT Department', value: 'it', description: 'Information Technology' },
    { label: 'HR Department', value: 'hr', description: 'Human Resources' },
    { label: 'Finance Department', value: 'finance', description: 'Financial Operations' },
    { label: 'Operations', value: 'operations', description: 'Business Operations' },
  ];

  const userSearchOptions = [
    { label: 'John Admin', value: 'john', description: 'Super Administrator', category: 'Admins' },
    { label: 'Jane Manager', value: 'jane', description: 'System Administrator', category: 'Admins' },
    { label: 'Bob Moderator', value: 'bob', description: 'Content Moderator', category: 'Moderators' },
    { label: 'Alice Support', value: 'alice', description: 'Support Specialist', category: 'Support' },
    { label: 'Charlie Viewer', value: 'charlie', description: 'Read-only Access', category: 'Viewers' },
  ];

  const adminDropdownItems: DropdownItem[] = [
    { label: 'System Settings', value: 'settings', icon: <Settings size={14} />, onClick: () => toast.info('System Settings') },
    { label: 'User Management', value: 'users', icon: <Users size={14} />, onClick: () => toast.info('User Management') },
    { label: 'Security Center', value: 'security', icon: <Shield size={14} />, onClick: () => toast.info('Security Center') },
    { label: 'System Logs', value: 'logs', icon: <FileText size={14} />, onClick: () => toast.warning('System Logs') },
    { label: 'Backup & Restore', value: 'backup', icon: <Database size={14} />, onClick: () => toast.info('Backup & Restore') },
  ];

  const adminModalTabs = [
    {
      id: 'user-info',
      label: 'User Information',
      icon: <Users size={16} />,
      content: (
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={userForm.name}
            onChange={(value) => setUserForm(prev => ({ ...prev, name: value }))}
            placeholder="Enter full name"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={userForm.email}
            onChange={(value) => setUserForm(prev => ({ ...prev, email: value }))}
            placeholder="Enter email address"
            required
          />
          <Select
            label="User Role"
            options={roleOptions}
            value={userForm.role}
            onChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}
          />
        </div>
      ),
    },
    {
      id: 'permissions',
      label: 'Permissions',
      icon: <Lock size={16} />,
      content: (
        <div className="space-y-4">
          <MultiSelect
            label="User Permissions"
            options={permissionOptions}
            values={multiSelectValues}
            onChange={setMultiSelectValues}
            placeholder="Select permissions"
            searchable
            maxSelections={6}
          />
          <RadioGroup
            label="Department"
            options={departmentOptions}
            value={radioValue}
            onChange={setRadioValue}
          />
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield size={16} />,
      content: (
        <div className="space-y-4">
          <ToggleSwitch
            label="Two-Factor Authentication"
            description="Require 2FA for this user"
            checked={toggleValue}
            onChange={setToggleValue}
          />
          <ToggleSwitch
            label="Email Notifications"
            description="Send security alerts via email"
            checked={checkboxValue}
            onChange={setCheckboxValue}
          />
          <DatePicker
            label="Account Expiry Date"
            selected={selectedDate}
            onChange={setSelectedDate}
            placeholder="Select expiry date"
          />
        </div>
      ),
    },
  ];

  const systemTabs = [
    {
      id: 'overview',
      label: 'System Overview',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900 dark:text-green-100">System Status</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">Online</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Active Users</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">1,247</p>
            </div>
          </div>
          <ProgressBar
            label="System Resources"
            value={progressValue}
            color="blue"
            animated
          />
        </div>
      ),
    },
    {
      id: 'logs',
      label: 'System Logs',
      content: (
        <div className="space-y-4">
          <Table
            columns={logTableColumns}
            data={systemLogs}
            striped
            hoverable
          />
        </div>
      ),
    },
  ];

  const simulateProgress = () => {
    setProgressValue(0);
    const interval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success('System maintenance completed!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin UI Showcase
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive demonstration of admin interface components and workflows
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowSystemModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600"
          >
            <Activity size={16} />
            <span>System Status</span>
          </Button>
        </div>
      </div>

      {/* Admin Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {showAlert && (
          <Alert
            type="warning"
            title="System Maintenance"
            message="Scheduled maintenance will begin at 2:00 AM UTC. Users may experience brief interruptions."
            dismissible
            onDismiss={() => setShowAlert(false)}
          />
        )}
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => toast.success('System backup completed successfully!')}>
            <CheckCircle size={14} className="mr-1" /> Success Alert
          </Button>
          <Button size="sm" onClick={() => toast.error('Failed to connect to external service')}>
            <XCircle size={14} className="mr-1" /> Error Alert
          </Button>
          <Button size="sm" onClick={() => toast.warning('High CPU usage detected')}>
            <AlertTriangle size={14} className="mr-1" /> Warning Alert
          </Button>
        </div>
      </div>

      {/* Admin Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2,847</p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">23</p>
                <p className="text-sm text-red-600 mt-1">+5 new today</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">99.9%</p>
                <p className="text-sm text-green-600 mt-1">Excellent</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,234</p>
                <p className="text-sm text-blue-600 mt-1">Real-time</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Management Dashboard
            </h3>
            <Button
              onClick={() => setShowUserModal(true)}
              className="flex items-center space-x-2"
            >
              <UserPlus size={16} />
              <span>Add User</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter size={16} />
              <span>Filter</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download size={16} />
              <span>Export</span>
            </Button>
          </div>
          
          <Table
            columns={adminTableColumns}
            data={paginatedUsers}
            striped
            hoverable
          />
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Admin Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Controls */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Settings size={20} />
              <span>System Controls</span>
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleSwitch
              label="Maintenance Mode"
              description="Enable system maintenance mode"
              checked={toggleValue}
              onChange={setToggleValue}
            />
            <ToggleSwitch
              label="User Registration"
              description="Allow new user registrations"
              checked={checkboxValue}
              onChange={setCheckboxValue}
            />
            <ProgressBar
              label="System Maintenance Progress"
              value={progressValue}
              color="red"
              animated
            />
            <Button onClick={simulateProgress} size="sm" className="w-full">
              <RefreshCw size={14} className="mr-2" />
              Run Maintenance
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Activity size={20} />
              <span>Quick Actions</span>
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dropdown
              trigger={<span>Admin Tools</span>}
              items={adminDropdownItems}
            />
            <Button variant="outline" className="w-full justify-start">
              <Mail size={16} className="mr-2" />
              Send System Notification
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell size={16} className="mr-2" />
              Broadcast Alert
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Database size={16} className="mr-2" />
              Database Backup
            </Button>
          </CardContent>
        </Card>

        {/* Advanced Search */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Search size={20} />
              <span>Advanced Search</span>
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typeahead
              label="Search Users"
              options={userSearchOptions}
              value={typeaheadValue}
              onChange={setTypeaheadValue}
              placeholder="Type to search users..."
              groupByCategory
              allowClear
            />
            <MultiSelect
              label="Filter by Permissions"
              options={permissionOptions.slice(0, 4)}
              values={multiSelectValues}
              onChange={setMultiSelectValues}
              placeholder="Select permissions"
              maxSelections={3}
            />
            <DatePicker
              label="Last Login After"
              selected={selectedDate}
              onChange={setSelectedDate}
              placeholder="Select date"
            />
          </CardContent>
        </Card>
      </div>

      {/* File Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Upload size={20} />
              <span>System File Upload</span>
            </h3>
          </CardHeader>
          <CardContent>
            <FileUpload
              accept=".csv,.xlsx,.json,.xml"
              multiple
              maxSize={50}
              onFilesChange={setUploadedFiles}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <FileText size={20} />
              <span>System Notes</span>
            </h3>
          </CardHeader>
          <CardContent>
            <Textarea
              label="Admin Notes"
              placeholder="Enter system maintenance notes, user feedback, or important reminders..."
              value={textareaValue}
              onChange={setTextareaValue}
              rows={6}
              maxLength={1000}
            />
          </CardContent>
        </Card>
      </div>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading States & Spinners
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <Spinner size="sm" color="blue" />
              <p className="text-sm text-gray-500 mt-2">Small</p>
            </div>
            <div className="text-center">
              <Spinner size="md" color="red" />
              <p className="text-sm text-gray-500 mt-2">Medium</p>
            </div>
            <div className="text-center">
              <Spinner size="lg" color="green" />
              <p className="text-sm text-gray-500 mt-2">Large</p>
            </div>
            <div className="text-center">
              <Spinner size="xl" color="purple" />
              <p className="text-sm text-gray-500 mt-2">Extra Large</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <div className="flex space-x-4">
        <Button onClick={() => setShowTabbedModal(true)}>
          Open User Management Modal
        </Button>
        <Button variant="outline" onClick={() => setShowSystemModal(true)}>
          Open System Dashboard
        </Button>
      </div>

      {/* User Management Modal */}
      <TabbedModal
        isOpen={showTabbedModal}
        onClose={() => setShowTabbedModal(false)}
        title="User Management"
        tabs={adminModalTabs}
        size="xl"
      />

      {/* System Dashboard Modal */}
      <Modal
        isOpen={showSystemModal}
        onClose={() => setShowSystemModal(false)}
        title="System Dashboard"
        size="xl"
      >
        <Tabs
          tabs={systemTabs}
          variant="underline"
        />
      </Modal>
    </div>
  );
};