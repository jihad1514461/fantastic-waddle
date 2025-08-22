import React, { useEffect, useMemo, useState } from 'react';
import { TabbedModal } from '../../../components/ui/TabbedModal';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useAdminFlowController } from '../controllers/adminMainFlowController';
import { StoryNode, StoryChoice, StoryNodeType } from '../types/story.types';
import { Info, ListChecks, Plus, Trash2, Save, AlertCircle } from 'lucide-react';

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

  const [newChoice, setNewChoice] = useState<{ 
    name: string; 
    nextTitle: string; 
    nextNodeId?: string;
  }>({
    name: '', 
    nextTitle: '', 
    nextNodeId: undefined,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!node) return;
    setTitle(node.data.title);
    setDescription(node.data.description || '');
    setType(node.type);
    setNewChoice({ name: '', nextTitle: '', nextNodeId: undefined });
  }, [node]);

  const availableNodes = useMemo(() => {
    const nodesArray = Array.isArray(currentStory?.nodes) ? currentStory.nodes : [];
    return nodesArray
      .filter(n => n.id !== node?.id)
      .map(n => ({ label: n.data.title, value: n.id }));
  }, [currentStory?.nodes, node?.id]);

  const nodeTypeOptions = [
    { label: 'Introduction', value: 'intro' },
    { label: 'Script/Scene', value: 'script' },
    { label: 'Ending', value: 'end' },
  ];

  const handleSaveBasic = async () => {
    if (!node) return;
    setIsSaving(true);
    try {
      await updateNodeBasic(node.id, { title, description, type });
    } catch (error) {
      console.error('Failed to save node:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddChoice = async () => {
    if (!node || !newChoice.name.trim()) return;
    
    try {
      await addChoice(node.id, {
        name: newChoice.name.trim(),
        nextTitle: newChoice.nextTitle.trim() || newChoice.name.trim(),
        nextNodeId: newChoice.nextNodeId || undefined,
      });
      setNewChoice({ name: '', nextTitle: '', nextNodeId: undefined });
    } catch (error) {
      console.error('Failed to add choice:', error);
    }
  };

  const handleUpdateChoice = async (choiceId: string, updates: Partial<StoryChoice>) => {
    if (!node) return;
    try {
      await updateChoice(node.id, choiceId, updates);
    } catch (error) {
      console.error('Failed to update choice:', error);
    }
  };

  const handleRemoveChoice = async (choiceId: string) => {
    if (!node) return;
    try {
      await removeChoice(node.id, choiceId);
    } catch (error) {
      console.error('Failed to remove choice:', error);
    }
  };

  const getNodeTypeDescription = (nodeType: StoryNodeType) => {
    switch (nodeType) {
      case 'intro':
        return 'Starting point of your story. Usually has choices leading to different paths.';
      case 'script':
        return 'Main content nodes that advance the narrative. Can have multiple choice branches.';
      case 'end':
        return 'Conclusion nodes that end story paths. Typically have no choices.';
      default:
        return '';
    }
  };

  const tabs = [
    {
      id: 'basic',
      label: 'Basic Info',
      icon: <Info size={16} />,
      content: (
        <div className="space-y-6">
          <div>
            <Input 
              label="Node Title" 
              value={title} 
              onChange={setTitle} 
              placeholder="Enter descriptive node title..." 
              required 
            />
            <p className="text-xs text-gray-500 mt-1">
              This title will appear in the flow editor and simulation
            </p>
          </div>

          <div>
            <Select
              label="Node Type"
              options={nodeTypeOptions}
              value={type}
              onChange={(v) => setType(v as StoryNodeType)}
            />
            <p className="text-xs text-gray-500 mt-1">
              {getNodeTypeDescription(type)}
            </p>
          </div>

          <div>
            <Textarea 
              label="Description" 
              value={description} 
              onChange={setDescription} 
              rows={4}
              placeholder="Describe what happens in this scene or provide narrative content..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This content will be shown during story simulation
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              onClick={handleSaveBasic} 
              disabled={isSaving || !title.trim()}
              className="flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'choices',
      label: 'Choices & Paths',
      icon: <ListChecks size={16} />,
      content: (
        <div className="space-y-6">
          {/* Existing Choices */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Current Choices ({node?.choices?.length || 0})
              </h4>
              {type === 'end' && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                  <AlertCircle size={12} />
                  End nodes typically don't have choices
                </div>
              )}
            </div>

            <div className="space-y-3">
              {node?.choices?.length ? node.choices.map((choice, index) => (
                <div 
                  key={choice.id} 
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          label={`Choice ${index + 1} Text`}
                          value={choice.name}
                          onChange={(v) => handleUpdateChoice(choice.id, { name: v })}
                          placeholder="What option does the user see?"
                        />
                        <Input
                          label="Next Scene Title"
                          value={choice.nextTitle}
                          onChange={(v) => handleUpdateChoice(choice.id, { nextTitle: v })}
                          placeholder="Brief description of where this leads"
                        />
                      </div>
                      
                      <Select
                        label="Link to Existing Node (Optional)"
                        options={[
                          { label: '-- No link --', value: '' }, 
                          ...availableNodes
                        ]}
                        value={choice.nextNodeId || ''}
                        onChange={(v) => handleUpdateChoice(choice.id, { nextNodeId: v || undefined })}
                      />
                      
                      {!choice.nextNodeId && choice.nextTitle && (
                        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                          <Info size={12} />
                          This choice points to "{choice.nextTitle}" but isn't linked to an existing node yet.
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveChoice(choice.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <ListChecks className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">No choices yet</p>
                  <p className="text-xs text-gray-400">Add choices to create branching paths</p>
                </div>
              )}
            </div>
          </div>

          {/* Add New Choice */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Add New Choice
            </h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Choice Text" 
                  value={newChoice.name} 
                  onChange={(v) => setNewChoice(p => ({ ...p, name: v }))}
                  placeholder="e.g., 'Go to the forest'"
                />
                <Input 
                  label="Next Scene Title" 
                  value={newChoice.nextTitle} 
                  onChange={(v) => setNewChoice(p => ({ ...p, nextTitle: v }))}
                  placeholder="e.g., 'Forest Path'"
                />
              </div>
              
              <Select
                label="Link to Existing Node (Optional)"
                options={[
                  { label: '-- Create new node later --', value: '' }, 
                  ...availableNodes
                ]}
                value={newChoice.nextNodeId || ''}
                onChange={(v) => setNewChoice(p => ({ ...p, nextNodeId: v || undefined }))}
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddChoice} 
                  disabled={!newChoice.name.trim()}
                  className="flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Choice</span>
                </Button>
              </div>
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