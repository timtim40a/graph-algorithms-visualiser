import { GraphEdgeProps, GraphNodeProps, SearchOrder } from '@/app/types'; // Update the path accordingly.
import { distance } from 'framer-motion';


export const bfs = (
  startID: string,
  adjacencyList: Map<string, { id: string; weight: number }[]>
): SearchOrder => {
  const visited = new Set<string>();
  const queue: string[] = [startID];
  const nodes: Map<string, number>[] = [new Map()];
  const edges: Map<[string, string],number>[] = [new Map()];
  const initialListOfNodes: string[] = Array.from(adjacencyList.keys());
  let i = 0;
  initialListOfNodes.map((node) => nodes[i].set(node, 1))

  console.log(adjacencyList)

  while (queue.length > 0) {
    queue.forEach((node) => nodes[i].set(node, 3))
    const current = queue.shift()!;
    nodes.push(new Map(nodes[i]));
    if (!visited.has(current)) {
      i += 1;
      visited.forEach((node) => nodes[i].set(node, 4))
      visited.add(current);
      nodes[i].set(current, 2)
      edges.push(new Map())

      const neighbours = adjacencyList.get(current) || [];
      for (const neighbour of neighbours) { 
        if (!visited.has(neighbour.id) && !queue.includes(neighbour.id)) {
          edges[i].set([current, neighbour.id], 2); // Track traversed edge (current - neighbour)
          queue.push(neighbour.id);
        } /* else if (queue.includes(neighbour.id)) {
          edges[i-1].set([current, neighbour.id], 3);
        } */
      } 
    }
  }

  while (edges.length > nodes.length) { nodes.push(new Map(nodes[-1])) }
  
  return { nodes, edges };
};

