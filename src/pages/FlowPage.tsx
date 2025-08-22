import React, { useState } from 'react';
import { FlowEditor } from '../components/flow/FlowEditor';
import { useFlowController } from '../controllers/flowController';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Plus, Save, Trash2 } from 'lucide-react';

export const FlowPage: React.FC = () => {
  const { addNode, clearFlow, selectedNode, selectNode } = useFlowController();
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [nodeLabel, setNodeLabel] = useState('');

  const handleAddNode = () => {
    if (nodeLabel.trim()) {
      addNode({
        data: { label: nodeLabel },
        position: { x: Math.random() * 400, y: Math.random() * 400 },
      });
      setNodeLabel('');
      setShowNodeModal(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Flow Editor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage your node-based workflows
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            onClick={() => setShowNodeModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Node</span>
          </Button>
          
          <Button variant="outline">
            <Save size={16} />
          </Button>
          
          <Button
            variant="outline"
            onClick={clearFlow}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <FlowEditor />
      </div>

      <Modal
        isOpen={showNodeModal}
        onClose={() => setShowNodeModal(false)}
        title="Add New Node"
      >
        <div className="space-y-4">
          <Input
            label="Node Label"
            value={nodeLabel}
            onChange={setNodeLabel}
            placeholder="Enter node label"
            required
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowNodeModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNode}>
              Add Node
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};