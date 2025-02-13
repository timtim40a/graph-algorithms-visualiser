import { GraphEdgeProps, GraphNodeProps } from '@/app/types'; // Update the path accordingly.

// Utility to build an adjacency list
export const buildAdjacencyList = (
  nodes: GraphNodeProps[],
  edges: GraphEdgeProps[]
): Map<string, string[]> => {
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach((node) => adjacencyList.set(node.id, []));

  edges.forEach((edge) => {
    const neighbours = adjacencyList.get(edge.sourceID) || [];
    neighbours.push(edge.targetID);
    adjacencyList.set(edge.sourceID, neighbours);

    if (!edge.directed) {
      const reverseNeighbours = adjacencyList.get(edge.targetID) || [];
      reverseNeighbours.push(edge.sourceID);
      adjacencyList.set(edge.targetID, reverseNeighbours);
    }
  });

  return adjacencyList;
};

// BFS Implementation
export const bfs = (
  startID: string,
  adjacencyList: Map<string, string[]>
): [string, string][] => {
  const visited = new Set<string>();
  const queue: string[] = [startID];
  const edges: [string, string][] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (!visited.has(current)) {
      visited.add(current);

      const neighbors = adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          edges.push([current, neighbor]); // Track traversed edge (current → neighbor)
          queue.push(neighbor);
        }
      }
    }
  }

  return edges;
};

export const dfs = (
  startID: string,
  adjacencyList: Map<string, string[]>
): [string, string][] => {
  const visited = new Set<string>();
  const edges: [string, string][] = [];

  const dfsHelper = (node: string) => {
    if (!visited.has(node)) {
      visited.add(node);

      const neighbors = adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          edges.push([node, neighbor]); // Track edges
          dfsHelper(neighbor);
        }
      }
    }
  };

  dfsHelper(startID);
  console.log(edges)
  return edges;
};
