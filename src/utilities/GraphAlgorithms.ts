import { GraphEdgeProps, GraphNodeProps, SearchOrder } from '@/app/types'; // Update the path accordingly.


export const bfs = (
  startID: string,
  adjacencyList: Map<string, { id: string; weight: number }[]>
): SearchOrder => {
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
): SearchOrder => {
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
): SearchOrder => {
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

const euclideanDistance = (
  nodeA: GraphNodeProps,
  nodeB: GraphNodeProps
): number => {
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const aStarWithEuclidean = (
  startID: string,
  targetID: string,
  nodes: GraphNodeProps[],
  adjacencyList: Map<string, { id: string; weight: number }[]>
): SearchOrder => {
  const distances: Map<string, number> = new Map();
  const previous: Map<string, string | null> = new Map();
  const priorityQueue: { id: string; fScore: number }[] = [];

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  adjacencyList.forEach((_, node) => {
    distances.set(node, Infinity);
    previous.set(node, null);
  });

  distances.set(startID, 0);
  priorityQueue.push({
    id: startID,
    fScore: euclideanDistance(nodeMap.get(startID)!, nodeMap.get(targetID)!),
  });

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a.fScore - b.fScore);
    const { id: currentNode } = priorityQueue.shift()!;

    if (currentNode === targetID) break;

    for (const neighbor of adjacencyList.get(currentNode) || []) {
      const tentativeGScore = distances.get(currentNode)! + neighbor.weight;

      if (tentativeGScore < distances.get(neighbor.id)!) {
        distances.set(neighbor.id, tentativeGScore);
        previous.set(neighbor.id, currentNode);
        priorityQueue.push({
          id: neighbor.id,
          fScore:
            tentativeGScore +
            euclideanDistance(
              nodeMap.get(neighbor.id)!,
              nodeMap.get(targetID)!
            ),
        });
      }
    }
  }

  // Reconstruct path as nodes and edges
  const pathNodes: string[] = [];
  const pathEdges: [string, string][] = [];
  let step: string = targetID;

  while (previous.get(step)) {
    const from = previous.get(step)!;
    pathNodes.unshift(step);
    pathEdges.unshift([from, step]);
    step = from;
  }

  if (step) pathNodes.unshift(step); // Add start node

  return {
    distance: distances.get(targetID)!,
    nodes: pathNodes,
    edges: pathEdges,
  };
};