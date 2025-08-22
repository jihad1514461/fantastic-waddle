import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Story, StoryNode, StoryChoice, StoryNodeType } from '../types/story.types';
import { storyApi } from '../controllers/StoryManagementController';

interface FlowSimStep { 
  nodeId: string; 
  status: 'inactive' | 'active' | 'completed' | 'error'; 
  timestamp: number; 
}

interface Simulation {
  status: 'idle' | 'running' | 'paused' | 'completed';
  currentNodeId?: string;
  steps: FlowSimStep[];
  startTime: number;
}

interface AdminFlowState {
  stories: Story[];
  currentStory: Story | null;
  selectedNode: StoryNode | null;
  simulation: Simulation | null;

  // Story management
  loadStories: () => Promise<void>;
  setCurrentStory: (story: Story | null) => void;
  createStory: (name: string, description?: string) => Promise<void>;

  // Node management
  addNode: (type: StoryNodeType, position: {x:number;y:number}) => Promise<void>;
  updateNodeBasic: (nodeId: string, updates: { title?: string; description?: string; type?: StoryNodeType }) => Promise<void>;
  updateNodePosition: (nodeId: string, position: {x: number; y: number}) => Promise<void>;
  deleteNode: (nodeId: string) => Promise<void>;
  selectNode: (node: StoryNode | null) => void;

  // Choice management
  addChoice: (nodeId: string, c: Omit<StoryChoice, 'id'>) => Promise<void>;
  updateChoice: (nodeId: string, choiceId: string, updates: Partial<StoryChoice>) => Promise<void>;
  removeChoice: (nodeId: string, choiceId: string) => Promise<void>;

  // Simulation methods
  startSimulation: (storyId: string) => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  stopSimulation: () => void;
  stepSimulation: () => void;
  chooseSimulationPath: (choiceId: string) => void;
}

