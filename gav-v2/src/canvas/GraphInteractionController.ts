import type { GraphData, SelectionState } from '../types'
import type { Tool } from '../store/useGraphStore'
import { hitTestEdge, hitTestNode } from './hitTest'
import type { ViewportController } from './ViewportController'

const ZOOM_FACTOR = 0.9

interface StoreAccess {
  getGraph: () => GraphData
  getSelection: () => SelectionState
  getTool: () => Tool
  setGraph: (g: GraphData) => void
  setSelection: (s: SelectionState) => void
}

export class GraphInteractionController {
  private isDragging = false
  private lastPointer = { x: 0, y: 0 }

  constructor(
    private readonly viewport: ViewportController,
    private readonly store: StoreAccess,
    private readonly redraw: () => void,
  ) {}

  onPointerDown(e: PointerEvent): void {
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
    this.lastPointer = { x: e.clientX, y: e.clientY }

    const world = this.viewport.screenToWorld(e.offsetX, e.offsetY)
    const graph = this.store.getGraph()
    const selection = this.store.getSelection()
    const tool = this.store.getTool()

    if (tool === 'select') {
      const hitNode = graph.nodes.find((n) => hitTestNode(n, world.x, world.y))
      if (hitNode) {
        this.store.setSelection({ nodeIds: [hitNode.id], edgeIds: [] })
        this.isDragging = true
        return
      }
      const hitEdge = graph.edges.find((e) =>
        hitTestEdge(e, graph.nodes, world.x, world.y),
      )
      if (hitEdge) {
        this.store.setSelection({ nodeIds: [], edgeIds: [hitEdge.id] })
        return
      }
      this.store.setSelection({ nodeIds: [], edgeIds: [] })
      this.isDragging = true // pan
    }

    if (tool === 'addNode') {
      const id = crypto.randomUUID()
      this.store.setGraph({
        ...graph,
        nodes: [...graph.nodes, { id, label: id.slice(0, 4), x: world.x, y: world.y }],
      })
    }

    if (tool === 'addEdge') {
      const hitNode = graph.nodes.find((n) => hitTestNode(n, world.x, world.y))
      if (hitNode) {
        if (
          selection.nodeIds.length === 1 &&
          selection.nodeIds[0] !== hitNode.id
        ) {
          this.store.setGraph({
            ...graph,
            edges: [
              ...graph.edges,
              { id: crypto.randomUUID(), source: selection.nodeIds[0], target: hitNode.id },
            ],
          })
          this.store.setSelection({ nodeIds: [], edgeIds: [] })
        } else {
          this.store.setSelection({ nodeIds: [hitNode.id], edgeIds: [] })
        }
      }
    }

    if (tool === 'delete') {
      const hitNode = graph.nodes.find((n) => hitTestNode(n, world.x, world.y))
      if (hitNode) {
        this.store.setGraph({
          nodes: graph.nodes.filter((n) => n.id !== hitNode.id),
          edges: graph.edges.filter(
            (e) => e.source !== hitNode.id && e.target !== hitNode.id,
          ),
        })
        return
      }
      const hitEdge = graph.edges.find((e) =>
        hitTestEdge(e, graph.nodes, world.x, world.y),
      )
      if (hitEdge) {
        this.store.setGraph({
          ...graph,
          edges: graph.edges.filter((e) => e.id !== hitEdge.id),
        })
      }
    }
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.isDragging) return

    const dx = e.clientX - this.lastPointer.x
    const dy = e.clientY - this.lastPointer.y
    this.lastPointer = { x: e.clientX, y: e.clientY }

    const tool = this.store.getTool()
    const selection = this.store.getSelection()

    if (tool === 'select' && selection.nodeIds.length > 0) {
      const nodeId = selection.nodeIds[0]
      const worldDx = dx / this.viewport.zoom
      const worldDy = dy / this.viewport.zoom
      const graph = this.store.getGraph()
      this.store.setGraph({
        ...graph,
        nodes: graph.nodes.map((n) =>
          n.id === nodeId ? { ...n, x: n.x + worldDx, y: n.y + worldDy } : n,
        ),
      })
    } else {
      this.viewport.panBy(dx, dy)
      this.redraw()
    }
  }

  onPointerUp(): void {
    this.isDragging = false
  }

  onWheel(e: WheelEvent): void {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR
    this.viewport.zoomAt(e.offsetX, e.offsetY, factor)
    this.redraw()
  }
}
