import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
import { FlowEditor } from '../components/FlowEditor';
import { NodeEditModal } from '../components/NodeEditModal';
import { useAdminFlowController } from '../controllers/adminMainFlowController';
import { StoryNodeType } from '../types/story.types';
import { Plus, GitBranch, StopCircle, Square } from 'lucide-react';

export const StoryManagement: React.FC = () => {
  const {
    stories,
    currentStory,
    selectedNode,
    loadStories,
    setCurrentStory,
    createStory,
    addNode,
    selectNode,
  } = useAdminFlowController();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStory, setNewStory] = useState({ name: '', description: '' });
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  useEffect(() => { loadStories(); }, [loadStories]);

  const handleCreate = async () => {
    if (!newStory.name.trim()) return;
    await createStory(newStory.name.trim(), newStory.description.trim() || undefined);
    setNewStory({ name: '', description: '' });
    setShowCreateModal(false);
  };

  const handleAddNode = async (type: StoryNodeType) => {
    const pos = { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 };
    await addNode(type, pos);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Story Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage interactive stories
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
          <Plus size={16} /><span>Create Story</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Sidebar: stories */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <h3 className="text-lg font-semibold">Stories ({stories.length})</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {stories.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No stories yet</p>
              ) : stories.map(st => (
                <div
                  key={st.id}
                  onClick={() => setCurrentStory(st)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors
                    ${currentStory?.id === st.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <div className="font-medium">{st.name}</div>
                  <div className="text-xs text-gray-500">{st.nodes.length} nodes</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main */}
        <div className="lg:col-span-3 flex flex-col">
          {currentStory ? (
            <>
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{currentStory.name}</h2>
                      <p className="text-sm text-gray-500">{currentStory.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => handleAddNode('script')} className="flex items-center gap-1">
                        <Square size={14} /> <span>Script</span>
                      </Button>
                      <Button variant="outline" onClick={() => handleAddNode('end')} className="flex items-center gap-1 text-red-600">
                        <StopCircle size={14} /> <span>End</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardContent className="p-0 h-full">
                  <Tabs
                    tabs={[
                      {
                        id: 'editor',
                        label: 'Editor',
                        icon: <GitBranch size={16} />,
                        content: (
                          <div className="h-full">
                            {/* Click in editor should open modal */}
                            <FlowEditor onNodeClick={() => setShowNodeModal(true)} />
                          </div>
                        ),
                      },
                    ]}
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
                  <h3 className="text-lg font-medium mb-2">No Story Selected</h3>
                  <p className="text-gray-500 mb-4">Create a new story to get started</p>
                  <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
                    <Plus size={16} /><span>Create Your First Story</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Story Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Story">
        <div className="space-y-4">
          <Input label="Story Name" value={newStory.name} onChange={(v) => setNewStory(p => ({ ...p, name: v }))} required />
          <Input label="Description" value={newStory.description} onChange={(v) => setNewStory(p => ({ ...p, description: v }))} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Story</Button>
          </div>
        </div>
      </Modal>

      {/* Node edit modal */}
      <NodeEditModal isOpen={showNodeModal} onClose={() => setShowNodeModal(false)} node={selectedNode as any} />
    </div>
  );
};
