import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { Alert } from '../components/ui/Alert';
import { Dropdown } from '../components/ui/Dropdown';
import { Checkbox } from '../components/ui/Checkbox';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { Textarea } from '../components/ui/Textarea';
import { DatePicker } from '../components/ui/DatePicker';
import { FileUpload } from '../components/ui/FileUpload';
import { TabbedModal } from '../components/ui/TabbedModal';
import { MultiSelect, MultiSelectOption } from '../components/ui/MultiSelect';
import { RadioGroup, RadioOption } from '../components/ui/RadioGroup';
import { Typeahead } from '../components/ui/Typeahead';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';
import { FlowEditor } from '../components/flow/FlowEditor';
import { useToast } from '../hooks/useToast';
import { useFlowController } from '../controllers/flowController';
import { TableColumn, TableData, DropdownItem } from '../types';
import { 
  Settings, Users, Database, FileText, Star, Heart, Bookmark, Edit, Trash2, 
  MoreVertical, Plus, Save, RefreshCw, Download, Upload, Filter, Search,
  Calendar, Clock, TrendingUp, BarChart3, PieChart, Mail, Bell, Eye,
  CheckCircle, XCircle, AlertTriangle, Info, GitBranch, Palette
} from 'lucide-react';

export const ComponentShowcase: React.FC = () => {
  // Modal states
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showTabbedModal, setShowTabbedModal] = useState(false);
  const [showFlowModal, setShowFlowModal] = useState(false);
  
  // Form states
  const [multiSelectValues, setMultiSelectValues] = useState<string[]>([]);
  const [radioValue, setRadioValue] = useState('');
  const [typeaheadValue, setTypeaheadValue] = useState('');
  const [typeaheadLoading, setTypeaheadLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [progressValue, setProgressValue] = useState(65);
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showAlert, setShowAlert] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  
  const toast = useToast();
  const { addNode, clearFlow } = useFlowController();
  const itemsPerPage = 5;

  // Sample data for components
  const sampleUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2023-01-15', department: 'IT' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2023-02-20', department: 'Marketing' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor', status: 'Inactive', joinDate: '2023-03-10', department: 'Content' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'User', status: 'Active', joinDate: '2023-04-05', department: 'Sales' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'Admin', status: 'Active', joinDate: '2023-05-12', department: 'IT' },
    { id: 6, name: 'Lisa Davis', email: 'lisa@example.com', role: 'Editor', status: 'Active', joinDate: '2023-06-18', department: 'Content' },
    { id: 7, name: 'Alex Chen', email: 'alex@example.com', role: 'User', status: 'Inactive', joinDate: '2023-07-22', department: 'Design' },
    { id: 8, name: 'Emma Wilson', email: 'emma@example.com', role: 'Admin', status: 'Active', joinDate: '2023-08-30', department: 'HR' },
    { id: 9, name: 'David Lee', email: 'david@example.com', role: 'User', status: 'Active', joinDate: '2023-09-15', department: 'Finance' },
    { id: 10, name: 'Maria Garcia', email: 'maria@example.com', role: 'Editor', status: 'Active', joinDate: '2023-10-01', department: 'Marketing' },
  ];

  const tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
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
    { key: 'joinDate', label: 'Join Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Dropdown
          trigger={<MoreVertical size={16} />}
          items={[
            { label: 'View', value: 'view', icon: <Eye size={14} />, onClick: () => toast.info(`View ${row.name}`) },
            { label: 'Edit', value: 'edit', icon: <Edit size={14} />, onClick: () => toast.info(`Edit ${row.name}`) },
            { label: 'Delete', value: 'delete', icon: <Trash2 size={14} />, onClick: () => toast.error(`Delete ${row.name}`) },
          ]}
        />
      )
    },
  ];

  // Filter and paginate data
  const filteredData = sampleUsers.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Component options
  const multiSelectOptions: MultiSelectOption[] = [
    { label: 'React', value: 'react', description: 'JavaScript library for building user interfaces' },
    { label: 'TypeScript', value: 'typescript', description: 'Typed superset of JavaScript' },
    { label: 'Tailwind CSS', value: 'tailwind', description: 'Utility-first CSS framework' },
    { label: 'Node.js', value: 'nodejs', description: 'JavaScript runtime built on Chrome\'s V8 engine' },
    { label: 'Python', value: 'python', description: 'High-level programming language' },
    { label: 'Vue.js', value: 'vue', description: 'Progressive JavaScript framework' },
    { label: 'Angular', value: 'angular', description: 'Platform for building mobile and desktop web applications' },
    { label: 'Svelte', value: 'svelte', description: 'Cybernetically enhanced web apps' },
  ];

  const radioOptions: RadioOption[] = [
    { label: 'Small', value: 'small', description: 'Compact size option' },
    { label: 'Medium', value: 'medium', description: 'Standard size option' },
    { label: 'Large', value: 'large', description: 'Expanded size option' },
    { label: 'Extra Large', value: 'xl', description: 'Maximum size option' },
  ];

  const typeaheadOptions = [
    { label: 'John Doe', value: 'john', description: 'Software Engineer', category: 'Engineering' },
    { label: 'Jane Smith', value: 'jane', description: 'Product Manager', category: 'Product' },
    { label: 'Mike Johnson', value: 'mike', description: 'UX Designer', category: 'Design' },
    { label: 'Sarah Wilson', value: 'sarah', description: 'Frontend Developer', category: 'Engineering' },
    { label: 'Tom Brown', value: 'tom', description: 'Marketing Manager', category: 'Marketing' },
    { label: 'Lisa Davis', value: 'lisa', description: 'UI Designer', category: 'Design' },
    { label: 'Alex Chen', value: 'alex', description: 'Backend Developer', category: 'Engineering' },
    { label: 'Emma Wilson', value: 'emma', description: 'Data Analyst', category: 'Analytics' },
  ];

  const selectOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' },
  ];

  const dropdownItems: DropdownItem[] = [
    { label: 'Profile', value: 'profile', icon: <Users size={14} />, onClick: () => toast.info('Profile clicked') },
    { label: 'Settings', value: 'settings', icon: <Settings size={14} />, onClick: () => toast.info('Settings clicked') },
    { label: 'Help', value: 'help', icon: <Info size={14} />, onClick: () => toast.info('Help clicked') },
    { label: 'Logout', value: 'logout', icon: <Database size={14} />, onClick: () => toast.warning('Logout clicked') },
  ];

  // Modal tabs
  const modalTabs = [
    {
      id: 'general',
      label: 'General',
      icon: <Settings size={16} />,
      content: (
        <div className="space-y-4">
          <Input
            label="Project Name"
            value={inputValue}
            onChange={setInputValue}
            placeholder="Enter project name"
          />
          <Textarea
            label="Description"
            value={textareaValue}
            onChange={setTextareaValue}
            placeholder="Enter project description"
            rows={3}
          />
          <Select
            label="Category"
            options={selectOptions}
            value={selectValue}
            onChange={setSelectValue}
            placeholder="Select category"
          />
        </div>
      ),
    },
    {
      id: 'team',
      label: 'Team',
      icon: <Users size={16} />,
      content: (
        <div className="space-y-4">
          <MultiSelect
            label="Team Members"
            options={multiSelectOptions.slice(0, 4)}
            values={multiSelectValues}
            onChange={setMultiSelectValues}
            placeholder="Select team members"
            searchable
            maxSelections={3}
          />
          <RadioGroup
            label="Team Size"
            options={radioOptions}
            value={radioValue}
            onChange={setRadioValue}
          />
          <Typeahead
            label="Project Lead"
            options={typeaheadOptions}
            value={typeaheadValue}
            onChange={setTypeaheadValue}
            placeholder="Search for team lead"
            groupByCategory
          />
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Database size={16} />,
      content: (
        <div className="space-y-4">
          <ToggleSwitch
            label="Enable Notifications"
            description="Receive email notifications for updates"
            checked={toggleValue}
            onChange={setToggleValue}
          />
          <Checkbox
            label="I agree to the terms and conditions"
            description="Please read our terms of service"
            checked={checkboxValue}
            onChange={setCheckboxValue}
          />
          <DatePicker
            label="Project Deadline"
            selected={selectedDate}
            onChange={setSelectedDate}
            placeholder="Select deadline"
          />
        </div>
      ),
    },
  ];

  // Event handlers
  const handleTypeaheadSearch = (query: string) => {
    if (query.length > 0) {
      setTypeaheadLoading(true);
      setTimeout(() => {
        setTypeaheadLoading(false);
      }, 500);
    }
  };

  const simulateProgress = () => {
    setProgressValue(0);
    const interval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success('Progress completed!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAddFlowNode = () => {
    addNode({
      data: { label: `Node ${Date.now()}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    });
    toast.success('Node added to flow!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          UI Component Showcase
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          A comprehensive collection of reusable UI components with interactive examples and code patterns
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={() => toast.success('Success notification!')}>
          <CheckCircle size={16} className="mr-2" />
          Success Toast
        </Button>
        <Button onClick={() => toast.error('Error notification!')}>
          <XCircle size={16} className="mr-2" />
          Error Toast
        </Button>
        <Button onClick={() => toast.warning('Warning notification!')}>
          <AlertTriangle size={16} className="mr-2" />
          Warning Toast
        </Button>
        <Button onClick={() => toast.info('Info notification!')}>
          <Info size={16} className="mr-2" />
          Info Toast
        </Button>
      </div>

      {/* Alerts Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Alerts & Notifications</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {showAlert && (
            <Alert
              type="info"
              title="Information"
              message="This is an informational alert that can be dismissed."
              dismissible
              onDismiss={() => setShowAlert(false)}
            />
          )}
          <Alert
            type="warning"
            title="Warning"
            message="This is a warning alert with important information."
          />
        </div>
      </section>

      {/* Data Table with Search and Pagination */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Table with Search & Pagination</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Management ({filteredData.length} users)
              </h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Filter size={14} className="mr-1" />
                  Filter
                </Button>
                <Button size="sm" variant="outline">
                  <Download size={14} className="mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search users by name, email, role, or department..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
              <Button variant="outline">
                <Search size={16} />
              </Button>
            </div>
            
            <Table
              columns={tableColumns}
              data={paginatedData}
              striped
              hoverable
            />
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showFirstLast
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* React Flow Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">React Flow Editor</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <GitBranch size={20} />
                <span>Interactive Flow Diagram</span>
              </h3>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAddFlowNode}>
                  <Plus size={14} className="mr-1" />
                  Add Node
                </Button>
                <Button size="sm" variant="outline" onClick={clearFlow}>
                  <Trash2 size={14} className="mr-1" />
                  Clear
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowFlowModal(true)}>
                  <Eye size={14} className="mr-1" />
                  Full Screen
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <FlowEditor />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Form Components Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Form Components</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Basic Inputs */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Inputs</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Text Input"
                value={inputValue}
                onChange={setInputValue}
                placeholder="Enter text here"
              />
              <Select
                label="Select Dropdown"
                options={selectOptions}
                value={selectValue}
                onChange={setSelectValue}
                placeholder="Choose an option"
              />
              <Textarea
                label="Textarea"
                value={textareaValue}
                onChange={setTextareaValue}
                placeholder="Enter multiple lines of text..."
                rows={3}
                maxLength={200}
              />
            </CardContent>
          </Card>

          {/* Advanced Inputs */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Inputs</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <DatePicker
                label="Date Picker"
                selected={selectedDate}
                onChange={setSelectedDate}
                placeholder="Select a date"
              />
              <Typeahead
                label="Typeahead Search"
                options={typeaheadOptions}
                value={typeaheadValue}
                onChange={setTypeaheadValue}
                placeholder="Search users..."
                onSearch={handleTypeaheadSearch}
                loading={typeaheadLoading}
                groupByCategory
                allowClear
              />
              <MultiSelect
                label="Multi Select"
                options={multiSelectOptions.slice(0, 5)}
                values={multiSelectValues}
                onChange={setMultiSelectValues}
                placeholder="Select multiple options"
                searchable
                maxSelections={3}
              />
            </CardContent>
          </Card>

          {/* Toggles and Checkboxes */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Toggles & Checkboxes</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Checkbox
                label="Checkbox Input"
                description="Check this box to enable the feature"
                checked={checkboxValue}
                onChange={setCheckboxValue}
              />
              <ToggleSwitch
                label="Toggle Switch"
                description="Enable or disable this setting"
                checked={toggleValue}
                onChange={setToggleValue}
              />
              <RadioGroup
                label="Radio Group"
                options={radioOptions}
                value={radioValue}
                onChange={setRadioValue}
              />
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Progress and Loading */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Progress & Loading States</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress Bars</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar
                label="Upload Progress"
                value={progressValue}
                color="blue"
                animated
              />
              <ProgressBar
                label="Processing"
                value={75}
                color="green"
              />
              <ProgressBar
                label="Warning Level"
                value={85}
                color="yellow"
              />
              <Button onClick={simulateProgress} size="sm">
                <RefreshCw size={14} className="mr-2" />
                Simulate Progress
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loading Spinners</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <Spinner size="sm" color="blue" />
                  <p className="text-sm text-gray-500 mt-2">Small</p>
                </div>
                <div className="text-center">
                  <Spinner size="md" color="green" />
                  <p className="text-sm text-gray-500 mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <Spinner size="lg" color="purple" />
                  <p className="text-sm text-gray-500 mt-2">Large</p>
                </div>
                <div className="text-center">
                  <Spinner size="xl" color="red" />
                  <p className="text-sm text-gray-500 mt-2">Extra Large</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* File Upload */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">File Upload</h2>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              File Upload Component
            </h3>
          </CardHeader>
          <CardContent>
            <FileUpload
              accept="image/*,.pdf,.doc,.docx,.txt"
              multiple
              maxSize={10}
              onFilesChange={setUploadedFiles}
            />
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {uploadedFiles.length} file(s) selected
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Dropdown and Actions */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dropdowns & Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dropdown Menu</h3>
            </CardHeader>
            <CardContent>
              <Dropdown
                trigger={<span>User Actions</span>}
                items={dropdownItems}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Button Variants</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Primary Button</Button>
              <Button variant="secondary" className="w-full">Secondary Button</Button>
              <Button variant="outline" className="w-full">Outline Button</Button>
              <Button variant="ghost" className="w-full">Ghost Button</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Button Sizes</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full">Small Button</Button>
              <Button size="md" className="w-full">Medium Button</Button>
              <Button size="lg" className="w-full">Large Button</Button>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Modals Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Modals & Dialogs</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setShowBasicModal(true)}>
            <Eye size={16} className="mr-2" />
            Basic Modal
          </Button>
          <Button onClick={() => setShowTabbedModal(true)}>
            <Palette size={16} className="mr-2" />
            Tabbed Modal
          </Button>
          <Button onClick={() => setShowFlowModal(true)}>
            <GitBranch size={16} className="mr-2" />
            Flow Editor Modal
          </Button>
        </div>
      </section>

      {/* Tabs Example */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tabs Component</h2>
        <Card>
          <CardContent className="p-6">
            <Tabs
              tabs={[
                {
                  id: 'overview',
                  label: 'Overview',
                  icon: <BarChart3 size={16} />,
                  content: (
                    <div className="py-4">
                      <h3 className="text-lg font-semibold mb-2">Overview Content</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This is the overview tab content. You can put any components or content here.
                      </p>
                    </div>
                  ),
                },
                {
                  id: 'analytics',
                  label: 'Analytics',
                  icon: <PieChart size={16} />,
                  content: (
                    <div className="py-4">
                      <h3 className="text-lg font-semibold mb-2">Analytics Content</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Analytics and reporting information would be displayed here.
                      </p>
                    </div>
                  ),
                },
                {
                  id: 'settings',
                  label: 'Settings',
                  icon: <Settings size={16} />,
                  content: (
                    <div className="py-4">
                      <h3 className="text-lg font-semibold mb-2">Settings Content</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Configuration and settings options would be available here.
                      </p>
                    </div>
                  ),
                },
              ]}
              variant="underline"
            />
          </CardContent>
        </Card>
      </section>

      {/* Modals */}
      <Modal
        isOpen={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        title="Basic Modal Example"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This is a basic modal dialog. You can put any content here including forms, 
            images, or other components.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowBasicModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowBasicModal(false);
              toast.success('Action completed!');
            }}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <TabbedModal
        isOpen={showTabbedModal}
        onClose={() => setShowTabbedModal(false)}
        title="Project Configuration"
        tabs={modalTabs}
        size="xl"
      />

      <Modal
        isOpen={showFlowModal}
        onClose={() => setShowFlowModal(false)}
        title="Flow Editor - Full Screen"
        size="xl"
      >
        <div className="h-96">
          <FlowEditor />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleAddFlowNode}>
              <Plus size={14} className="mr-1" />
              Add Node
            </Button>
            <Button size="sm" variant="outline" onClick={clearFlow}>
              <Trash2 size={14} className="mr-1" />
              Clear Flow
            </Button>
          </div>
          <Button variant="outline" onClick={() => setShowFlowModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};