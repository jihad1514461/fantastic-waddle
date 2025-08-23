import { create } from 'zustand';
import { StoryNode, StoryConnection, Story, StorySimulation, StorySimulationStep } from '../types/flow.types';
import { storageService } from '../../../services/storageService';

interface AdminStoryController {
  stories: Story[];
  currentStory: Story | null;
  selectedNode: StoryNode | null;
  simulation: StorySimulation | null;
  
  // Story management
  createStory: (name: string, description: string) => Story;
  updateStory: (storyId: string, updates: Partial<Story>) => void;
  deleteStory: (storyId: string) => void;
  setCurrentStory: (story: Story | null) => void;
  loadStories: () => void;
  saveStories: () => void;
  
  // Node management
  addNode: (type: StoryNode['type'], position: { x: number; y: number }) => StoryNode;
  updateNode: (nodeId: string, updates: Partial<StoryNode>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (node: StoryNode | null) => void;
  
  // Connection management
  addConnection: (nodeId: string, connection: Omit<StoryConnection, 'id'>) => void;
  removeConnection: (nodeId: string, connectionId: string) => void;
  updateConnection: (nodeId: string, connectionId: string, updates: Partial<StoryConnection>) => void;
  
  // Simulation
  startSimulation: (storyId: string) => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  stopSimulation: () => void;
  stepSimulation: () => void;
  
  // Validation
  validateNode: (nodeId: string) => {
    hasParent: boolean;
    hasChoices: boolean;
    hasValidTargets: boolean;
    issues: string[];
  };
}

export const useAdminFlowController = create<AdminStoryController>((set, get) => ({
  stories: [],
  currentStory: null,
  selectedNode: null,
  simulation: null,

  createStory: (name: string, description: string) => {
    const introNode: StoryNode = {
      id: `node-intro-${Date.now()}`,
      type: 'intro',
      position: { x: 250, y: 100 },
      data: {
        name: 'Story Beginning',
        description: 'This is where your story begins. Write an engaging opening that draws players in.',
        image: '',
      },
      connections: [],
    };

    const newStory: Story = {
      id: `story-${Date.now()}`,
      name,
      description,
      nodes: [introNode],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin',
      isActive: true,
    };

    set(state => ({
      stories: [...state.stories, newStory],
      currentStory: newStory,
    }));

    get().saveStories();
    return newStory;
  },

  updateStory: (storyId: string, updates: Partial<Story>) => {
    set(state => ({
      stories: state.stories.map(story =>
        story.id === storyId
          ? { ...story, ...updates, updatedAt: new Date().toISOString() }
          : story
      ),
      currentStory: state.currentStory?.id === storyId
        ? { ...state.currentStory, ...updates, updatedAt: new Date().toISOString() }
        : state.currentStory,
    }));
    get().saveStories();
  },

  deleteStory: (storyId: string) => {
    set(state => ({
      stories: state.stories.filter(story => story.id !== storyId),
      currentStory: state.currentStory?.id === storyId ? null : state.currentStory,
    }));
    get().saveStories();
  },

  setCurrentStory: (story: Story | null) => {
    set({ currentStory: story, selectedNode: null });
  },

  loadStories: () => {
    const savedStories = storageService.get<Story[]>('admin-stories') || [];
    // Sanitize loaded data to ensure names are strings, migrate old data, and ensure required fields
    const sanitizedStories = savedStories.map(story => ({
      ...story,
      nodes: story.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          // Migrate old 'label' field to 'name' if it exists and ensure all required fields
          name: String(node.data.name || (node.data as any).label || 'Unnamed Node'),
          description: String(node.data.description || 'No description'),
          image: String(node.data.image || ''),
        },
      })),
    }));
    set({ stories: sanitizedStories });
  },

  saveStories: () => {
    const { stories } = get();
    storageService.set('admin-stories', stories);
  },

  addNode: (type: StoryNode['type'], position: { x: number; y: number }) => {
    const getNodeName = (type: StoryNode['type']) => {
      switch (type) {
        case 'intro': return 'Story Opening';
        case 'script': return 'Story Scene';
        case 'end': return 'Story Conclusion';
        case 'custom': return 'Custom Scene';
        default: return 'New Story Node';
      }
    };

    const getNodeDescription = (type: StoryNode['type']) => {
      switch (type) {
        case 'intro': return 'This is where your story begins. Write an engaging opening that draws players into your world.';
        case 'script': return 'A story scene where the narrative unfolds. Describe what happens and set up choices for the player.';
        case 'end': return 'This is one of your story endings. Provide a satisfying conclusion based on the player\'s journey.';
        case 'custom': return 'A custom story node. Define what happens here and how it fits into your narrative.';
        default: return 'Enter your story content here...';
      }
    };
    const newNode: StoryNode = {
      id: `node-${type}-${Date.now()}`,
      type,
      position,
      data: {
        name: getNodeName(type),
        description: getNodeDescription(type),
        image: '',
      },
      connections: [],
    };

    const { currentStory } = get();
    if (currentStory) {
      const updatedStory = {
        ...currentStory,
        nodes: [...currentStory.nodes, newNode],
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        stories: state.stories.map(story =>
          story.id === currentStory.id ? updatedStory : story
        ),
        currentStory: updatedStory,
      }));

      get().saveStories();
    }

    return newNode;
  },

  updateNode: (nodeId: string, updates: Partial<StoryNode>) => {
    const { currentStory } = get();
    if (currentStory) {
      const updatedStory = {
        ...currentStory,
        nodes: currentStory.nodes.map(node =>
          node.id === nodeId ? { ...node, ...updates } : node
        ),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        stories: state.stories.map(story =>
          story.id === currentStory.id ? updatedStory : story
        ),
        currentStory: updatedStory,
        selectedNode: state.selectedNode?.id === nodeId
          ? { ...state.selectedNode, ...updates }
          : state.selectedNode,
      }));

      get().saveStories();
    }
  },

  deleteNode: (nodeId: string) => {
    const { currentStory } = get();
    if (currentStory) {
      // Prevent deleting the last intro node to maintain story integrity
      const introNodes = currentStory.nodes.filter(node => node.type === 'intro');
      const nodeToDelete = currentStory.nodes.find(node => node.id === nodeId);
      
      if (nodeToDelete?.type === 'intro' && introNodes.length === 1) {
        console.warn('Cannot delete the last intro node - stories must have at least one starting point');
        return; // Prevent deletion of the last intro node
      }

      // Remove the node and clean up any connections pointing to it
      const updatedNodes = currentStory.nodes
        .filter(node => node.id !== nodeId)
        .map(node => ({
          ...node,
          connections: node.connections.filter(conn => conn.targetNodeId !== nodeId)
        }));

      const updatedStory = {
        ...currentStory,
        nodes: updatedNodes,
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        stories: state.stories.map(story =>
          story.id === currentStory.id ? updatedStory : story
        ),
        currentStory: updatedStory,
        selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode,
      }));

      get().saveStories();
    }
  },

  selectNode: (node: StoryNode | null) => {
    set({ selectedNode: node });
  },

  addConnection: (nodeId: string, connection: Omit<StoryConnection, 'id'>) => {
    const newConnection: StoryConnection = {
      ...connection,
      id: `conn-${Date.now()}`,
    };

    get().updateNode(nodeId, {
      connections: [
        ...(get().currentStory?.nodes.find(n => n.id === nodeId)?.connections || []),
        newConnection,
      ],
    });
  },

  removeConnection: (nodeId: string, connectionId: string) => {
    const node = get().currentStory?.nodes.find(n => n.id === nodeId);
    if (node) {
      get().updateNode(nodeId, {
        connections: node.connections.filter(conn => conn.id !== connectionId),
      });
    }
  },

  updateConnection: (nodeId: string, connectionId: string, updates: Partial<StoryConnection>) => {
    const node = get().currentStory?.nodes.find(n => n.id === nodeId);
    if (node) {
      get().updateNode(nodeId, {
        connections: node.connections.map(conn =>
          conn.id === connectionId ? { ...conn, ...updates } : conn
        ),
      });
    }
  },

  validateNode: (nodeId: string) => {
    const { currentStory } = get();
    if (!currentStory) {
      return { hasParent: false, hasChoices: false, hasValidTargets: false, issues: ['No story loaded'] };
    }

    const node = currentStory.nodes.find(n => n.id === nodeId);
    if (!node) {
      return { hasParent: false, hasChoices: false, hasValidTargets: false, issues: ['Node not found'] };
    }

    const issues: string[] = [];
    
    // Check if node has parent connection (except intro nodes which are entry points)
    const hasParent = node.type === 'intro' || currentStory.nodes.some(n => 
      n.connections.some(conn => conn.targetNodeId === nodeId)
    );
    
    if (!hasParent) {
      issues.push('Node is unreachable - no connections lead to this node');
    }

    // Check if node has outgoing choices (except end nodes which terminate the story)
    const hasChoices = node.type === 'end' || node.connections.length > 0;
    
    if (!hasChoices) {
      issues.push('Node has no player choices - story will end here unexpectedly');
    }

    // Validate that all connections point to existing nodes
    const hasValidTargets = node.connections.every(conn => 
      currentStory.nodes.some(n => n.id === conn.targetNodeId)
    );
    
    if (!hasValidTargets) {
      issues.push('Some choices point to nodes that no longer exist');
    }

    // Check for empty required fields
    if (!node.data.name || node.data.name.trim() === '') {
      issues.push('Node name is required');
    }
    
    if (!node.data.description || node.data.description.trim() === '') {
      issues.push('Node description is required');
    }

    return { hasParent, hasChoices, hasValidTargets, issues };
  },

  startSimulation: (storyId: string) => {
    const story = get().stories.find(s => s.id === storyId);
    if (!story || story.nodes.length === 0) return;

    const startNode = story.nodes.find(node => node.type === 'intro');
    if (!startNode) return;

    const simulation: StorySimulation = {
      id: `sim-${Date.now()}`,
      storyId,
      status: 'running',
      currentNodeId: startNode.id,
      steps: [{
        nodeId: startNode.id,
        timestamp: Date.now(),
        status: 'active',
      }],
      startTime: Date.now(),
    };

    set({ simulation });
  },

  pauseSimulation: () => {
    set(state => ({
      simulation: state.simulation
        ? { ...state.simulation, status: 'paused' }
        : null,
    }));
  },

  resumeSimulation: () => {
    set(state => ({
      simulation: state.simulation
        ? { ...state.simulation, status: 'running' }
        : null,
    }));
  },

  stopSimulation: () => {
    set(state => ({
      simulation: state.simulation
        ? {
            ...state.simulation,
            status: 'completed',
            endTime: Date.now(),
          }
        : null,
    }));
  },

  stepSimulation: () => {
    const { simulation, currentStory } = get();
    if (!simulation || !currentStory || simulation.status !== 'running') return;

    const currentNode = currentStory.nodes.find(n => n.id === simulation.currentNodeId);
    if (!currentNode) return;

    // Mark current step as completed
    const updatedSteps = simulation.steps.map(step =>
      step.nodeId === simulation.currentNodeId && step.status === 'active'
        ? { ...step, status: 'completed' as const }
        : step
    );

    // Move to next node if connections exist
    if (currentNode.connections.length > 0) {
      const nextConnection = currentNode.connections[0]; // For simplicity, take first connection
      const nextNodeId = nextConnection.targetNodeId;

      updatedSteps.push({
        nodeId: nextNodeId,
        timestamp: Date.now(),
        status: 'active',
      });

      set({
        simulation: {
          ...simulation,
          currentNodeId: nextNodeId,
          steps: updatedSteps,
        },
      });
    } else {
      // No more connections, end simulation
      set({
        simulation: {
          ...simulation,
          status: 'completed',
          steps: updatedSteps,
          endTime: Date.now(),
        },
      });
    }
  },
}));