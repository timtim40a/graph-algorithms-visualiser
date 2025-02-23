import { GraphEdgeProps, GraphNodeProps } from '@/app/types'; // Update the path accordingly.

// Utility to build an adjacency list
export const buildAdjacencyList = (
  nodes: GraphNodeProps[],
  edges: GraphEdgeProps[]
): Map<string, {id: string, weight: number}[]> => {
  const adjacencyList = new Map<string, {id: string, weight: number}[]>();
  nodes.forEach((node) => adjacencyList.set(node.id, []));

  edges.forEach((edge) => {
    const neighbours = adjacencyList.get(edge.sourceID) || [];
    neighbours.push({id:edge.targetID, weight:edge.weight});
    adjacencyList.set(edge.sourceID, neighbours);

    if (!edge.directed) {
      const reverseNeighbours = adjacencyList.get(edge.targetID) || [];
      reverseNeighbours.push({id:edge.sourceID, weight:edge.weight});
      adjacencyList.set(edge.targetID, reverseNeighbours);
    }
  });

  return adjacencyList;
};

// BFS Implementation
export const bfs = (
  startID: string,
  adjacencyList: Map<string, { id: string; weight: number }[]>
): { nodes: string[]; edges: [string, string][] } => {
  const visited = new Set<string>();
  const queue: string[] = [startID];
  const nodes: string[] = [];
  const edges: [string, string][] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (!visited.has(current)) {
      visited.add(current);
      nodes.push(current);

      const neighbors = adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          edges.push([current, neighbor.id]); // Track traversed edge (current → neighbor)
          queue.push(neighbor.id);
        }
      }
    }
  }

  return { nodes, edges };
};

export const dfs = (
  startID: string,
  adjacencyList: Map<string, { id: string; weight: number }[]>
): { nodes: string[]; edges: [string, string][] } => {
  const visited = new Set<string>();
  const nodes: string[] = [];
  const edges: [string, string][] = [];

  const dfsHelper = (node: string) => {
    if (!visited.has(node)) {
      visited.add(node);
      nodes.push(node);

      const neighbors = adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          edges.push([node, neighbor.id]); // Track edges
          dfsHelper(neighbor.id);
        }
      }
    }
  };

  dfsHelper(startID);
  console.log(edges)
  return {nodes, edges};
};

export const dijkstra = (
  startID: string,
  targetID: string,
  adjacencyList: Map<string, { id: string; weight: number }[]>
): { distance: number; nodes: string[]; edges: [string, string][] } => {
  const distances: Map<string, number> = new Map();
  const previous: Map<string, string | null> = new Map();
  const priorityQueue: { id: string; distance: number }[] = [];

  adjacencyList.forEach((_, node) => {
    distances.set(node, Infinity);
    previous.set(node, null);
  });

  distances.set(startID, 0);
  priorityQueue.push({ id: startID, distance: 0 });

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const { id: currentNode } = priorityQueue.shift()!;

    if (currentNode === targetID) break;

    for (const neighbor of adjacencyList.get(currentNode) || []) {
      const newDist = distances.get(currentNode)! + neighbor.weight;

      if (newDist < distances.get(neighbor.id)!) {
        distances.set(neighbor.id, newDist);
        previous.set(neighbor.id, currentNode);
        priorityQueue.push({ id: neighbor.id, distance: newDist });
      }
    }
  }

  // Reconstruct path as nodes and edges
  const nodes: string[] = [];
  const edges: [string, string][] = [];
  let step: string = targetID;

  while (previous.get(step)) {
    const from = previous.get(step)!;
    nodes.unshift(step);
    edges.unshift([from, step]); // Store edge as [from, to]
    step = from;
  }

  if (step) nodes.unshift(step); // Add start node

  return {
    distance: distances.get(targetID)!,
    nodes,
    edges,
  };
};

