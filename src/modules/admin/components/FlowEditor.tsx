import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAdminFlowController } from '../controllers/adminFlowController';
import { FlowNode } from '../types/flow.types';

interface FlowEditorProps {
  onNodeClick?: (node: FlowNode) => void;
}

export const FlowEditor: React.FC<FlowEditorProps> = ({ onNodeClick }) => {
  const { currentFlow, updateNode, selectNode } = useAdminFlowController();

  // Convert FlowNode to ReactFlow Node
  const convertToReactFlowNodes = (flowNodes: FlowNode[]): Node[] => {
    return flowNodes.map(node => ({
      id: node.id,
      type: 'default',
      position: node.position,
      data: {
        label: node.data.label,
        nodeType: node.type,
      },
      style: {
        backgroundColor: getNodeColor(node.type),
        border: '2px solid #374151',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '120px',
        textAlign: 'center',
      },
    }));
  };

  // Convert connections to ReactFlow edges
  const convertToReactFlowEdges = (flowNodes: FlowNode[]): Edge[] => {
    const edges: Edge[] = [];
    
    flowNodes.forEach(node => {
      node.connections.forEach(connection => {
        edges.push({
          id: connection.id,
          source: node.id,
          target: connection.targetNodeId,
          label: connection.label,
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
          labelStyle: { fontSize: '12px', fontWeight: 'bold' },
        });
      });
    });

    return edges;
  };

  const getNodeColor = (type: FlowNode['type']): string => {
    switch (type) {
      case 'start': return '#10b981';
      case 'process': return '#3b82f6';
      case 'decision': return '#f59e0b';
      case 'end': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(
    currentFlow ? convertToReactFlowNodes(currentFlow.nodes) : []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    currentFlow ? convertToReactFlowEdges(currentFlow.nodes) : []
  );

  // Update nodes and edges when currentFlow changes
  useEffect(() => {
    if (currentFlow) {
      setNodes(convertToReactFlowNodes(currentFlow.nodes));
      setEdges(convertToReactFlowEdges(currentFlow.nodes));
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [currentFlow, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const onNodeClickHandler = useCallback((event: React.MouseEvent, node: Node) => {
    const flowNode = currentFlow?.nodes.find(n => n.id === node.id);
    if (flowNode) {
      selectNode(flowNode);
      onNodeClick?.(flowNode);
    }
  }, [currentFlow, selectNode, onNodeClick]);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    updateNode(node.id, { position: node.position });
  }, [updateNode]);

  if (!currentFlow) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Flow Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Create or select a flow to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClickHandler}
        onNodeDragStop={onNodeDragStop}
        fitView
        className="bg-gray-50 dark:bg-gray-800"
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};