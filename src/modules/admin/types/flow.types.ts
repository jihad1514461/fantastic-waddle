export interface StoryNode {
  id: string;
  type: 'intro' | 'script' | 'end' | 'custom';
  position: { x: number; y: number };
  data: {
    name: string;
    description: string;
    image?: string;
    properties?: Record<string, any>;
  };
  connections: StoryConnection[];
}

export interface StoryConnection {
  id: string;
  targetNodeId: string;
  label: string;
  condition?: string;
}

export interface StorySimulationStep {
  nodeId: string;
  timestamp: number;
  status: 'pending' | 'active' | 'completed' | 'error';
  data?: any;
}

export interface StorySimulation {
  id: string;
  storyId: string;
  status: 'running' | 'paused' | 'completed' | 'error';
  currentNodeId: string | null;
  steps: StorySimulationStep[];
  startTime: number;
  endTime?: number;
}

export interface Story {
  id: string;
  name: string;
  description: string;
  nodes: StoryNode[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isActive: boolean;
}

// Keep old types for backward compatibility
export type FlowNode = StoryNode;
export type FlowConnection = StoryConnection;
export type FlowSimulationStep = StorySimulationStep;
export type FlowSimulation = StorySimulation;
export type AdminFlow = Story;