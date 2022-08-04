import { ReactFlowProvider } from 'react-flow-renderer';
import { HierarchyTreeCanvas } from './HierarchyTreeCanvas';

import './HierarchyTree.scss';

/**
 * An common Hierarchy Tree diagram component
 *
 * @param {boolean} hideAttribution an option to hide Attribution of React flow ref. link.
 * The free tier already matches the current requirement.
 * Unless the clients requires this, please only hide this attribution when you/clients are subscribed to React Flow Pro.
 * @returns an "auto-layout" Hierarchy Tree diagram.
 */
export const HierarchyTree = ({ hideAttribution = false }: { hideAttribution?: boolean }) => {
  return (
    <ReactFlowProvider>
      <HierarchyTreeCanvas hideAttribution={hideAttribution} />
    </ReactFlowProvider>
  );
};
