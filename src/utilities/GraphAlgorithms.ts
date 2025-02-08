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