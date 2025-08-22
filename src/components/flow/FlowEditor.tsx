import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowController } from '../../controllers/flowController';

export const FlowEditor: React.FC = () => {
  const { 
    nodes: controllerNodes, 
    edges: controllerEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useFlowController();

  const [nodes, , onNodesChangeLocal] = useNodesState(controllerNodes);
  const [edges, , onEdgesChangeLocal] = useEdgesState(controllerEdges);

  const onConnectLocal = useCallback((params: Connection | Edge) => {
    onConnect(params);
  }, [onConnect]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          onNodesChangeLocal(changes);
          onNodesChange(changes);
        }}
        onEdgesChange={(changes) => {
          onEdgesChangeLocal(changes);
          onEdgesChange(changes);
        }}
        onConnect={onConnectLocal}
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