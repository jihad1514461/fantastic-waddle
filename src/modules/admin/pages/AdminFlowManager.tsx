import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import { Alert } from '../../../components/ui/Alert';
import { Table } from '../../../components/ui/Table';
import { FlowEditor } from '../components/FlowEditor';
import { NodeEditModal } from '../components/NodeEditModal';
import { FlowSimulation } from '../components/FlowSimulation';
import { useAdminFlowController } from '../controllers/adminFlowController';
import { useToast } from '../../../hooks/useToast';
import { StoryNode, Story } from '../types/flow.types';
import { TableColumn } from '../../../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Eye, 
  BookOpen, 
  GitBranch, 
  Save,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Settings,
  Zap
} from 'lucide-react';

const AdminFlowManager: React.FC = () => {
  const {
    stories,
    currentStory,
    selectedNode,
    setCurrentStory,
    createStory,
    updateStory,
    deleteStory,
    addNode,
    selectNode,
    loadStories,
    validateNode,
  } = useAdminFlowController();

  const toast = useToast();

  // Modal states
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [showEditStoryModal, setShowEditStoryModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showNodeEditModal, setShowNodeEditModal] = useState(false);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);

  // Form states
  const [newStoryForm, setNewStoryForm] = useState({
    name: '',
    description: '',
  });

  const [editStoryForm, setEditStoryForm] = useState({
    name: '',
    description: '',
  });

  // View state
  const [activeView, setActiveView] = useState<'list' | 'editor' | 'simulation'>('list');

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  useEffect(() => {
    if (currentStory) {
      setActiveView('editor');
      setEditStoryForm({
        name: currentStory.name,
        description: currentStory.description,
      });
    } else {
      setActiveView('list');
    }
  }, [currentStory]);

  const handleCreateStory = () => {
    if (newStoryForm.name.trim() && newStoryForm.description.trim()) {
      const story = createStory(newStoryForm.name.trim(), newStoryForm.description.trim());
      setNewStoryForm({ name: '', description: '' });
      setShowCreateStoryModal(false);
      toast.success(`Story "${story.name}" created successfully!`);
    }
  };

  const handleEditStory = () => {
    if (currentStory && editStoryForm.name.trim() && editStoryForm.description.trim()) {
      updateStory(currentStory.id, {
        name: editStoryForm.name.trim(),
        description: editStoryForm.description.trim(),
      });
      setShowEditStoryModal(false);
      toast.success('Story updated successfully!');
    }
  };

  const handleDeleteStory = (story: Story) => {
    setStoryToDelete(story);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteStory = () => {
    if (storyToDelete) {
      deleteStory(storyToDelete.id);
      setStoryToDelete(null);
      setShowDeleteConfirmModal(false);
      toast.success(`Story "${storyToDelete.name}" deleted successfully!`);
    }
  };

  const handleSelectStory = (story: Story) => {
    setCurrentStory(story);
  };

  const handleNodeClick = (node: StoryNode) => {
    selectNode(node);
    setShowNodeEditModal(true);
  };

  const handleAddNode = (type: StoryNode['type']) => {
    if (currentStory) {
      const position = {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      };
      addNode(type, position);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} node added!`);
    }
  };

  const getStoryStats = (story: Story) => {
    const nodeCount = story.nodes.length;
    const connectionCount = story.nodes.reduce((total, node) => total + node.connections.length, 0);
    const endNodes = story.nodes.filter(node => node.type === 'end').length;
    
    return { nodeCount, connectionCount, endNodes };
  };

  const getStoryValidation = (story: Story) => {
    const issues: string[] = [];
    let hasIntro = false;
    let hasEnd = false;

    story.nodes.forEach(node => {
      if (node.type === 'intro') hasIntro = true;
      if (node.type === 'end') hasEnd = true;
      
      const validation = validateNode(node.id);
      issues.push(...validation.issues);
    });

    if (!hasIntro) issues.push('Story needs at least one intro node');
    if (!hasEnd) issues.push('Story needs at least one end node');

    return { isValid: issues.length === 0, issues };
  };

  const storyTableColumns: TableColumn[] = [
    {
      key: 'name',
      label: 'Story Name',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getStoryStats(row as Story).nodeCount} nodes, {getStoryStats(row as Story).connectionCount} connections
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
          {value}
        </p>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => (
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value, row) => {
        const validation = getStoryValidation(row as Story);
        return (
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              value 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {value ? 'Active' : 'Draft'}
            </span>
            {!validation.isValid && (
              <AlertCircle className="w-4 h-4 text-yellow-500" title={`${validation.issues.length} issues`} />
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleSelectStory(row as Story)}
            className="text-blue-600 hover:text-blue-700"
            title="Edit Story"
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setCurrentStory(row as Story);
              setShowSimulationModal(true);
            }}
            className="text-green-600 hover:text-green-700"
            title="Test Story"
          >
            <Play size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteStory(row as Story)}
            className="text-red-600 hover:text-red-700"
            title="Delete Story"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const renderStoryList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Story Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage interactive stories with multiple branches and endings
          </p>
        </div>
        <Button
          onClick={() => setShowCreateStoryModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Create New Story</span>
        </Button>
      </div>

      {stories.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Stories Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first interactive story to get started with Story Forge
            </p>
            <Button
              onClick={() => setShowCreateStoryModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Create Your First Story</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Stories ({stories.length})
              </h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <FileText size={14} className="mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table
              columns={storyTableColumns}
              data={stories}
              hoverable
            />
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStoryEditor = () => {
    if (!currentStory) return null;

    const stats = getStoryStats(currentStory);
    const validation = getStoryValidation(currentStory);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentStory(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Stories
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentStory.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentStory.description}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowEditStoryModal(true)}
              className="flex items-center space-x-2"
            >
              <Settings size={16} />
              <span>Story Settings</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSimulationModal(true)}
              className="flex items-center space-x-2"
            >
              <Play size={16} />
              <span>Test Story</span>
            </Button>
          </div>
        </div>

        {/* Story Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nodes</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.nodeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connections</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.connectionCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Endings</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.endNodes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  validation.isValid 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  <AlertCircle className={`w-5 h-5 ${
                    validation.isValid ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className={`text-xl font-bold ${
                    validation.isValid 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {validation.isValid ? 'Valid' : `${validation.issues.length} Issues`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation Issues */}
        {!validation.isValid && (
          <Alert
            type="warning"
            title="Story Validation Issues"
            message={`Your story has ${validation.issues.length} issue(s) that need to be resolved: ${validation.issues.slice(0, 3).join(', ')}${validation.issues.length > 3 ? '...' : ''}`}
          />
        )}

        {/* Node Creation Toolbar */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add New Node
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <Button
                onClick={() => handleAddNode('intro')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Intro Node</span>
              </Button>
              <Button
                onClick={() => handleAddNode('script')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Script Node</span>
              </Button>
              <Button
                onClick={() => handleAddNode('end')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>End Node</span>
              </Button>
              <Button
                onClick={() => handleAddNode('custom')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Custom Node</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Flow Editor */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Story Flow Editor
            </h3>
          </CardHeader>
          <CardContent>
            <div className="h-96 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <FlowEditor onNodeClick={handleNodeClick} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {activeView === 'list' && renderStoryList()}
      {activeView === 'editor' && renderStoryEditor()}

      {/* Create Story Modal */}
      <Modal
        isOpen={showCreateStoryModal}
        onClose={() => {
          setShowCreateStoryModal(false);
          setNewStoryForm({ name: '', description: '' });
        }}
        title="Create New Story"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Story Name"
            value={newStoryForm.name}
            onChange={(value) => setNewStoryForm(prev => ({ ...prev, name: value }))}
            placeholder="Enter an engaging story title"
            required
          />
          
          <Textarea
            label="Story Description"
            value={newStoryForm.description}
            onChange={(value) => setNewStoryForm(prev => ({ ...prev, description: value }))}
            placeholder="Describe what your story is about, its theme, and what players can expect"
            rows={4}
            required
          />
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateStoryModal(false);
                setNewStoryForm({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateStory}
              disabled={!newStoryForm.name.trim() || !newStoryForm.description.trim()}
            >
              Create Story
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Story Modal */}
      <Modal
        isOpen={showEditStoryModal}
        onClose={() => setShowEditStoryModal(false)}
        title="Edit Story Settings"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Story Name"
            value={editStoryForm.name}
            onChange={(value) => setEditStoryForm(prev => ({ ...prev, name: value }))}
            placeholder="Enter story title"
            required
          />
          
          <Textarea
            label="Story Description"
            value={editStoryForm.description}
            onChange={(value) => setEditStoryForm(prev => ({ ...prev, description: value }))}
            placeholder="Describe your story"
            rows={4}
            required
          />
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setShowEditStoryModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditStory}
              disabled={!editStoryForm.name.trim() || !editStoryForm.description.trim()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setStoryToDelete(null);
        }}
        title="Delete Story"
        size="sm"
      >
        <div className="space-y-4">
          <Alert
            type="warning"
            message={`Are you sure you want to delete "${storyToDelete?.name}"? This action cannot be undone and will permanently remove the story and all its nodes.`}
          />
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setStoryToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteStory}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Story
            </Button>
          </div>
        </div>
      </Modal>

      {/* Node Edit Modal */}
      <NodeEditModal
        isOpen={showNodeEditModal}
        onClose={() => {
          setShowNodeEditModal(false);
          selectNode(null);
        }}
        node={selectedNode}
      />

      {/* Simulation Modal */}
      <Modal
        isOpen={showSimulationModal}
        onClose={() => setShowSimulationModal(false)}
        title={`Test Story: ${currentStory?.name || 'Unknown'}`}
        size="xl"
      >
        <FlowSimulation />
      </Modal>
    </div>
  );
};

export default AdminFlowManager;