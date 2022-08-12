import { Edge, Node } from 'react-flow-renderer';
import dagre from 'dagre';

import {
  defaultNodeHeight,
  defaultNodeWidth,
  NodeStatusConfig,
  rootCoordinate,
} from '@/config/hierarchyTreeConfig';
import { IDiagramData, NodeData } from '@/interface/interfaceHierarchyTree';

/**
 * Generate Nodes & Edges (Connections) configs for HierarchyTree component to draw a hierarchy tree diagram.
 * @param {IDiagramData[]} diagramData processed raw flattend diagram data from server.
 *
 * @implements How to shows 2-way⚡ connection without using custom node with `<Handler />` or change the order of nodes:
 * Add `connectionFlow` or just using CSS via `edgeStyle` to **reverse** the animation direction instead.
 *
 * `edgeStyle` has higher priority. `edgeStyle` and `connectionFlow` of each "special connection" will override the related common styles of that node.
 *
 * @notes The "special" connections are "Edges" with the source id and target id of <Handler /> already defined. [Docs](https://reactflow.dev/docs/guides/custom-nodes/).
 */
export const handleDiagramData = (
  diagramData: IDiagramData[],
): { initialNodes: Node<NodeData>[]; initialEdges: Edge[] } => {
  const initialNodes: Node<NodeData>[] = [];
  const initialEdges: Edge[] = [];

  diagramData.forEach((eachRecord) => {
    const nodeStatusConfig = getNodeStatusDataByStatus(eachRecord.nodeStatus);
    initialNodes.push({
      id: eachRecord.id,
      data: {
        label: eachRecord.label,
      },
      type: eachRecord.type,
      position: rootCoordinate,
      className: `status--${nodeStatusConfig?.color || 'default'} ${
        nodeStatusConfig?.className ? 'react-flow__node--' + nodeStatusConfig?.className : ''
      }`,
    });

    if (!eachRecord.source) {
      return;
    }

    if (Array.isArray(eachRecord.source)) {
      // Multiple Edges/Connections, normal and special connections.
      eachRecord.source.forEach((sourceConnections, index) => {
        // The first source connection must be a normal connection (parent-child).
        initialEdges.push({
          id: `e${eachRecord.source}-${eachRecord.id}-${index}`,
          source: sourceConnections.id,
          target: eachRecord.id,
          sourceHandle: index === 0 ? undefined : `hs-${sourceConnections.id}`,
          targetHandle: index === 0 ? undefined : `ht-${eachRecord.id}`,
          animated: sourceConnections.edgeAnimated,
          style: {
            animationDirection: sourceConnections.connectionFlow,
            ...sourceConnections.edgeStyle,
          },
        });
      });
      return;
    }

    // Single normal Edges/Connections
    initialEdges.push({
      id: `e${eachRecord.source}-${eachRecord.id}`,
      source: eachRecord.source,
      target: eachRecord.id,
      animated: eachRecord.edgeAnimated,
      style: { animationDirection: eachRecord.connectionFlow, ...eachRecord.edgeStyle },
    });
  });
  return { initialNodes, initialEdges };
};

// Handle auto layout/positions for every nodes
export const processAutoLayoutDiagram = (initialNodes: Node<NodeData>[], initialEdges: Edge[]) => {
  const skeletonEdges = initialEdges.filter((e) => !e.targetHandle && !e.sourceHandle);

  const dagreGraph = new dagre.graphlib.Graph(); // compound graph has bugs, since dagrejs is no longer maintained, don't use it.
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({});
  initialNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: defaultNodeWidth, height: defaultNodeHeight });

    // if need to setParent, enable compound graph (compound: true)
    // if (node.parentNode) {
    //   dagreGraph.setParent(node.id, node.parentNode);
    // }
  });

  skeletonEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);

    // for multigraph:
    // dagreGraph.setEdge({
    //   v: edge.source,
    //   w: edge.target,
    //   name: `dagre-e${edge.source}-${edge.target}-${index}`,
    // });
  });

  dagre.layout(dagreGraph);

  return initialNodes.map((nodeConfig) => {
    const { x, y } = dagreGraph.node(nodeConfig.id);

    return {
      ...nodeConfig,
      position: { x: x / 1.2, y: y + defaultNodeHeight },
    };
  });
};

/**
 *
 * @param status node status config
 * @returns {IStatusConfig | undefined} status config.
 */
export const getNodeStatusDataByStatus = (status?: number) => {
  return NodeStatusConfig.find((statusConfig) => statusConfig.status === status);
};

/**
 *
 * @param statusKey key of node status config
 * @returns {IStatusConfig | undefined} status config.
 */
export const getNodeStatusDataByKey = (statusKey: string) => {
  return NodeStatusConfig.find((statusConfig) => statusConfig.key === statusKey);
};
