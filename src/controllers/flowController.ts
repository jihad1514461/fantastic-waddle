import { create } from 'zustand';
import { Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { FlowNode, FlowEdge } from '../types';

interface FlowController {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: any) => void;
  addNode: (nodeData: Partial<FlowNode>) => void;
  updateNode: (nodeId: string, data: Partial<FlowNode['data']>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (node: Node | null) => void;
  clearFlow: () => void;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 100 },
    data: { label: 'Start Node' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 250, y: 250 },
    data: { label: 'Process Node' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
];

export const useFlowController = create<FlowController>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,

  setNodes: (nodes: Node[]) => set({ nodes }),
  
  setEdges: (edges: Edge[]) => set({ edges }),

  onNodesChange: (changes: any[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: any[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: any) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addNode: (nodeData: Partial<FlowNode>) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'default',
      position: nodeData.position || { x: Math.random() * 500, y: Math.random() * 500 },
      data: { 
        label: nodeData.data?.label || 'New Node',
        ...nodeData.data 
      },
    };

    set({ nodes: [...get().nodes, newNode] });
  },

  updateNode: (nodeId: string, data: Partial<FlowNode['data']>) => {
    const nodes = get().nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    );
    set({ nodes });
  },

  deleteNode: (nodeId: string) => {
    const nodes = get().nodes.filter((node) => node.id !== nodeId);
    const edges = get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
    set({ nodes, edges });
  },

  selectNode: (node: Node | null) => set({ selectedNode: node }),

  clearFlow: () => {
    set({ nodes: [], edges: [], selectedNode: null });
  },
}));