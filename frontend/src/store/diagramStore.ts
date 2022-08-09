import { StateCreator } from 'zustand';
import { IDiagramStore } from '@/interface/interfaceCommon';

export const createDiagramSlice: StateCreator<IDiagramStore> = (set) => ({
  rawDiagramData: [],
  setRawDiagramData: (rawDiagramData) => set(() => ({ rawDiagramData })),
});
