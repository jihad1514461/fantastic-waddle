import React, { useState, useEffect } from 'react';
import { TabbedModal } from '../../../components/ui/TabbedModal';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Typeahead } from '../../../components/ui/Typeahead';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { Table } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { useAdminFlowController } from '../controllers/adminFlowController';
import { StoryNode, StoryConnection } from '../types/flow.types';
import { TableColumn } from '../../../types';
import { Info, Link, Plus, Trash2, Save, AlertCircle, Edit, Eye, Image } from 'lucide-react';

interface NodeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: StoryNode | null;
}

export const NodeEditModal: React.FC<NodeEditModalProps> = ({ isOpen, onClose, node }) => {
  const { currentStory, updateNode, addConnection, removeConnection, updateConnection, deleteNode } = useAdminFlowController();
  
  const [nodeData, setNodeData] = useState({
    name: '',
    description: '',
    image: '',
    type: 'script' as StoryNode['type'],
  });

  const [connections, setConnections] = useState<StoryConnection[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddConnectionModal, setShowAddConnectionModal] = useState(false);
  const [showEditConnectionModal, setShowEditConnectionModal] = useState(false);
  const [editingConnection, setEditingConnection] = useState<StoryConnection | null>(null);
  
  const [newConnection, setNewConnection] = useState({
    targetNodeId: '',
    label: '',
    condition: '',
  });

  useEffect(() => {
    if (node) {
      setNodeData({
        name: node.data.name || '',
        description: node.data.description || '',
        image: node.data.image || '',
        type: node.type,
      });
      setConnections([...node.connections]);
      setNewConnection({
        targetNodeId: '',
        label: '',
        condition: '',
      });
    }
  }, [node]);

  const handleSaveBasicInfo = () => {
    if (node) {
      updateNode(node.id, {
        type: nodeData.type,
        data: {
          ...node.data,
          name: nodeData.name,
          description: nodeData.description,
          image: nodeData.image,
        },
      });
      // Show success feedback
      const nodeTypeName = nodeData.type.charAt(0).toUpperCase() + nodeData.type.slice(1);
      console.log(`${nodeTypeName} node "${nodeData.name}" updated successfully`);
    }
  };

  const handleAddConnection = () => {
    if (node && newConnection.targetNodeId && newConnection.label) {
      addConnection(node.id, {
        targetNodeId: newConnection.targetNodeId,
        label: newConnection.label,
        condition: newConnection.condition,
      });
      
      setNewConnection({
        targetNodeId: '',
        label: '',
        condition: '',
      });
      setShowAddConnectionModal(false);
    }
  };

  const handleEditConnection = (connection: StoryConnection) => {
    setEditingConnection(connection);
    setNewConnection({
      targetNodeId: connection.targetNodeId,
      label: connection.label,
      condition: connection.condition || '',
    });
    setShowEditConnectionModal(true);
  };

  const handleUpdateConnection = () => {
    if (node && editingConnection) {
      updateConnection(node.id, editingConnection.id, {
        targetNodeId: newConnection.targetNodeId,
        label: newConnection.label,
        condition: newConnection.condition,
      });
      
      setEditingConnection(null);
      setNewConnection({
        targetNodeId: '',
        label: '',
        condition: '',
      });
      setShowEditConnectionModal(false);
    }
  };

  const handleRemoveConnection = (connectionId: string) => {
    if (node) {
      removeConnection(node.id, connectionId);
    }
  };

  const handleDeleteNode = () => {
    if (node) {
      deleteNode(node.id);
      onClose();
    }
  };

  const availableNodes = currentStory?.nodes.filter(n => n.id !== node?.id) || [];
  const typeaheadOptions = availableNodes.map(n => ({
    label: n.data.name || 'Unnamed Node',
    value: n.id,
    description: `${n.type} node`,
    category: n.type,
  }));

  const nodeTypeOptions = [
    { label: 'Intro', value: 'intro' },
    { label: 'Script', value: 'script' },
    { label: 'End', value: 'end' },
    { label: 'Custom', value: 'custom' },
  ];

  const connectionColumns: TableColumn[] = [
    { 
      key: 'label', 
      label: 'Choice Text',
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-white">{value}</span>
      )
    },
    { 
      key: 'targetNodeId', 
      label: 'Target Node',
      render: (value) => {
        const targetNode = currentStory?.nodes.find(n => n.id === value);
        return (
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              targetNode?.type === 'intro' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              targetNode?.type === 'script' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              targetNode?.type === 'end' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            }`}>
              {targetNode?.type || 'unknown'}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {targetNode?.data.name || 'Unknown Node'}
            </span>
          </div>
        );
      }
    },
    { 
      key: 'condition', 
      label: 'Condition',
      render: (value) => (
        <span className={`text-sm ${value ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
          {value || 'None'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditConnection(row as StoryConnection)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleRemoveConnection((row as StoryConnection).id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )
    },
  ];

  const tabs = [
    {
      id: 'node-info',
      label: 'Node Information',
      icon: <Info size={16} />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Story Node Configuration
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Configure the basic information for this story node. The name and description will be shown to players when they reach this part of the story.
            </p>
          </div>

          <Input
            label="Node Name"
            value={nodeData.name}
            onChange={(value) => setNodeData(prev => ({ ...prev, name: value }))}
            placeholder="Enter a descriptive name for this story scene"
            required
          />
          
          <Select
            label="Node Type"
            options={nodeTypeOptions}
            value={nodeData.type}
            onChange={(value) => setNodeData(prev => ({ ...prev, type: value as StoryNode['type'] }))}
          />
          
          <Textarea
            label="Description"
            value={nodeData.description}
            onChange={(value) => setNodeData(prev => ({ ...prev, description: value }))}
            placeholder="Write the story content that players will see at this node. This could be narrative text, dialogue, or scene descriptions."
            rows={4}
            required
          />

          <div className="space-y-2">
            <Input
              label="Image URL (Optional)"
              value={nodeData.image}
              onChange={(value) => setNodeData(prev => ({ ...prev, image: value }))}
              placeholder="Enter image URL to accompany this story scene"
            />
            {nodeData.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Image Preview:</p>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                  <img
                    src={nodeData.image}
                    alt="Node preview"
                    className="max-w-full h-32 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-700 rounded text-gray-500';
                      errorDiv.innerHTML = '<span>Invalid image URL</span>';
                      (e.target as HTMLImageElement).parentNode?.appendChild(errorDiv);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Node
            </Button>
            <Button onClick={handleSaveBasicInfo}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
          
          {showDeleteConfirm && (
            <Alert
              type="warning"
              title="Delete Node"
              message="Are you sure you want to delete this node? This action cannot be undone and will remove all connections to this node."
              dismissible
              onDismiss={() => setShowDeleteConfirm(false)}
            />
          )}
          
          {showDeleteConfirm && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteNode}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Delete
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'next-nodes',
      label: 'Player Choices',
      icon: <Link size={16} />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
              Choice Management
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Define the choices players can make from this node. Each choice leads to another node in your story, creating branching narratives.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Player Choices & Connections
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create choices that players can select to continue the story
              </p>
            </div>
            <Button
              onClick={() => setShowAddConnectionModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Choice</span>
            </Button>
          </div>

          {node?.connections.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Choices Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Add choices to give players options for continuing the story from this point
              </p>
              <Button
                onClick={() => setShowAddConnectionModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add First Choice</span>
              </Button>
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <Table
                columns={connectionColumns}
                data={node?.connections || []}
                hoverable
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <TabbedModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Edit Node: ${node?.data.name || 'Unknown'}`}
        tabs={tabs}
        size="xl"
      />

      {/* Add Connection Modal */}
      <Modal
        isOpen={showAddConnectionModal}
        onClose={() => {
          setShowAddConnectionModal(false);
          setNewConnection({ targetNodeId: '', label: '', condition: '' });
        }}
        title="Add New Player Choice"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Create a choice that players can select to continue the story. Each choice should lead to another node in your story.
            </p>
          </div>

          <Input
            label="Choice Text"
            value={newConnection.label}
            onChange={(value) => setNewConnection(prev => ({ ...prev, label: value }))}
            placeholder="e.g., 'Continue the journey', 'Accept the quest', 'Go left'"
            required
          />
          
          <Typeahead
            label="Target Node"
            options={typeaheadOptions}
            value={newConnection.targetNodeId}
            onChange={(value) => setNewConnection(prev => ({ ...prev, targetNodeId: value }))}
            placeholder="Search for the node this choice leads to..."
            groupByCategory
            allowClear
            emptyMessage="No available nodes found"
          />
          
          <Input
            label="Condition (Optional)"
            value={newConnection.condition}
            onChange={(value) => setNewConnection(prev => ({ ...prev, condition: value }))}
            placeholder="e.g., 'if player has key', 'if score > 10' (advanced feature)"
          />
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddConnectionModal(false);
                setNewConnection({ targetNodeId: '', label: '', condition: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddConnection}
              disabled={!newConnection.targetNodeId || !newConnection.label}
            >
              Add Choice
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Connection Modal */}
      <Modal
        isOpen={showEditConnectionModal}
        onClose={() => {
          setShowEditConnectionModal(false);
          setEditingConnection(null);
          setNewConnection({ targetNodeId: '', label: '', condition: '' });
        }}
        title="Edit Player Choice"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Choice Text"
            value={newConnection.label}
            onChange={(value) => setNewConnection(prev => ({ ...prev, label: value }))}
            placeholder="Enter the choice text"
            required
          />
          
          <Typeahead
            label="Target Node"
            options={typeaheadOptions}
            value={newConnection.targetNodeId}
            onChange={(value) => setNewConnection(prev => ({ ...prev, targetNodeId: value }))}
            placeholder="Search for target node..."
            groupByCategory
            allowClear
            emptyMessage="No available nodes found"
          />
          
          <Input
            label="Condition (Optional)"
            value={newConnection.condition}
            onChange={(value) => setNewConnection(prev => ({ ...prev, condition: value }))}
            placeholder="Enter condition for this choice"
          />
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditConnectionModal(false);
                setEditingConnection(null);
                setNewConnection({ targetNodeId: '', label: '', condition: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateConnection}
              disabled={!newConnection.targetNodeId || !newConnection.label}
            >
              Update Choice
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};