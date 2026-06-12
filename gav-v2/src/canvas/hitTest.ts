import type { GraphEdge, GraphNode } from '../types'

export const NODE_RADIUS = 20

export function hitTestNode(
    node: GraphNode,
    wx: number,
    wy: number,
    radius = NODE_RADIUS,
): boolean {
    const dx = node.x - wx
    const dy = node.y - wy
    return dx * dx + dy * dy <= radius * radius
}

/** Minimum distance from point (px, py) to segment (ax, ay)→(bx, by). */
function pointToSegmentDistance(
    px: number,
    py: number,
    ax: number,
    ay: number,
    bx: number,
    by: number,
): number {
    const dx = bx - ax
    const dy = by - ay
    const lenSq = dx * dx + dy * dy
    if (lenSq === 0) {
        return Math.hypot(px - ax, py - ay)
    }
    const t = Math.max(
        0,
        Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq),
    )
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

export function hitTestEdge(
    edge: GraphEdge,
    nodes: GraphNode[],
    wx: number,
    wy: number,
    threshold = 6,
): boolean {
    const src = nodes.find((n) => n.id === edge.source)
    const tgt = nodes.find((n) => n.id === edge.target)
    if (!src || !tgt) return false
    return (
        pointToSegmentDistance(wx, wy, src.x, src.y, tgt.x, tgt.y) <= threshold
    )
}
