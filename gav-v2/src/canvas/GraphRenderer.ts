import type { GraphData, SelectionState } from '../types';
import { NODE_RADIUS } from './hitTest';
import type { ViewportController } from './ViewportController';

const COLORS = {
  nodeFill: '#3b3b4f',
  nodeStroke: '#6366f1',
  nodeSelected: '#a5b4fc',
  edgeStroke: '#4b4b60',
  edgeSelected: '#a5b4fc',
  label: '#e8e8f0',
  arrowhead: '#6366f1',
} as const;

export class GraphRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  render(
    graph: GraphData,
    selection: SelectionState,
    viewport: ViewportController,
    width: number,
    height: number,
  ): void {
    const { ctx } = this;

    // 1. Clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // 2. Apply viewport transform
    ctx.setTransform(
      viewport.zoom, 0,
      0, viewport.zoom,
      viewport.offsetX, viewport.offsetY,
    );

    // 3. Draw edges
    for (const edge of graph.edges) {
      this.drawEdge(edge, graph, selection);
    }

    // 4. Draw nodes (+ selection highlight underneath)
    for (const node of graph.nodes) {
      this.drawNode(node, selection.nodeIds.includes(node.id));
    }
  }

  private drawEdge(
    edge: import('../types').GraphEdge,
    graph: GraphData,
    selection: SelectionState,
  ): void {
    const { ctx } = this;
    const src = graph.nodes.find((n) => n.id === edge.source);
    const tgt = graph.nodes.find((n) => n.id === edge.target);
    if (!src || !tgt) return;

    const selected = selection.edgeIds.includes(edge.id);
    ctx.beginPath();
    ctx.moveTo(src.x, src.y);
    ctx.lineTo(tgt.x, tgt.y);
    ctx.strokeStyle = selected ? COLORS.edgeSelected : COLORS.edgeStroke;
    ctx.lineWidth = selected ? 2.5 : 1.5;
    ctx.stroke();

    if (edge.directed) {
      this.drawArrowhead(src.x, src.y, tgt.x, tgt.y);
    }
  }

  private drawArrowhead(
    x1: number, y1: number,
    x2: number, y2: number,
  ): void {
    const { ctx } = this;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const tipX = x2 - Math.cos(angle) * NODE_RADIUS;
    const tipY = y2 - Math.sin(angle) * NODE_RADIUS;
    const size = 10;

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(
      tipX - size * Math.cos(angle - Math.PI / 6),
      tipY - size * Math.sin(angle - Math.PI / 6),
    );
    ctx.lineTo(
      tipX - size * Math.cos(angle + Math.PI / 6),
      tipY - size * Math.sin(angle + Math.PI / 6),
    );
    ctx.closePath();
    ctx.fillStyle = COLORS.arrowhead;
    ctx.fill();
  }

  private drawNode(node: import('../types').GraphNode, selected: boolean): void {
    const { ctx } = this;

    if (selected) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS + 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(163,148,252,0.25)';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.nodeFill;
    ctx.fill();
    ctx.strokeStyle = selected ? COLORS.nodeSelected : COLORS.nodeStroke;
    ctx.lineWidth = selected ? 2.5 : 1.5;
    ctx.stroke();

    ctx.fillStyle = COLORS.label;
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, node.x, node.y);
  }
}