export const dfs = (
  startID: string,
  adjacencyList: Map<string, { id: string; weight: number }[]>
): SearchOrder => {
  const visited = new Set<string>();
  const nodes: Map<string, number>[] = [new Map()];
  const edges: Map<[string, string],number>[] = [new Map()];
  const initialListOfNodes: string[] = Array.from(adjacencyList.keys());
  let i = 0;
  initialListOfNodes.map((node) => nodes[i].set(node, 1))

  const dfsHelper = (current: string) => {
    if (!visited.has(current)) {
      i += 1
      nodes.push(new Map());
      visited.forEach((node) => nodes[i].set(node, 4))
      visited.add(current);
      nodes[i].set(current, 2)
      edges.push(new Map());

      const neighbours = adjacencyList.get(current) || [];
      neighbours.forEach((neighbour) => !visited.has(neighbour.id) ? nodes[i].set(neighbour.id, 3) : null)
      for (const neighbour of neighbours) {
        if (!visited.has(neighbour.id)) {
          edges[i].set([current, neighbour.id], 2); // Track edges
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
  const nodes: Map<string, number>[] = [new Map()];
  const edges: Map<[string, string],number>[] = [new Map()];

  let i = 0;
  adjacencyList.forEach((_, node) => {
    distances[i].set(node, Infinity);
    nodes[i].set(node, 1)
    previous.set(node, null);
  });

  distances[i].set(startID, 0);
  priorityQueue.push({ id: startID, distance: 0 });

  while (priorityQueue.length > 0) {
    priorityQueue.forEach((node) => nodes[i].set(node.id, 3));
    i += 1;
    distances[i] = new Map(distances[i-1]);
    edges.push(new Map());
    nodes.push(new Map(nodes[-1]));
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const { id: currentNode } = priorityQueue.shift()!;
    previous.forEach((node1, node2, _) => node1 ? nodes[i].set(node1, 4) : null)
    nodes[i].set(currentNode, 2);

    if (currentNode === targetID) break;

    for (const neighbour of adjacencyList.get(currentNode) || []) {
      const newDist = distances[i-1].get(currentNode)! + neighbour.weight;
      

      if (newDist < distances[i-1].get(neighbour.id)!) {
        edges[i].set([currentNode, neighbour.id], 1);
        distances[i].set(neighbour.id, newDist);
        previous.set(neighbour.id, currentNode);
        priorityQueue.push({ id: neighbour.id, distance: newDist });
      }
    }
  }

  // Reconstruct path as nodes and edges
  let step: string = targetID;
  edges.push(new Map())

  while (previous.get(step)) {
    const from = previous.get(step)!;
    edges[i].set([from, step], 2); // Store edge as [from, to]
    step = from;
  }

  console.log(distances)
  while (edges.length > distances.length) { distances.push(new Map(distances[-1])) }
  while (edges.length > nodes.length) { nodes.push(new Map(nodes[-1])) }
  return {
    distances,
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
  return Math.round(Math.sqrt(dx * dx + dy * dy));
};

export const aStarWithEuclidean = (
  startID: string,
  targetID: string,
  nodes: GraphNodeProps[],
  adjacencyList: Map<string, { id: string; weight: number }[]>
): SearchOrder => {
  const distances: Map<string, number>[] = [new Map()];
  const heuristics: Map<string, number> = new Map()
  const previous: Map<string, string | null> = new Map();
  const priorityQueue: { id: string; fScore: number }[] = [];
  const edges: Map<[string, string],number>[] = [new Map()];
  const animationNodes: Map<string, number>[] = [new Map()];
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  let i = 0;
  adjacencyList.forEach((_, node) => {
    distances[i].set(node, Infinity);
    heuristics.set(node, euclideanDistance(nodeMap.get(node)!, nodeMap.get(targetID)!))
    animationNodes[i].set(node, 1)
    previous.set(node, null);
  });

  distances[i].set(startID, 0);
  priorityQueue.push({
    id: startID,
    fScore: heuristics.get(startID)!,
  });

  while (priorityQueue.length > 0) {
    priorityQueue.forEach((node) => animationNodes[i].set(node.id, 3));
    i += 1;
    edges.push(new Map())
    animationNodes.push(new Map(animationNodes[-1]))
    distances[i] = new Map(distances[i-1]);
    priorityQueue.sort((a, b) => a.fScore - b.fScore);
    const { id: currentNode } = priorityQueue.shift()!;
    previous.forEach((node1, node2, _) => node1 ? animationNodes[i].set(node1, 4) : null)
    animationNodes[i].set(currentNode, 2);

    if (currentNode === targetID) break;

    for (const neighbour of adjacencyList.get(currentNode) || []) {
      const tentativeGScore = distances[i].get(currentNode)! + neighbour.weight;

      if (tentativeGScore < distances[i].get(neighbour.id)!) {
        edges[i].set([currentNode, neighbour.id], 1)
        distances[i].set(neighbour.id, tentativeGScore);
        previous.set(neighbour.id, currentNode);
        const euD = heuristics.get(neighbour.id)
        console.log(euD)
        console.log(tentativeGScore)
        priorityQueue.push({
          id: neighbour.id,
          fScore:
            tentativeGScore + euD!,
        });
      }
    }
  }

  // Reconstruct path as nodes and edges
  
  let step: string = targetID;

  while (previous.get(step)) {
    const from = previous.get(step)!;
    edges[i].set([from, step], 2);
    step = from;
  }

  return {
    nodes: animationNodes,
    edges,
    distances,
    heuristics,
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
  const animationNodes: Map<string, number>[] = [new Map()];
  let step: string = targetID;

  while (previous.get(step)) {
    const from = previous.get(step)!;
    edges[i].set([from, step], 2);
    step = from;
  }

  return {
    distances: distances,
    nodes: animationNodes,
    edges,
  };
};

export const bestFirstSearch = (
  startID: string,
  targetID: string,
  nodes: GraphNodeProps[],
  adjacencyList: Map<string, { id: string; weight: number }[]>
): SearchOrder => {
  const heuristics: Map<string, number> = new Map()
  const previous: Map<string, string | null> = new Map();
  const priorityQueue: { id: string; euD: number }[] = [];
  const edges: Map<[string, string],number>[] = [new Map()];
  const animationNodes: Map<string, number>[] = [new Map()];
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  let i = 0;
  adjacencyList.forEach((_, node) => {
    heuristics.set(node, euclideanDistance(nodeMap.get(node)!, nodeMap.get(targetID)!))
    animationNodes[i].set(node, 1)
    previous.set(node, null);
  });

  priorityQueue.push({
    id: startID,
    euD: heuristics.get(startID)!,
  });

  while (priorityQueue.length > 0) {
    priorityQueue.forEach((node) => animationNodes[i].set(node.id, 3));
    i += 1;
    edges.push(new Map())
    animationNodes.push(new Map(animationNodes[-1]))
    priorityQueue.sort((a, b) => a.euD - b.euD);
    const { id: currentNode } = priorityQueue.shift()!;
    previous.forEach((node1, node2, _) => node1 ? animationNodes[i].set(node1, 4) : null)
    animationNodes[i].set(currentNode, 2);

    if (currentNode === targetID) break;

    for (const neighbour of adjacencyList.get(currentNode) || []) {
      const euD = heuristics.get(neighbour.id)
      if (heuristics.get(currentNode)! > euD!) {
        edges[i].set([currentNode, neighbour.id], 1)
        previous.set(neighbour.id, currentNode);
        console.log(euD)
        priorityQueue.push({
          id: neighbour.id,
          euD: euD!,
        });
      }
    }
  }
  // Reconstruct path as nodes and edges

  let step: string = targetID;

  while (previous.get(step)) {
    const from = previous.get(step)!;
    edges[i].set([from, step], 2);
    step = from;
  }

  return {
    nodes: animationNodes,
    edges,
    heuristics,
  };
};