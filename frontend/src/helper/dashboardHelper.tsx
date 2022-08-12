import { getNodeStatusDataByKey } from './hierarchyTreeHelper';
import {
  ENodeStatus,
  IDiagramData,
  IDiagramDataCommon,
  IDiagramResData,
} from '@/interface/interfaceHierarchyTree';
import { IListEvent } from '@/interface/interfaceListEvent';

export const themeRedDark = 'var(--theme-red-dark)';
export const diagramRootID = 'center';

/**
 *
 * @param rawData the relationship res. data from BE.
 * @returns flattened data with the same format as `diagramDemoData`.
 *
 * @note The 🥇 1st `source` must be its parent id, otherwise the diagram structure will be collapsed.
 *
 * ⭐ Node has multiple sources (connections), `source` must be an array with independent connection style (see `diagramDemoData` for example).
 *
 * ⭐ Node has only 1 source, a string or an array of `source` are both 👌.
 *
 * 🙋‍♂️🙋‍♀️"*Connection styles priority?*" - Plz read doc. of the `handleDiagramData` function on [hierarchyTreeHelper.ts](./hierarchyTreeHelper.ts).
 */
export const handleDiagramRawData = (rawData: IDiagramResData): IDiagramData[] => {
  const processedData: IDiagramData[] = [
    {
      id: diagramRootID,
      label: 'Center',
      type: 'input',
    },
  ];

  rawData.listEdge.forEach((edge) => {
    processedData.push({
      id: edge.name,
      label: (
        <>
          {edge.name}
          <br />
          <span>(ID: {edge.id})</span>
        </>
      ),
      type: 'customNode',
      source: diagramRootID,
    });

    edge.listRsu.forEach((rsu) => {
      processedData.push({
        id: rsu.name,
        label: (
          <>
            {rsu.name}
            <br />
            <span>(ID: {rsu.id})</span>
          </>
        ),
        type: 'customNode',
        source: edge.name,
      });

      rsu.listObu.forEach((obu) => {
        processedData.push({
          id: obu.name,
          label: (
            <>
              {obu.name}
              <br />
              <span>(ID: {obu.id})</span>
            </>
          ),
          type: 'output',
          source: rsu.name,
          nodeStatus: ENodeStatus.DRIVING,
        });
      });
    });
  });
  return processedData;
};

export const handleUpdateThirdCategory = (
  event: IListEvent,
  relatedNodeData: IDiagramData,
): { connection: IDiagramData; communication: IDiagramData } | false => {
  let currSource = relatedNodeData.source;
  if (!currSource) {
    return false;
  }

  let connection = relatedNodeData;
  let communication = relatedNodeData;

  // 1️⃣ Only `customNode`s have multiple sources (source edges/source connections).
  // Why named customNode? Its customizable, represents diagram's custom node component and defined on HierarchyTreeCanvas.tsx.
  if (relatedNodeData.type === 'customNode') {
    currSource = typeof currSource === 'string' ? [{ id: currSource }] : currSource;

    let needUpdateSourceIndex = currSource.findIndex(({ id }) => id === event.sendNode);
    let newSource: IDiagramDataCommon = { id: event.sendNode, edgeStyle: { stroke: themeRedDark } };

    if (needUpdateSourceIndex > -1) {
      newSource = { ...newSource, ...currSource[needUpdateSourceIndex] };
    }
    needUpdateSourceIndex =
      needUpdateSourceIndex === -1 ? currSource.length : needUpdateSourceIndex; // Unless sendNode exist on currSource, new source'll be push to currSource.

    currSource.splice(needUpdateSourceIndex, 1, newSource);

    connection = { ...connection, source: [...currSource] };

    currSource.splice(needUpdateSourceIndex, 1, {
      ...newSource,
      connectionFlow: relatedNodeData.id === event.sendNode ? 'reverse' : undefined,
      edgeAnimated: true,
    });

    communication = { ...communication, source: [...currSource] };

    return { connection, communication };
  }

  // 2️⃣ Normal Nodes have only 1 source

  // Standardized node status data from server
  const nodeStatusKey = (event.action || '').trim().replace(/\s+/g, '_').toUpperCase();
  const nodeStatus = getNodeStatusDataByKey(nodeStatusKey)?.status;

  connection = { ...connection, edgeStyle: { stroke: themeRedDark } };
  communication = {
    ...communication,
    edgeStyle: { stroke: themeRedDark },
    connectionFlow: relatedNodeData.id === event.sendNode ? 'reverse' : undefined,
    edgeAnimated: true,
  };

  if (nodeStatus !== undefined) {
    communication = { ...communication, nodeStatus };
  }

  return { connection, communication };
};

