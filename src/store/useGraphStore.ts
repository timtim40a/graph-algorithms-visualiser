/* This is the key storage file for all of the session related data including graph's current state, 
nodes and edges. Types and the functions to alter the state are declared here. Written with Zustand.*/

import { create } from "zustand";

type GraphNode = {
  id: string;
  value: string;
  selected: boolean;
  x: number;
  y: number;
  activeAnimation: number;
  onClick: ((event: React.MouseEvent<HTMLDivElement>, id: string) => void);
}

type GraphEdge = {
  id: string;
  sourceID: string;
  targetID: string;
  weight: number;
  directed: boolean;
  activeAnimation: number;
}

type GraphState = {
    nodes: GraphNode[];
    edges: GraphEdge[];
    isGraphDirected: boolean;
    isGraphCyclic: boolean;
    isGraphNegativeCyclic: boolean;
    isAnimationOn: boolean;
    addNode: (id: string, 
              value: string, 
              x: number, 
              y: number, 
              onClick: ((event: React.MouseEvent<HTMLDivElement>, id: string) => void)
            ) => void;
    removeNode: (id: string) => void;
    alterNode: (id: string,
              updatedProps: object) => void;
    switchNodeSelection: (ids: string[]) => void;
    addEdge: (id: string,
              sourceID: string, 
              targetID: string,
              weight: number,
              directed: boolean,
              activeAnimation: boolean) => void;
    removeEdge: (id: string) => void;
    alterEdge: (id: string,
                updatedProps: object) => void;
    sortEdges: (order: string) => void;
    setIsGraphDirected: () => void;
    setIsGraphCyclic: (value: boolean) => void;
    setIsGraphNegativeCyclic: (value: boolean) => void;
    setIsAnimationOn: (value: boolean) => void;
    clearNodes: () => void;
    clearEdges: () => void;
}

const useGraphStore = create<GraphState>((set) => ({

    nodes: [],
    edges: [],
    isGraphDirected: true,
    isGraphCyclic: false,
    isGraphNegativeCyclic: false,
    isAnimationOn: false,

    addNode: (id, value, x, y, onClick) =>
      set((state) => ({
        nodes: [...state.nodes, { 
          id, 
          value, 
          x, y, 
          selected: false, 
          activeAnimation: 0, 
          onClick}],
      })),
  
    removeNode: (id) =>
      set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== id),
        edges: state.edges.filter((edge) => edge.sourceID !== id && edge.targetID !== id),
      })),
    
    alterNode: (id, updatedProps) =>
      set((state) => ({
          nodes: state.nodes.map((node) =>
              node.id === id
                  ? { ...node, ...updatedProps } // Apply the updates to the matched edge
                  : node
          ),
      })),

    switchNodeSelection: (ids: string[]) =>
      set((state) => ({
          nodes: state.nodes.map((node) =>
              ids.some((id) => node.id === id)
                  ? { ...node, selected: true } // Toggle the selection state
                  : { ...node, selected: false}
          ),
      })),
  
    addEdge: (id, sourceID, targetID, getNodePosition) =>
      set((state) => ({
        edges: [...state.edges, { 
          id, 
          sourceID, 
          targetID, 
          weight: 1, 
          directed: false, 
          activeAnimation: 0}],
      })),
  
    removeEdge: (id) =>
      set((state) => ({
        edges: state.edges.filter((edge) => edge.id !== id),
      })),

    alterEdge: (id, updatedProps) =>
      set((state) => ({
          edges: state.edges.map((edge) =>
              edge.id === id
                  ? { ...edge, ...updatedProps } // Apply the updates to the matched edge
                  : edge
          ),
      })),

      sortEdges: (order) =>
        set((state) => ({
          edges: [...state.edges].sort((a, b) => {
            const extractNumbers = (edge: GraphEdge) => {
              const match = edge.id.match(/en(\d+)n(\d+)/);
              return match ? [parseInt(match[1]), parseInt(match[2])] : [0, 0];
            };
    
            const [a1, a2] = extractNumbers(a);
            const [b1, b2] = extractNumbers(b);
    
            return order === "asc" ? a1 - b1 || a2 - b2 : b1 - a1 || b2 - a2;
          }),
        })),
    
      setIsGraphDirected: () =>
        set((state) => ({isGraphDirected: !state.isGraphDirected})),

      setIsGraphCyclic: (value: boolean) =>
        set((state) => ({isGraphCyclic: value})),

      setIsGraphNegativeCyclic: (value: boolean) =>
        set((state) => ({isGraphNegativeCyclic: value})),

      setIsAnimationOn: (value: boolean) =>
        set((state) => ({isAnimationOn: value})),

      clearNodes: () => 
        set((state) => ({nodes: []})),

      clearEdges: () => 
        set((state) => ({edges: []})),
}));

export default useGraphStore;
