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
import { StoryNode } from '../types/flow.types';

interface FlowEditorProps {
  onNodeClick?: (node: StoryNode) => void;
}

export const FlowEditor: React.FC<FlowEditorProps> = ({ onNodeClick }) => {
  const { currentStory, updateNode, selectNode, validateNode } = useAdminFlowController();

  // Convert StoryNode to ReactFlow Node
  const convertToReactFlowNodes = (storyNodes: StoryNode[]): Node[] => {
    return storyNodes.map(node => {
      const validation = validateNode(node.id);
      const hasIssues = validation.issues.length > 0;
      const hasWarnings = !validation.hasChoices && node.type !== 'end';

      return {
        id: node.id,
        type: 'default',
        position: node.position,
        data: {
          label: typeof node.data.name === 'string' ? node.data.name : String(node.data.name || 'Untitled Node'),
        },
        style: {
          backgroundColor: getNodeColor(node.type),
          border: hasIssues
            ? '3px solid #ef4444'
            : hasWarnings
            ? '2px solid #f59e0b'
            : '2px solid #374151',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '120px',
          textAlign: 'center',
          boxShadow: hasIssues
            ? '0 0 10px rgba(239, 68, 68, 0.5)'
            : hasWarnings
            ? '0 0 8px rgba(245, 158, 11, 0.3)'
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
        },
        className: hasIssues
          ? 'node-error'
          : hasWarnings
          ? 'node-warning'
          : '',
      };
    });
  };

  // Convert connections to ReactFlow edges
  const convertToReactFlowEdges = (storyNodes: StoryNode[]): Edge[] => {
    const edges: Edge[] = [];

    storyNodes.forEach(node => {
      node.connections.forEach(connection => {
        const targetExists = storyNodes.some(n => n.id === connection.targetNodeId);
        edges.push({
          id: connection.id,
          source: node.id,
          target: connection.targetNodeId,
          label: connection.label,
          animated: true,
          style: {
            stroke: targetExists ? '#6366f1' : '#ef4444',
            strokeWidth: 2,
            strokeDasharray: targetExists ? 'none' : '5,5',
          },
          labelStyle: { fontSize: '12px', fontWeight: 'bold' },
        });
      });
    });

    return edges;
  };

  const getNodeColor = (type: StoryNode['type']): string => {
    switch (type) {
      case 'intro': return '#10b981';
      case 'script': return '#3b82f6';
      case 'end': return '#ef4444';
      case 'custom': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(
    currentStory ? convertToReactFlowNodes(currentStory.nodes) : []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    currentStory ? convertToReactFlowEdges(currentStory.nodes) : []
  );

  // Update nodes and edges when currentStory changes
  useEffect(() => {
    if (currentStory) {
      setNodes(convertToReactFlowNodes(currentStory.nodes));
      setEdges(convertToReactFlowEdges(currentStory.nodes));
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [currentStory, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const onNodeClickHandler = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const storyNode = currentStory?.nodes.find(n => n.id === node.id);
      if (storyNode) {
        selectNode(storyNode);
        onNodeClick?.(storyNode);
      }
    },
    [currentStory, selectNode, onNodeClick]
  );

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      updateNode(node.id, { position: node.position });
    },
    [updateNode]
  );

  if (!currentStory) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Story Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Create or select a story to start editing
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