export const diagramDemoData: IDiagramData[] = [
  {
    id: '1',
    label: 'Center',
    type: 'input',
  },
  {
    id: '2',
    label: 'Edge 1',
    type: 'customNode',
    source: '1',
  },
  {
    id: '3',
    type: 'customNode',
    label: (
      <strong>
        <u>RSU 1</u>
      </strong>
    ),
    source: [{ id: '2', edgeAnimated: true, edgeStyle: { stroke: themeRedDark } }],
  },
  {
    id: '4',
    label: 'OBU 1',
    type: 'output',
    source: '3',
    nodeStatus: ENodeStatus.STOP,
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '5',
    label: 'OBU 2',
    type: 'output',
    source: '3',
    edgeAnimated: true,
    connectionFlow: 'reverse',
    nodeStatus: ENodeStatus.DRIVING,
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '6',
    label: 'OBU 3',
    type: 'output',
    source: '3',
    nodeStatus: ENodeStatus.DRIVING,
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '7',
    type: 'customNode',
    label: (
      <strong>
        <u>RSU 2</u>
      </strong>
    ),
    source: [
      {
        id: '2',
        edgeAnimated: true,
        connectionFlow: 'reverse',
        edgeStyle: { stroke: themeRedDark },
      },
      { id: '3', edgeAnimated: true, edgeStyle: { stroke: themeRedDark } },
    ],
    nodeStatus: ENodeStatus.VIRUS_EXCEED,
  },
  {
    id: '8',
    label: 'OBU 4',
    type: 'output',
    source: '7',
    edgeAnimated: true,
    connectionFlow: 'reverse',
    nodeStatus: ENodeStatus.PASS,
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '9',
    label: 'OBU 5',
    type: 'output',
    source: '7',
    nodeStatus: ENodeStatus.TURN_AROUND,
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '10',
    label: 'OBU 6',
    type: 'output',
    source: '7',
    nodeStatus: ENodeStatus.STOP,
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '11',
    label: 'Edge 2',
    type: 'customNode',
    source: [{ id: '1' }, { id: '2', edgeAnimated: true, edgeStyle: { stroke: themeRedDark } }],
  },
  {
    id: '12',
    type: 'customNode',
    label: (
      <strong>
        <u>RSU 3</u>
      </strong>
    ),
    source: [{ id: '11', edgeAnimated: true, edgeStyle: { stroke: themeRedDark } }],
  },
  {
    id: '13',
    label: 'OBU 7',
    type: 'output',
    source: '12',
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '14',
    label: 'OBU 8',
    type: 'output',
    source: '12',
    edgeAnimated: true,
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '15',
    label: 'OBU 9',
    type: 'output',
    source: '12',
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '16',
    type: 'customNode',
    label: (
      <strong>
        <u>RSU 4</u>
      </strong>
    ),
    source: [{ id: '11', edgeAnimated: true, edgeStyle: { stroke: themeRedDark } }],
  },
  {
    id: '17',
    label: 'OBU 10',
    type: 'output',
    source: '16',
    connectionFlow: 'reverse',
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '18',
    label: 'OBU 11',
    type: 'output',
    source: '16',
    edgeStyle: { stroke: themeRedDark },
  },
  {
    id: '19',
    label: 'OBU 12',
    type: 'output',
    source: '16',
    edgeAnimated: true,
    edgeStyle: { stroke: themeRedDark },
  },
];
