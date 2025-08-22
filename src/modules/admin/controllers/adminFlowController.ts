import { create } from 'zustand';
import { FlowNode, FlowConnection, AdminFlow, FlowSimulation, FlowSimulationStep } from '../types/flow.types';
import { storageService } from '../../../services/storageService';

interface AdminFlowController {
  flows: AdminFlow[];
  currentFlow: AdminFlow | null;
  selectedNode: FlowNode | null;
  simulation: FlowSimulation | null;
  
  // Flow management
  createFlow: (name: string, description: string) => AdminFlow;
  updateFlow: (flowId: string, updates: Partial<AdminFlow>) => void;
  deleteFlow: (flowId: string) => void;
  setCurrentFlow: (flow: AdminFlow | null) => void;
  loadFlows: () => void;
  saveFlows: () => void;
  
  // Node management
  addNode: (type: FlowNode['type'], position: { x: number; y: number }) => FlowNode;
  updateNode: (nodeId: string, updates: Partial<FlowNode>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (node: FlowNode | null) => void;
  
  // Connection management
  addConnection: (nodeId: string, connection: Omit<FlowConnection, 'id'>) => void;
  removeConnection: (nodeId: string, connectionId: string) => void;
  updateConnection: (nodeId: string, connectionId: string, updates: Partial<FlowConnection>) => void;
  
  // Simulation
  startSimulation: (flowId: string) => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  stopSimulation: () => void;
  stepSimulation: () => void;
}

export const useAdminFlowController = create<AdminFlowController>((set, get) => ({
  flows: [],
  currentFlow: null,
  selectedNode: null,
  simulation: null,

  createFlow: (name: string, description: string) => {
    const newFlow: AdminFlow = {
      id: `flow-${Date.now()}`,
      name,
      description,
      nodes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin',
      isActive: true,
    };

    set(state => ({
      flows: [...state.flows, newFlow],
      currentFlow: newFlow,
    }));

    get().saveFlows();
    return newFlow;
  },

  updateFlow: (flowId: string, updates: Partial<AdminFlow>) => {
    set(state => ({
      flows: state.flows.map(flow =>
        flow.id === flowId
          ? { ...flow, ...updates, updatedAt: new Date().toISOString() }
          : flow
      ),
      currentFlow: state.currentFlow?.id === flowId
        ? { ...state.currentFlow, ...updates, updatedAt: new Date().toISOString() }
        : state.currentFlow,
    }));
    get().saveFlows();
  },

  deleteFlow: (flowId: string) => {
    set(state => ({
      flows: state.flows.filter(flow => flow.id !== flowId),
      currentFlow: state.currentFlow?.id === flowId ? null : state.currentFlow,
    }));
    get().saveFlows();
  },

  setCurrentFlow: (flow: AdminFlow | null) => {
    set({ currentFlow: flow, selectedNode: null });
  },

  loadFlows: () => {
    const savedFlows = storageService.get<AdminFlow[]>('admin-flows') || [];
    set({ flows: savedFlows });
  },

  saveFlows: () => {
    const { flows } = get();
    storageService.set('admin-flows', flows);
  },

  addNode: (type: FlowNode['type'], position: { x: number; y: number }) => {
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type,
      position,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        description: '',
      },
      connections: [],
    };

    const { currentFlow } = get();
    if (currentFlow) {
      const updatedFlow = {
        ...currentFlow,
        nodes: [...currentFlow.nodes, newNode],
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        flows: state.flows.map(flow =>
          flow.id === currentFlow.id ? updatedFlow : flow
        ),
        currentFlow: updatedFlow,
      }));

      get().saveFlows();
    }

    return newNode;
  },

  updateNode: (nodeId: string, updates: Partial<FlowNode>) => {
    const { currentFlow } = get();
    if (currentFlow) {
      const updatedFlow = {
        ...currentFlow,
        nodes: currentFlow.nodes.map(node =>
          node.id === nodeId ? { ...node, ...updates } : node
        ),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        flows: state.flows.map(flow =>
          flow.id === currentFlow.id ? updatedFlow : flow
        ),
        currentFlow: updatedFlow,
        selectedNode: state.selectedNode?.id === nodeId
          ? { ...state.selectedNode, ...updates }
          : state.selectedNode,
      }));

      get().saveFlows();
    }
  },

  deleteNode: (nodeId: string) => {
    const { currentFlow } = get();
    if (currentFlow) {
      const updatedFlow = {
        ...currentFlow,
        nodes: currentFlow.nodes.filter(node => node.id !== nodeId),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        flows: state.flows.map(flow =>
          flow.id === currentFlow.id ? updatedFlow : flow
        ),
        currentFlow: updatedFlow,
        selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode,
      }));

      get().saveFlows();
    }
  },

  selectNode: (node: FlowNode | null) => {
    set({ selectedNode: node });
  },

  addConnection: (nodeId: string, connection: Omit<FlowConnection, 'id'>) => {
    const newConnection: FlowConnection = {
      ...connection,
      id: `conn-${Date.now()}`,
    };

    get().updateNode(nodeId, {
      connections: [
        ...(get().currentFlow?.nodes.find(n => n.id === nodeId)?.connections || []),
        newConnection,
      ],
    });
  },

  removeConnection: (nodeId: string, connectionId: string) => {
    const node = get().currentFlow?.nodes.find(n => n.id === nodeId);
    if (node) {
      get().updateNode(nodeId, {
        connections: node.connections.filter(conn => conn.id !== connectionId),
      });
    }
  },

  updateConnection: (nodeId: string, connectionId: string, updates: Partial<FlowConnection>) => {
    const node = get().currentFlow?.nodes.find(n => n.id === nodeId);
    if (node) {
      get().updateNode(nodeId, {
        connections: node.connections.map(conn =>
          conn.id === connectionId ? { ...conn, ...updates } : conn
        ),
      });
    }
  },

  startSimulation: (flowId: string) => {
    const flow = get().flows.find(f => f.id === flowId);
    if (!flow || flow.nodes.length === 0) return;

    const startNode = flow.nodes.find(node => node.type === 'start');
    if (!startNode) return;

    const simulation: FlowSimulation = {
      id: `sim-${Date.now()}`,
      flowId,
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
    const { simulation, currentFlow } = get();
    if (!simulation || !currentFlow || simulation.status !== 'running') return;

    const currentNode = currentFlow.nodes.find(n => n.id === simulation.currentNodeId);
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