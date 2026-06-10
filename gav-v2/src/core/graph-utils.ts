import type { GraphData, GraphEdge, GraphNode } from '../types';

export function addNode(graph: GraphData, node: GraphNode): GraphData {
  return { ...graph, nodes: [...graph.nodes, node] };
}

export function removeNode(graph: GraphData, nodeId: string): GraphData {
  return {
    nodes: graph.nodes.filter((n) => n.id !== nodeId),
    edges: graph.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId,
    ),
  };
}

export function addEdge(graph: GraphData, edge: GraphEdge): GraphData {
  return { ...graph, edges: [...graph.edges, edge] };
}

export function removeEdge(graph: GraphData, edgeId: string): GraphData {
  return { ...graph, edges: graph.edges.filter((e) => e.id !== edgeId) };
}

export function serializeGraph(graph: GraphData): string {
  return JSON.stringify(graph);
}

export function deserializeGraph(raw: string): GraphData {
  const parsed = JSON.parse(raw) as unknown;
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !Array.isArray((parsed as GraphData).nodes) ||
    !Array.isArray((parsed as GraphData).edges)
  ) {
    throw new Error('Invalid graph JSON');
  }
  return parsed as GraphData;
}
