import { useEffect, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  useReactFlow,
} from 'react-flow-renderer';

import useGlobalStore from '@/store';
import { handleDiagramData, processAutoLayoutDiagram } from '@/helper/hierarchyTreeHelper';

import { HierarchyNodeCustom } from './HierarchyNodeCustom';

import './HierarchyTree.scss';

export const HierarchyTreeCanvas = ({ hideAttribution }: { hideAttribution: boolean }) => {
  const rawDiagramData = useGlobalStore((state) => state.rawDiagramData);

  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onInit = (_: ReactFlowInstance | undefined) => {
    // Execute when diagram is ready
  };

  const nodeTypes = useMemo(() => ({ customNode: HierarchyNodeCustom }), []);

  // Reflect diagram data changes instantly depend on rawDiagramData props of HierarchyTree parent component.
  useEffect(() => {
    const { initialNodes, initialEdges } = handleDiagramData(rawDiagramData);
    setNodes(processAutoLayoutDiagram(initialNodes, initialEdges));
    setEdges(initialEdges);

    setTimeout(() => {
      fitView({ duration: 500 });
    }, 200);
  }, [rawDiagramData]);

  return (
    <ReactFlow
      className={hideAttribution ? 'react-flow__white-censor' : ''}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={onInit}
      fitView
      elementsSelectable={false}
      nodesDraggable={false}
      nodesConnectable={false}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={{ type: 'straight' }}
    >
      <Controls showInteractive={false} />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};
