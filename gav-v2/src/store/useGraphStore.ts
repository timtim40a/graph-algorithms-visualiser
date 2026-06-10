import { create } from 'zustand';
import type { GraphData, SelectionState } from '../types';

export type Tool = 'select' | 'addNode' | 'addEdge' | 'delete';

interface GraphStore {
  tool: Tool;
  graph: GraphData;
  selection: SelectionState;

  setTool: (tool: Tool) => void;
  setGraph: (graph: GraphData) => void;
  setSelection: (selection: SelectionState) => void;
  clearSelection: () => void;
}

const EMPTY_GRAPH: GraphData = { nodes: [], edges: [] };
const EMPTY_SELECTION: SelectionState = { nodeIds: [], edgeIds: [] };

export const useGraphStore = create<GraphStore>((set) => ({
  tool: 'select',
  graph: EMPTY_GRAPH,
  selection: EMPTY_SELECTION,

  setTool: (tool) => set({ tool }),
  setGraph: (graph) => set({ graph }),
  setSelection: (selection) => set({ selection }),
  clearSelection: () => set({ selection: EMPTY_SELECTION }),
}));