export const useAdminFlowController = create<AdminFlowState>((set, get) => ({
  stories: [],
  currentStory: null,
  selectedNode: null,
  simulation: null,

  // Story management
  loadStories: async () => {
    const stories = await storyApi.list();
    set({ stories, currentStory: stories[0] ?? null });
  },

  setCurrentStory: (story) => set({ currentStory: story, selectedNode: null, simulation: null }),

  createStory: async (name, description) => {
    // 1) create story
    const story = await storyApi.create({ name, description });

    // 2) auto-create default Intro node
    const introNode: Partial<StoryNode> = {
      type: 'intro',
      position: { x: 200, y: 150 },
      data: {
        title: 'Intro',
        description: 'This is the introduction.',
      },
      choices: [],
    };
    const createdIntro = await storyApi.addNode(story.id, introNode);

    const fresh = { ...story, nodes: [createdIntro] } as Story;
    set((s) => ({ stories: [fresh, ...s.stories], currentStory: fresh }));
  },

  // Node management
  addNode: async (type, position) => {
    const cs = get().currentStory;
    if (!cs) return;

    const node: Partial<StoryNode> = {
      type,
      position,
      data: {
        title: type === 'script' ? 'Script' : type === 'end' ? 'End' : 'Intro',
        description: '',
      },
      choices: [],
    };
    const created = await storyApi.addNode(cs.id, node);

    const updated = { ...cs, nodes: [...(Array.isArray(cs.nodes) ? cs.nodes : []), created] };
    set((s) => ({
      stories: s.stories.map(st => st.id === cs.id ? updated : st),
      currentStory: updated,
    }));
  },

  updateNodeBasic: async (nodeId, updates) => {
    const cs = get().currentStory;
    if (!cs || !Array.isArray(cs.nodes)) return;
    const node = cs.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const patched: Partial<StoryNode> = {
      type: updates.type ?? node.type,
      data: {
        title: updates.title ?? node.data.title,
        description: updates.description ?? node.data.description,
      },
    };

    const saved = await storyApi.updateNode(cs.id, nodeId, patched);

    const updated = {
      ...cs,
      nodes: cs.nodes.map(n => n.id === nodeId ? saved : n),
    };
    set((s) => ({
      stories: s.stories.map(st => st.id === cs.id ? updated : st),
      currentStory: updated,
      selectedNode: saved,
    }));
  },

  updateNodePosition: async (nodeId: string, position: {x: number; y: number}) => {
    const cs = get().currentStory;
    if (!cs || !Array.isArray(cs.nodes)) return;
    
    const patched: Partial<StoryNode> = { position };
    const saved = await storyApi.updateNode(cs.id, nodeId, patched);

    const updated = {
      ...cs,
      nodes: cs.nodes.map(n => n.id === nodeId ? saved : n),
    };
    set((s) => ({
      stories: s.stories.map(st => st.id === cs.id ? updated : st),
      currentStory: updated,
    }));
  },

  deleteNode: async (nodeId) => {
    const cs = get().currentStory;
    if (!cs || !Array.isArray(cs.nodes)) return;
    await storyApi.deleteNode(cs.id, nodeId);
    const updated = { ...cs, nodes: cs.nodes.filter(n => n.id !== nodeId) };
    set((s) => ({
      stories: s.stories.map(st => st.id === cs.id ? updated : st),
      currentStory: updated,
      selectedNode: null,
    }));
  },

  selectNode: (node) => set({ selectedNode: node }),

  // Choice management
  addChoice: async (nodeId, c) => {
    const cs = get().currentStory;
    if (!cs || !Array.isArray(cs.nodes)) return;
    const node = cs.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const next = { ...node, choices: [...node.choices, { ...c, id: nanoid() }] };
    const saved = await storyApi.updateChoices(cs.id, nodeId, next.choices);

    const updatedStory = {
      ...cs,
      nodes: cs.nodes.map(n => n.id === nodeId ? saved : n),
    };
    set((s) => ({
      stories: s.stories.map(st => st.id === cs.id ? updatedStory : st),
      currentStory: updatedStory,
      selectedNode: saved,
    }));
  },

  updateChoice: async (nodeId, choiceId, updates) => {
    const cs = get().currentStory;
    if (!cs || !Array.isArray(cs.nodes)) return;
    const node = cs.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const choices = node.choices.map(ch => ch.id === choiceId ? { ...ch, ...updates } : ch);
    const saved = await storyApi.updateChoices(cs.id, nodeId, choices);
    const updatedStory = {
      ...cs,
      nodes: cs.nodes.map(n => n.id === nodeId ? saved : n),
    };
    set((s) => ({
      stories: s.stories.map(st => st.id === cs.id ? updatedStory : st),
      currentStory: updatedStory,
      selectedNode: saved,
    }));
  },

  removeChoice: async (nodeId, choiceId) => {
    const cs = get().currentStory;
    if (!cs || !Array.isArray(cs.nodes)) return;
    const node = cs.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const choices = node.choices.filter(ch => ch.id !== choiceId);
    const saved = await storyApi.updateChoices(cs.id, nodeId, choices);
    const updatedStory = {
      ...cs,
      nodes: cs.nodes.map(n => n.id === nodeId ? saved : n),
    };
    set((s) => ({
      stories: s.stories.map(st => st.id === cs.id ? updatedStory : st),
      currentStory: updatedStory,
      selectedNode: saved,
    }));
  },

  // Simulation methods
  startSimulation: (storyId: string) => {
    const stories = get().stories;
    const story = Array.isArray(stories) ? stories.find(s => s.id === storyId) : undefined;
    if (!story) return;
    
    // Find intro node
    const introNode = Array.isArray(story.nodes) ? story.nodes.find(n => n.type === 'intro') : undefined;
    if (!introNode) return;
    
    set({
      simulation: {
        status: 'running',
        currentNodeId: introNode.id,
        steps: [{
          nodeId: introNode.id,
          status: 'active',
          timestamp: Date.now()
        }],
        startTime: Date.now()
      }
    });
  },

  pauseSimulation: () => {
    const sim = get().simulation;
    if (sim && sim.status === 'running') {
      set({
        simulation: { ...sim, status: 'paused' }
      });
    }
  },

  resumeSimulation: () => {
    const sim = get().simulation;
    if (sim && sim.status === 'paused') {
      set({
        simulation: { ...sim, status: 'running' }
      });
    }
  },

  stopSimulation: () => {
    set({ simulation: null });
  },

  stepSimulation: () => {
    const { simulation, currentStory } = get();
    if (!simulation || !currentStory || !Array.isArray(currentStory.nodes) || !simulation.currentNodeId) return;
    
    const currentNode = currentStory.nodes.find(n => n.id === simulation.currentNodeId);
    if (!currentNode) return;
    
    // Mark current as completed
    const updatedSteps = simulation.steps.map(step => 
      step.nodeId === simulation.currentNodeId 
        ? { ...step, status: 'completed' as const }
        : step
    );
    
    // If node has choices, simulation pauses for user choice
    if (currentNode.choices.length > 0) {
      set({
        simulation: {
          ...simulation,
          status: 'paused',
          steps: updatedSteps
        }
      });
      return;
    }
    
    // If end node or no connections, complete simulation
    if (currentNode.type === 'end' || currentNode.choices.length === 0) {
      set({
        simulation: {
          ...simulation,
          status: 'completed',
          steps: updatedSteps,
          currentNodeId: undefined
        }
      });
      return;
    }
    
    // Auto-advance if only one choice with nextNodeId
    const firstChoice = currentNode.choices[0];
    if (firstChoice?.nextNodeId) {
      const nextStep = {
        nodeId: firstChoice.nextNodeId,
        status: 'active' as const,
        timestamp: Date.now()
      };
      
      set({
        simulation: {
          ...simulation,
          currentNodeId: firstChoice.nextNodeId,
          steps: [...updatedSteps, nextStep]
        }
      });
    }
  },

  chooseSimulationPath: (choiceId: string) => {
    const { simulation, currentStory } = get();
    if (!simulation || !currentStory || !Array.isArray(currentStory.nodes) || !simulation.currentNodeId) return;
    
    const currentNode = currentStory.nodes.find(n => n.id === simulation.currentNodeId);
    const choice = currentNode?.choices.find(c => c.id === choiceId);
    
    if (!choice?.nextNodeId) return;
    
    // Mark current as completed and move to next
    const updatedSteps = simulation.steps.map(step => 
      step.nodeId === simulation.currentNodeId 
        ? { ...step, status: 'completed' as const }
        : step
    );
    
    const nextStep = {
      nodeId: choice.nextNodeId,
      status: 'active' as const,
      timestamp: Date.now()
    };
    
    set({
      simulation: {
        ...simulation,
        status: 'running',
        currentNodeId: choice.nextNodeId,
        steps: [...updatedSteps, nextStep]
      }
    });
  },
}));