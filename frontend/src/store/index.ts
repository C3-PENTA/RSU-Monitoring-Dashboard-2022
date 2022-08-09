import create from 'zustand';
import { IStore } from '@/interface/interfaceCommon';
import { createSystemSlice } from './systemStore';
import { createDiagramSlice } from './diagramStore';

const useGlobalStore = create<IStore>()((...helpers) => ({
  ...createSystemSlice(...helpers),
  ...createDiagramSlice(...helpers),
}));
export default useGlobalStore;
