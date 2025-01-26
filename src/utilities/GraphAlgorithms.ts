import { GraphEdgeProps, GraphNodeProps } from '@/app/types'; // Update the path accordingly.

// Utility to build an adjacency list
export const buildAdjacencyList = (
  nodes: GraphNodeProps[],
  edges: GraphEdgeProps[]
): Map<string, string[]> => {
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach((node) => adjacencyList.set(node.id, []));

  edges.forEach((edge) => {
    const neighbors = adjacencyList.get(edge.sourceID) || [];
    neighbors.push(edge.targetID);
    adjacencyList.set(edge.sourceID, neighbors);

    if (!edge.directed) {
      const reverseNeighbors = adjacencyList.get(edge.targetID) || [];
      reverseNeighbors.push(edge.sourceID);
      adjacencyList.set(edge.targetID, reverseNeighbors);
    }
  });

  return adjacencyList;
};

// BFS Implementation
export const bfs = (
  startID: string,
  adjacencyList: Map<string, string[]>
): string[] => {
  const visited = new Set<string>();
  const searchQueue: string[] = [startID];
  const finalPath: string[] = [];

  while (searchQueue.length > 0) {
    const current = searchQueue.shift()!;
    if (!visited.has(current)) {
      visited.add(current);
      finalPath.push(current);

      const neighbors = adjacencyList.get(current) || [];
      searchQueue.push(...neighbors.filter((neighbor) => !visited.has(neighbor)));
    }
  }

  return finalPath;
};