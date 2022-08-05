import { Handle, NodeProps, Position } from 'react-flow-renderer';

export const HierarchyNodeCustom = (nodeProps: NodeProps) => {
  return (
    <>
      {nodeProps.data.label}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />

      <Handle
        className="absolute-center visibility-hidden"
        type="source"
        position={Position.Right}
        id={`hs-${nodeProps.id}`}
      />

      <Handle
        className="absolute-center visibility-hidden"
        type="target"
        position={Position.Right}
        id={`ht-${nodeProps.id}`}
      />
    </>
  );
};
