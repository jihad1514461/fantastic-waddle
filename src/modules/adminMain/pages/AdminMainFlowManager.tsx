import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
import { FlowEditor } from '../components/FlowEditor';
import { FlowSimulation } from '../components/FlowSimulation';
import { NodeEditModal } from '../components/NodeEditModal';
import { useAdminFlowController } from '../controllers/adminMainFlowController';
import { FlowNode } from '../types/flow.types';
import { 
  Plus, Play, Edit, Trash2, GitBranch, Zap, Square, 
  Circle, Diamond, StopCircle, Settings 
} from 'lucide-react';

export const AdminFlowManager: React.FC = () => {
  const {
    flows,
    currentFlow,
    selectedNode,
    createFlow,
    deleteFlow,
    setCurrentFlow,
    addNode,
    deleteNode,
    loadFlows,
  } = useAdminFlowController();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [newFlowData, setNewFlowData] = useState({ name: '', description: '' });
  const [activeTab, setActiveTab] = useState('editor');

  useEffect(() => {
    loadFlows();
  }, [loadFlows]);

  const handleCreateFlow = () => {
    if (newFlowData.name.trim()) {
      createFlow(newFlowData.name, newFlowData.description);
      setNewFlowData({ name: '', description: '' });
      setShowCreateModal(false);
    }
  };

  const handleAddNode = (type: FlowNode['type']) => {
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    };
    addNode(type, position);
  };

  const handleNodeClick = (node: FlowNode) => {
    setShowNodeModal(true);
  };

  const nodeTypes = [
    { type: 'start' as const, icon: Play, label: 'Start', color: 'text-green-600' },
    { type: 'process' as const, icon: Square, label: 'Process', color: 'text-blue-600' },
    { type: 'decision' as const, icon: Diamond, label: 'Decision', color: 'text-yellow-600' },
    { type: 'end' as const, icon: StopCircle, label: 'End', color: 'text-red-600' },
  ];

  const tabs = [
    {
      id: 'editor',
      label: 'Flow Editor',
      icon: <GitBranch size={16} />,
      content: (
        <div className="h-full">
          <FlowEditor onNodeClick={handleNodeClick} />
        </div>
      ),
    },
    {
      id: 'simulation',
      label: 'Flow Simulation',
      icon: <Zap size={16} />,
      content: <FlowSimulation />,
    },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Flow Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage workflow processes
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Create Flow</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Flow List Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Flows ({flows.length})
              </h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {flows.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No flows created yet
                </p>
              ) : (
                flows.map((flow) => (
                  <div
                    key={flow.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentFlow?.id === flow.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setCurrentFlow(flow)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {flow.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {flow.nodes.length} nodes
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFlow(flow.id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 flex flex-col">
          {currentFlow ? (
            <>
              {/* Flow Info and Controls */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentFlow.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentFlow.description || 'No description'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {nodeTypes.map(({ type, icon: Icon, label, color }) => (
                        <Button
                          key={type}
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddNode(type)}
                          className={`flex items-center space-x-1 ${color}`}
                        >
                          <Icon size={14} />
                          <span>{label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs Content */}
              <Card className="flex-1">
                <CardContent className="p-0 h-full">
                  <Tabs
                    tabs={tabs}
                    defaultTab={activeTab}
                    onChange={setActiveTab}
                    variant="underline"
                    className="h-full flex flex-col"
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="flex-1">
              <CardContent className="h-full flex items-center justify-center">
                <div className="text-center">
                  <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Flow Selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Create a new flow or select an existing one to get started
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Create Your First Flow</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Flow Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Flow"
      >
        <div className="space-y-4">
          <Input
            label="Flow Name"
            value={newFlowData.name}
            onChange={(value) => setNewFlowData(prev => ({ ...prev, name: value }))}
            placeholder="Enter flow name"
            required
          />
          
          <Input
            label="Description"
            value={newFlowData.description}
            onChange={(value) => setNewFlowData(prev => ({ ...prev, description: value }))}
            placeholder="Enter flow description"
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFlow}>
              Create Flow
            </Button>
          </div>
        </div>
      </Modal>

      {/* Node Edit Modal */}
      <NodeEditModal
        isOpen={showNodeModal}
        onClose={() => setShowNodeModal(false)}
        node={selectedNode}
      />
    </div>
  );
};