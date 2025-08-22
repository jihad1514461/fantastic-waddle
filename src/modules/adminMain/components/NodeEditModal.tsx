import React, { useEffect, useMemo, useState } from 'react';
import { TabbedModal } from '../../../components/ui/TabbedModal';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useAdminFlowController } from '../controllers/adminMainFlowController';
import { StoryNode, StoryChoice, StoryNodeType } from '../types/story.types';
import { Info, ListChecks, Plus, Trash2, Save } from 'lucide-react';

interface NodeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: StoryNode | null;
}

export const NodeEditModal: React.FC<NodeEditModalProps> = ({ isOpen, onClose, node }) => {
  const {
    currentStory,
    updateNodeBasic,
    addChoice,
    updateChoice,
    removeChoice,
  } = useAdminFlowController();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<StoryNodeType>('script');

  const [newChoice, setNewChoice] = useState<{ name: string; nextTitle: string; nextNodeId?: string }>({
    name: '', nextTitle: '', nextNodeId: undefined,
  });

  useEffect(() => {
    if (!node) return;
    setTitle(node.data.title);
    setDescription(node.data.description || '');
    setType(node.type);
  }, [node]);

  const availableNodes = useMemo(() => {
  const nodesArray = Array.isArray(currentStory?.nodes) ? currentStory.nodes : [];
  return nodesArray
    .filter(n => n.id !== node?.id)
    .map(n => ({ label: n.data.title, value: n.id }));
}, [currentStory?.nodes, node?.id]);


  const nodeTypeOptions = [
    { label: 'Intro', value: 'intro' },
    { label: 'Script', value: 'script' },
    { label: 'End', value: 'end' },
  ];

  const handleSaveBasic = async () => {
    if (!node) return;
    await updateNodeBasic(node.id, { title, description, type });
  };

  const handleAddChoice = async () => {
    if (!node) return;
    if (!newChoice.name.trim()) return;
    await addChoice(node.id, {
      name: newChoice.name.trim(),
      nextTitle: newChoice.nextTitle.trim(),
      nextNodeId: newChoice.nextNodeId || undefined,
    });
    setNewChoice({ name: '', nextTitle: '', nextNodeId: undefined });
  };

  const tabs = [
    {
      id: 'basic',
      label: 'Basic',
      icon: <Info size={16} />,
      content: (
        <div className="space-y-4">
          <Input label="Title" value={title} onChange={setTitle} placeholder="Node title" required />
          <Select
            label="Type"
            options={nodeTypeOptions}
            value={type}
            onChange={(v) => setType(v as StoryNodeType)}
          />
          <Textarea label="Description" value={description} onChange={setDescription} rows={3} />
          <div className="flex justify-end">
            <Button onClick={handleSaveBasic} className="flex items-center space-x-2">
              <Save size={16} /><span>Save</span>
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'choices',
      label: 'Choices',
      icon: <ListChecks size={16} />,
      content: (
        <div className="space-y-6">
          {/* List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Existing Choices</h4>
            {node?.choices?.length ? node.choices.map((ch) => (
              <div key={ch.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center gap-3">
                <Input
                  label="Name"
                  value={ch.name}
                  onChange={(v) => updateChoice(node.id, ch.id, { name: v })}
                />
                <Input
                  label="Next Title"
                  value={ch.nextTitle}
                  onChange={(v) => updateChoice(node.id, ch.id, { nextTitle: v })}
                />
                <Select
                  label="Link to Node (optional)"
                  options={[{ label: 'None', value: '' }, ...(availableNodes || [])]}
                  value={ch.nextNodeId || ''}
                  onChange={(v) => updateChoice(node.id, ch.id, { nextNodeId: v || undefined })}
                />
                <Button variant="ghost" className="text-red-600" onClick={() => removeChoice(node.id, ch.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No choices yet</p>
            )}
          </div>

          {/* Add new */}
          <div className="border-t dark:border-gray-700 pt-4 space-y-3">
            <h4 className="text-sm font-medium">Add Choice</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Name" value={newChoice.name} onChange={(v) => setNewChoice(p => ({ ...p, name: v }))} />
              <Input label="Next Title" value={newChoice.nextTitle} onChange={(v) => setNewChoice(p => ({ ...p, nextTitle: v }))} />
              <Select
                label="Link to Node (optional)"
                options={[{ label: 'None', value: '' }, ...(availableNodes || [])]}
                value={newChoice.nextNodeId || ''}
                onChange={(v) => setNewChoice(p => ({ ...p, nextNodeId: v || undefined }))}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddChoice} className="flex items-center space-x-2" disabled={!newChoice.name.trim()}>
                <Plus size={16} /><span>Add Choice</span>
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
      title={`Edit Node: ${node?.data.title || 'Unknown'}`}
      tabs={tabs}
      size="lg"
    />
  );
};
