import { create } from "zustand";
import type { GraphData, SelectionState } from "../types";

export type Tool = "select" | "addNode" | "addEdge" | "delete";

export interface Settings {
    variableNodeSizes: boolean;
    draggableNodes: boolean;
}

interface GraphStore {
    tool: Tool;
    graph: GraphData;
    selection: SelectionState;
    settings: Settings;

    setTool: (tool: Tool) => void;
    setGraph: (graph: GraphData) => void;
    setSelection: (selection: SelectionState) => void;
    clearSelection: () => void;
    setSettings: (s: Partial<Settings>) => void;
}

const EMPTY_GRAPH: GraphData = { nodes: [], edges: [] };
const EMPTY_SELECTION: SelectionState = { nodeIds: [], edgeIds: [] };
const DEFAULT_SETTINGS: Settings = { variableNodeSizes: false, draggableNodes: true };

export const useGraphStore = create<GraphStore>((set) => ({
    tool: "select",
    graph: EMPTY_GRAPH,
    selection: EMPTY_SELECTION,
    settings: DEFAULT_SETTINGS,

    setTool: (tool) => set({ tool }),
    setGraph: (graph) => set({ graph }),
    setSelection: (selection) => set({ selection }),
    clearSelection: () => set({ selection: EMPTY_SELECTION }),
    setSettings: (s) => set((state) => ({ settings: { ...state.settings, ...s } })),
}));
