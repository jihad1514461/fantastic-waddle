export interface FlowNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    properties?: Record<string, any>;
  };
  connections: FlowConnection[];
}

export interface FlowConnection {
  id: string;
  targetNodeId: string;
  label: string;
  condition?: string;
}

export interface FlowSimulationStep {
  nodeId: string;
  timestamp: number;
  status: 'pending' | 'active' | 'completed' | 'error';
  data?: any;
}

export interface FlowSimulation {
  id: string;
  flowId: string;
  status: 'running' | 'paused' | 'completed' | 'error';
  currentNodeId: string | null;
  steps: FlowSimulationStep[];
  startTime: number;
  endTime?: number;
}

export interface AdminFlow {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isActive: boolean;
}