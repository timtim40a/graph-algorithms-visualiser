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

      const neighbours = adjacencyList.get(current) || [];
      for (const neighbour of neighbours) {
        if (!visited.has(neighbour.id)) {
          edges.push([current, neighbour.id]); // Track traversed edge (current → neighbour)
          queue.push(neighbour.id);
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

      const neighbours = adjacencyList.get(node) || [];
      for (const neighbour of neighbours) {
        if (!visited.has(neighbour.id)) {
          edges.push([node, neighbour.id]); // Track edges
          dfsHelper(neighbour.id);
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

    for (const neighbour of adjacencyList.get(currentNode) || []) {
      const newDist = distances.get(currentNode)! + neighbour.weight;

      if (newDist < distances.get(neighbour.id)!) {
        distances.set(neighbour.id, newDist);
        previous.set(neighbour.id, currentNode);
        priorityQueue.push({ id: neighbour.id, distance: newDist });
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
    distances: distances,
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

    for (const neighbour of adjacencyList.get(currentNode) || []) {
      const tentativeGScore = distances.get(currentNode)! + neighbour.weight;

      if (tentativeGScore < distances.get(neighbour.id)!) {
        distances.set(neighbour.id, tentativeGScore);
        previous.set(neighbour.id, currentNode);
        const euD = euclideanDistance(
          nodeMap.get(neighbour.id)!,
          nodeMap.get(targetID)!
        )
        console.log(euD)
        console.log(tentativeGScore)
        priorityQueue.push({
          id: neighbour.id,
          fScore:
            tentativeGScore + euD,
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
    distances: distances,
    nodes: pathNodes,
    edges: pathEdges,
  };
};

export const bellmanFord = (
  startID: string,
  targetID: string,
  nodes: GraphNodeProps[],
  adjacencyList: Map<string, { id: string; weight: number }[]>
): SearchOrder => {
  const distances: Map<string, number> = new Map();
  const previous: Map<string, string | null> = new Map();

  // Initialize distances and previous nodes
  nodes.forEach((node) => {
    distances.set(node.id, Infinity);
    previous.set(node.id, null);
  });
  distances.set(startID, 0);

  // Relax edges |V| - 1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    adjacencyList.forEach((neighbours, nodeID) => {
      for (const { id: neighbourID, weight } of neighbours) {
        const newDist = distances.get(nodeID)! + weight;
        if (newDist < distances.get(neighbourID)!) {
          distances.set(neighbourID, newDist);
          previous.set(neighbourID, nodeID);
        }
      }
    });
  }

  // Check for negative weight cycles
  adjacencyList.forEach((neighbours, nodeID) => {
    for (const { id: neighbourID, weight } of neighbours) {
      if (distances.get(nodeID)! + weight < distances.get(neighbourID)!) {
        throw new Error("Graph contains a negative weight cycle.");
      }
    }
  });

  // Reconstruct the path (nodes & edges)
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
    distances: distances,
    nodes: pathNodes,
    edges: pathEdges,
  };
};