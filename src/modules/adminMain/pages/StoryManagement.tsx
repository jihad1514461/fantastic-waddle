import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
import { FlowEditor } from '../components/FlowEditor';
import { FlowSimulation } from '../components/FlowSimulation';
import { NodeEditModal } from '../components/NodeEditModal';
import { useAdminFlowController } from '../controllers/adminMainFlowController';
import { StoryNodeType } from '../types/story.types';
import { Plus, GitBranch, StopCircle, Square, Play } from 'lucide-react';

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

  const getStoryStats = (story: typeof currentStory) => {
    if (!story || !Array.isArray(story.nodes)) return { nodes: 0, choices: 0, endings: 0 };
    return {
      nodes: story.nodes.length,
      choices: story.nodes.reduce((acc, n) => acc + n.choices.length, 0),
      endings: story.nodes.filter(n => n.type === 'end').length,
    };
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Story Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage interactive stories with branching narratives
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
                <div className="text-center py-8">
                  <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-4">No stories yet</p>
                  <Button 
                    size="sm" 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus size={14} />
                    <span>Create First Story</span>
                  </Button>
                </div>
              ) : stories.map(st => {
                const stats = getStoryStats(st);
                return (
                  <div
                    key={st.id}
                    onClick={() => setCurrentStory(st)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors group
                      ${currentStory?.id === st.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {st.name}
                      </div>
                      {/* <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        onClick={(e: React.MouseEvent) => {e.stopPropagation();}}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div> */}
                    </div>
                    
                    {st.description && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {st.description}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{stats.nodes} nodes</span>
                      <span>{stats.choices} choices</span>
                      <span>{stats.endings} endings</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 flex flex-col">
          {currentStory ? (
            <>
              {/* Story Header */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentStory.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentStory.description || 'No description provided'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {(() => {
                          const stats = getStoryStats(currentStory);
                          return (
                            <>
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                {stats.nodes} nodes
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                {stats.choices} choices
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {stats.endings} endings
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleAddNode('script')} 
                        className="flex items-center gap-1"
                      >
                        <Square size={14} /> 
                        <span>Script</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleAddNode('end')} 
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <StopCircle size={14} /> 
                        <span>End</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Tabs */}
              <Card className="flex-1">
                <CardContent className="p-0 h-full">
                  <Tabs
                    tabs={[
                      {
                        id: 'editor',
                        label: 'Flow Editor',
                        icon: <GitBranch size={16} />,
                        content: (
                          <div className="h-full">
                            <FlowEditor onNodeClick={() => setShowNodeModal(true)} />
                          </div>
                        ),
                      },
                      {
                        id: 'simulation',
                        label: 'Simulation',
                        icon: <Play size={16} />,
                        content: (
                          <div className="h-full p-4 overflow-auto">
                            <FlowSimulation />
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
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                    No Story Selected
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Create your first interactive story to get started with branching narratives
                  </p>
                  <Button 
                    onClick={() => setShowCreateModal(true)} 
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Create Your First Story</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Story Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false);
          setNewStory({ name: '', description: '' });
        }} 
        title="Create New Story"
        size="md"
      >
        <div className="space-y-4">
          <Input 
            label="Story Name" 
            value={newStory.name} 
            onChange={(v) => setNewStory(p => ({ ...p, name: v }))} 
            required 
            placeholder="Enter a compelling story name..."
          />
          <Input 
            label="Description (Optional)" 
            value={newStory.description} 
            onChange={(v) => setNewStory(p => ({ ...p, description: v }))}
            placeholder="Brief description of your story's theme or genre..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateModal(false);
                setNewStory({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!newStory.name.trim()}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Create Story
            </Button>
          </div>
        </div>
      </Modal>

      {/* Node Edit Modal */}
      <NodeEditModal 
        isOpen={showNodeModal} 
        onClose={() => {
          setShowNodeModal(false);
          selectNode(null);
        }} 
        node={selectedNode} 
      />
    </div>
  );
};
