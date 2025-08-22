import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
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
import { useAdminFlowController } from '../controllers/adminMainFlowController';
import { StoryNode } from '../types/story.types';

interface FlowEditorProps {
  onNodeClick?: (node: StoryNode) => void;
}

// Node color mapping based on StoryNodeType
const getNodeColor = (type: StoryNode['type']): string => {
  switch (type) {
    case 'intro':
      return '#10b981'; // green
    case 'script':
      return '#3b82f6'; // blue
    case 'end':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

// Convert StoryNode -> ReactFlow Node
const convertToReactFlowNodes = (storyNodes: StoryNode[]): Node[] => {
  if (!Array.isArray(storyNodes)) return [];
  return storyNodes.map((node) => ({
    id: node.id,
    type: 'default',
    position: node.position,
    data: {
      label: node.data.title,
      nodeType: node.type,
    },
    style: {
      backgroundColor: getNodeColor(node.type),
      border: '2px solid #374151',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '120px',
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
  }));
};

// Convert StoryNode choices -> ReactFlow edges
const convertToReactFlowEdges = (storyNodes: StoryNode[]): Edge[] => {
  const edges: Edge[] = [];
  
  if (!Array.isArray(storyNodes)) return edges;

  storyNodes.forEach((node) => {
    node.choices.forEach((choice) => {
      // Only create edge if nextNodeId exists
      if (choice.nextNodeId) {
        edges.push({
          id: `${node.id}-${choice.id}`,
          source: node.id,
          target: choice.nextNodeId,
          label: choice.name,
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
          labelStyle: { fontSize: '12px', fontWeight: 'bold', fill: '#111827' },
        });
      }
    });
  });

  return edges;
};

export const FlowEditor: React.FC<FlowEditorProps> = ({ onNodeClick }) => {
  const { currentStory, updateNodePosition, selectNode } = useAdminFlowController();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    currentStory && Array.isArray(currentStory.nodes) ? convertToReactFlowNodes(currentStory.nodes) : []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    currentStory && Array.isArray(currentStory.nodes) ? convertToReactFlowEdges(currentStory.nodes) : []
  );

  // Update when currentStory changes
  useEffect(() => {
    if (currentStory && Array.isArray(currentStory.nodes)) {
      setNodes(convertToReactFlowNodes(currentStory.nodes));
      setEdges(convertToReactFlowEdges(currentStory.nodes));
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [currentStory, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // For now, just add the visual edge
      // In a full implementation, you'd want to update the story data
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeClickHandler = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const storyNode = Array.isArray(currentStory?.nodes) ? currentStory?.nodes.find((n) => n.id === node.id) : undefined;
      if (storyNode) {
        selectNode(storyNode);
        onNodeClick?.(storyNode);
      }
    },
    [currentStory, selectNode, onNodeClick]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      // Update the node position in the story
      if (updateNodePosition) {
        updateNodePosition(node.id, node.position);
      }
    },
    [updateNodePosition]
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
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};