import React, { useState, useEffect } from 'react';
import { TabbedModal } from '../../../components/ui/TabbedModal';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useAdminFlowController } from '../controllers/adminFlowController';
import { FlowNode, FlowConnection } from '../types/flow.types';
import { Info, Link, Plus, Trash2 } from 'lucide-react';

interface NodeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: FlowNode | null;
}

export const NodeEditModal: React.FC<NodeEditModalProps> = ({ isOpen, onClose, node }) => {
  const { currentFlow, updateNode, addConnection, removeConnection, updateConnection } = useAdminFlowController();
  
  const [nodeData, setNodeData] = useState({
    label: '',
    description: '',
    type: 'process' as FlowNode['type'],
  });

  const [connections, setConnections] = useState<FlowConnection[]>([]);
  const [newConnection, setNewConnection] = useState({
    targetNodeId: '',
    label: '',
    condition: '',
  });

  useEffect(() => {
    if (node) {
      setNodeData({
        label: node.data.label,
        description: node.data.description || '',
        type: node.type,
      });
      setConnections([...node.connections]);
    }
  }, [node]);

  const handleSaveBasicInfo = () => {
    if (node) {
      updateNode(node.id, {
        type: nodeData.type,
        data: {
          ...node.data,
          label: nodeData.label,
          description: nodeData.description,
        },
      });
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
    }
  };

  const handleRemoveConnection = (connectionId: string) => {
    if (node) {
      removeConnection(node.id, connectionId);
    }
  };

  const handleUpdateConnection = (connectionId: string, updates: Partial<FlowConnection>) => {
    if (node) {
      updateConnection(node.id, connectionId, updates);
    }
  };

  const availableNodes = currentFlow?.nodes.filter(n => n.id !== node?.id) || [];
  const nodeOptions = availableNodes.map(n => ({
    label: n.data.label,
    value: n.id,
  }));

  const nodeTypeOptions = [
    { label: 'Start', value: 'start' },
    { label: 'Process', value: 'process' },
    { label: 'Decision', value: 'decision' },
    { label: 'End', value: 'end' },
  ];

  const tabs = [
    {
      id: 'basic-info',
      label: 'Basic Info',
      icon: <Info size={16} />,
      content: (
        <div className="space-y-4">
          <Input
            label="Node Label"
            value={nodeData.label}
            onChange={(value) => setNodeData(prev => ({ ...prev, label: value }))}
            placeholder="Enter node label"
            required
          />
          
          <Select
            label="Node Type"
            options={nodeTypeOptions}
            value={nodeData.type}
            onChange={(value) => setNodeData(prev => ({ ...prev, type: value as FlowNode['type'] }))}
          />
          
          <Textarea
            label="Description"
            value={nodeData.description}
            onChange={(value) => setNodeData(prev => ({ ...prev, description: value }))}
            placeholder="Enter node description"
            rows={3}
          />
          
          <div className="flex justify-end">
            <Button onClick={handleSaveBasicInfo}>
              Save Changes
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'connections',
      label: 'Connections',
      icon: <Link size={16} />,
      content: (
        <div className="space-y-6">
          {/* Existing Connections */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Current Connections ({node?.connections.length || 0})
            </h4>
            
            {node?.connections.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No connections defined
              </p>
            ) : (
              <div className="space-y-3">
                {node?.connections.map((connection) => {
                  const targetNode = currentFlow?.nodes.find(n => n.id === connection.targetNodeId);
                  return (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {connection.label}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            → {targetNode?.data.label || 'Unknown Node'}
                          </span>
                        </div>
                        {connection.condition && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Condition: {connection.condition}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveConnection(connection.id)}
                        className="text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add New Connection */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Add New Connection
            </h4>
            
            <div className="space-y-3">
              <Select
                label="Target Node"
                options={nodeOptions}
                value={newConnection.targetNodeId}
                onChange={(value) => setNewConnection(prev => ({ ...prev, targetNodeId: value }))}
                placeholder="Select target node"
              />
              
              <Input
                label="Connection Label"
                value={newConnection.label}
                onChange={(value) => setNewConnection(prev => ({ ...prev, label: value }))}
                placeholder="Enter connection label"
              />
              
              <Input
                label="Condition (Optional)"
                value={newConnection.condition}
                onChange={(value) => setNewConnection(prev => ({ ...prev, condition: value }))}
                placeholder="Enter condition for this connection"
              />
              
              <Button
                onClick={handleAddConnection}
                disabled={!newConnection.targetNodeId || !newConnection.label}
                className="flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Connection</span>
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <TabbedModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Node: ${node?.data.label || 'Unknown'}`}
      tabs={tabs}
      size="lg"
    />
  );
};