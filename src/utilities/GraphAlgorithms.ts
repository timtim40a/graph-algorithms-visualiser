import { GraphEdgeProps, GraphNodeProps, SearchOrder } from '@/app/types'; // Update the path accordingly.


export const bfs = (
  startID: string,
  adjacencyList: Map<string, { id: string; weight: number }[]>
): SearchOrder => {
  const visited = new Set<string>();
  const queue: string[] = [startID];
  const nodes: string[] = [];
  const edges: Map<[string, string],number>[] = [];
  let i = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (!visited.has(current)) {
      i += 1;
      visited.add(current);
      nodes.push(current);
      edges.push(new Map())

      const neighbours = adjacencyList.get(current) || [];
      for (const neighbour of neighbours) { 
        if (!visited.has(neighbour.id) && !queue.includes(neighbour.id)) {
          edges[i-1].set([current, neighbour.id], 2); // Track traversed edge (current - neighbour)
          queue.push(neighbour.id);
        } /* else if (queue.includes(neighbour.id)) {
          edges[i-1].set([current, neighbour.id], 3);
        } */
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
  const edges: Map<[string, string],number>[] = [];
  let i = 0;

  const dfsHelper = (node: string) => {
    if (!visited.has(node)) {
      i += 1
      visited.add(node);
      nodes.push(node);
      edges.push(new Map());

      const neighbours = adjacencyList.get(node) || [];
      for (const neighbour of neighbours) {
        if (!visited.has(neighbour.id)) {
          edges[i-1].set([node, neighbour.id], 2); // Track edges
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
  const distances: Map<string, number>[] = [new Map()];
  const previous: Map<string, string | null> = new Map();
  const priorityQueue: { id: string; distance: number }[] = [];
  const edges: Map<[string, string],number>[] = [new Map()];

  let i = 0;
  adjacencyList.forEach((_, node) => {
    distances[i].set(node, Infinity);
    previous.set(node, null);
  });

  distances[i].set(startID, 0);
  priorityQueue.push({ id: startID, distance: 0 });

  while (priorityQueue.length > 0) {
    i += 1;
    distances[i] = new Map(distances[i-1]);
    edges.push(new Map());
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const { id: currentNode } = priorityQueue.shift()!;

    if (currentNode === targetID) break;

    for (const neighbour of adjacencyList.get(currentNode) || []) {
      const newDist = distances[i-1].get(currentNode)! + neighbour.weight;
      

      if (newDist < distances[i-1].get(neighbour.id)!) {
        edges[i].set([currentNode, neighbour.id], 1)
        distances[i].set(neighbour.id, newDist);
        previous.set(neighbour.id, currentNode);
        priorityQueue.push({ id: neighbour.id, distance: newDist });
      }
    }
  }

  // Reconstruct path as nodes and edges
  const nodes: string[] = [];
  let step: string = targetID;
  edges.push(new Map())

  while (previous.get(step)) {
    const from = previous.get(step)!;
    nodes.unshift(step);
    edges[i].set([from, step], 2); // Store edge as [from, to]
    step = from;
  }

  if (step) nodes.unshift(step); // Add start node
  console.log(distances)
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
  const distances: Map<string, number>[] = [new Map()];
  const previous: Map<string, string | null> = new Map();
  const priorityQueue: { id: string; fScore: number }[] = [];
  const edges: Map<[string, string],number>[] = [new Map()];

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  let i = 0;
  adjacencyList.forEach((_, node) => {
    distances[i].set(node, Infinity);
    previous.set(node, null);
  });


  distances[i].set(startID, 0);
  priorityQueue.push({
    id: startID,
    fScore: euclideanDistance(nodeMap.get(startID)!, nodeMap.get(targetID)!),
  });

  while (priorityQueue.length > 0) {
    i += 1;
    edges.push(new Map())
    distances[i] = new Map(distances[i-1]);
    priorityQueue.sort((a, b) => a.fScore - b.fScore);
    const { id: currentNode } = priorityQueue.shift()!;

    if (currentNode === targetID) break;

    for (const neighbour of adjacencyList.get(currentNode) || []) {
      const tentativeGScore = distances[i].get(currentNode)! + neighbour.weight;

      if (tentativeGScore < distances[i].get(neighbour.id)!) {
        edges[i].set([currentNode, neighbour.id], 1)
        distances[i].set(neighbour.id, tentativeGScore);
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
  let step: string = targetID;

  while (previous.get(step)) {
    const from = previous.get(step)!;
    pathNodes.unshift(step);
    edges[i].set([from, step], 2);
    step = from;
  }

  if (step) pathNodes.unshift(step); // Add start node

  return {
    distances: distances,
    nodes: pathNodes,
    edges,
  };
};

export const bellmanFord = (
  startID: string,
  targetID: string,
  nodes: GraphNodeProps[],
  adjacencyList: Map<string, { id: string; weight: number }[]>
): SearchOrder => {
  const distances: Map<string, number>[] = [new Map()];
  const previous: Map<string, string | null> = new Map();
  const edges: Map<[string, string],number>[] = [new Map()];

  
  let i = 0;
  // Initialize distances and previous nodes
  nodes.forEach((node) => {
    distances[i].set(node.id, Infinity);
    previous.set(node.id, null);
  });
  distances[i].set(startID, 0);

  // Relax edges |N| - 1 times
  for (let j = 0; j < nodes.length - 1; j++) {
    i += 1;
    distances[i] = new Map(distances[i-1]);
    edges.push(new Map());
    adjacencyList.forEach((neighbours, nodeID) => {
      for (const { id: neighbourID, weight } of neighbours) {
        const newDist = distances[i-1].get(nodeID)! + weight;
        if (newDist < distances[i-1].get(neighbourID)!) {
          edges[i].set([nodeID, neighbourID], 1)
          distances[i].set(neighbourID, newDist);
          previous.set(neighbourID, nodeID);
        }
      }
    });
  }

  // Check for negative weight cycles
  adjacencyList.forEach((neighbours, nodeID) => {
    for (const { id: neighbourID, weight } of neighbours) {
      if (distances[i].get(nodeID)! + weight < distances[i].get(neighbourID)!) {
        throw new Error("Graph contains a negative weight cycle.");
      }
    }
  });

  // Reconstruct the path (nodes & edges)
  const pathNodes: string[] = [];
  let step: string = targetID;

  while (previous.get(step)) {
    const from = previous.get(step)!;
    pathNodes.unshift(step);
    edges[i].set([from, step], 2);
    step = from;
  }

  if (step) pathNodes.unshift(step); // Add start node

  return {
    distances: distances,
    nodes: pathNodes,
    edges,
  };
};