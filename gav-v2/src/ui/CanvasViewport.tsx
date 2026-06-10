import { useCallback, useEffect, useRef } from 'react'
import { GraphRenderer } from '../canvas/GraphRenderer'
import { hitTestEdge, hitTestNode } from '../canvas/hitTest'
import { ViewportController } from '../canvas/ViewportController'
import { useGraphStore } from '../store/useGraphStore'

const ZOOM_FACTOR = 0.9

export function CanvasViewport() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const rendererRef = useRef<GraphRenderer | null>(null)
    const viewportRef = useRef<ViewportController | null>(null)
    const isDraggingRef = useRef(false)
    const lastPointerRef = useRef({ x: 0, y: 0 })

    const graph = useGraphStore((s) => s.graph)
    const selection = useGraphStore((s) => s.selection)
    const tool = useGraphStore((s) => s.tool)
    const setSelection = useGraphStore((s) => s.setSelection)
    const setGraph = useGraphStore((s) => s.setGraph)

    // Re-render canvas whenever graph, selection, or viewport changes
    const redraw = useCallback(() => {
        const canvas = canvasRef.current
        const renderer = rendererRef.current
        const viewport = viewportRef.current
        if (!canvas || !renderer || !viewport) return
        renderer.render(graph, selection, viewport, canvas.width, canvas.height)
    }, [graph, selection])

    // Initialize canvas context, renderer, and viewport on mount
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        rendererRef.current = new GraphRenderer(ctx)
        viewportRef.current = new ViewportController()

        // Size canvas to its CSS size
        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            redraw()
        }
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)
        resize()

        return () => ro.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Redraw whenever state changes
    useEffect(() => {
        redraw()
    }, [redraw])

    // --- Pointer handlers ---

    const onPointerDown = useCallback(
        (e: React.PointerEvent<HTMLCanvasElement>) => {
            const viewport = viewportRef.current
            if (!viewport) return

            ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
            lastPointerRef.current = { x: e.clientX, y: e.clientY }

            const world = viewport.screenToWorld(
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY,
            )

            if (tool === 'select') {
                const hitNode = graph.nodes.find((n) =>
                    hitTestNode(n, world.x, world.y),
                )
                if (hitNode) {
                    setSelection({ nodeIds: [hitNode.id], edgeIds: [] })
                    isDraggingRef.current = true
                    return
                }
                const hitEdge = graph.edges.find((edge) =>
                    hitTestEdge(edge, graph.nodes, world.x, world.y),
                )
                if (hitEdge) {
                    setSelection({ nodeIds: [], edgeIds: [hitEdge.id] })
                    return
                }
                setSelection({ nodeIds: [], edgeIds: [] })
                isDraggingRef.current = true // pan
            }

            if (tool === 'addNode') {
                const id = crypto.randomUUID()
                setGraph({
                    ...graph,
                    nodes: [
                        ...graph.nodes,
                        { id, label: id.slice(0, 4), x: world.x, y: world.y },
                    ],
                })
            }

            if (tool === 'addEdge') {
                const hitNode = graph.nodes.find((n) =>
                    hitTestNode(n, world.x, world.y),
                )
                if (hitNode) {
                    if (
                        selection.nodeIds.length === 1 &&
                        selection.nodeIds[0] !== hitNode.id
                    ) {
                        // Add edge from selected node to hit node
                        const newEdge = {
                            id: crypto.randomUUID(),
                            source: selection.nodeIds[0],
                            target: hitNode.id,
                        }
                        setGraph({ ...graph, edges: [...graph.edges, newEdge] })
                        setSelection({ nodeIds: [], edgeIds: [] })
                    } else {
                        // Select this node as source
                        setSelection({ nodeIds: [hitNode.id], edgeIds: [] })
                    }
                }
            }

            if (tool === 'delete') {
                const hitNode = graph.nodes.find((n) =>
                    hitTestNode(n, world.x, world.y),
                )
                if (hitNode) {
                    setGraph({
                        nodes: graph.nodes.filter((n) => n.id !== hitNode.id),
                        edges: graph.edges.filter(
                            (e) =>
                                e.source !== hitNode.id &&
                                e.target !== hitNode.id,
                        ),
                    })
                    return
                }
                const hitEdge = graph.edges.find((e) =>
                    hitTestEdge(e, graph.nodes, world.x, world.y),
                )
                if (hitEdge) {
                    setGraph({
                        ...graph,
                        edges: graph.edges.filter((e) => e.id !== hitEdge.id),
                    })
                }
            }
        },
        [graph, selection, tool, setGraph, setSelection],
    )

    const onPointerMove = useCallback(
        (e: React.PointerEvent<HTMLCanvasElement>) => {
            const viewport = viewportRef.current
            if (!viewport || !isDraggingRef.current) return

            const dx = e.clientX - lastPointerRef.current.x
            const dy = e.clientY - lastPointerRef.current.y
            lastPointerRef.current = { x: e.clientX, y: e.clientY }

            if (tool === 'select' && selection.nodeIds.length > 0) {
                // Drag selected node
                const nodeId = selection.nodeIds[0]
                const worldDx = dx / viewport.zoom
                const worldDy = dy / viewport.zoom
                setGraph({
                    ...graph,
                    nodes: graph.nodes.map((n) =>
                        n.id === nodeId ?
                            { ...n, x: n.x + worldDx, y: n.y + worldDy }
                        :   n,
                    ),
                })
            } else {
                viewport.panBy(dx, dy)
                redraw()
            }
        },
        [graph, selection, tool, setGraph, redraw],
    )

    const onPointerUp = useCallback(() => {
        isDraggingRef.current = false
    }, [])

    const onWheel = useCallback(
        (e: React.WheelEvent<HTMLCanvasElement>) => {
            e.preventDefault()
            const viewport = viewportRef.current
            if (!viewport) return
            const factor = e.deltaY < 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR
            viewport.zoomAt(
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY,
                factor,
            )
            redraw()
        },
        [redraw],
    )

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                width: '100%',
                height: '100%',
                touchAction: 'none',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onWheel={onWheel}
        />
    )
}
