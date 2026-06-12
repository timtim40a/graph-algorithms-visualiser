import { useCallback, useEffect, useRef } from 'react'
import { GraphInteractionController } from '../canvas/GraphInteractionController'
import { GraphRenderer } from '../canvas/GraphRenderer'
import { ViewportController } from '../canvas/ViewportController'
import { useGraphStore } from '../store/useGraphStore'

export function CanvasViewport() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const rendererRef = useRef<GraphRenderer | null>(null)
    const viewportRef = useRef<ViewportController | null>(null)
    const controllerRef = useRef<GraphInteractionController | null>(null)

    const graph = useGraphStore((s) => s.graph)
    const selection = useGraphStore((s) => s.selection)

    // Reactive redraw — fires whenever graph or selection changes via useEffect below
    const redraw = useCallback(() => {
        const canvas = canvasRef.current
        const renderer = rendererRef.current
        const viewport = viewportRef.current
        if (!canvas || !renderer || !viewport) return
        renderer.render(graph, selection, viewport, canvas.width, canvas.height)
    }, [graph, selection])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const viewport = new ViewportController()
        const renderer = new GraphRenderer(ctx)

        // Stable redraw reads fresh Zustand state — used for imperative pan/zoom
        // that bypass React's render cycle
        const stableRedraw = () => {
            const { graph: g, selection: s } = useGraphStore.getState()
            renderer.render(g, s, viewport, canvas.width, canvas.height)
        }

        controllerRef.current = new GraphInteractionController(
            viewport,
            {
                getGraph: () => useGraphStore.getState().graph,
                getSelection: () => useGraphStore.getState().selection,
                getTool: () => useGraphStore.getState().tool,
                setGraph: useGraphStore.getState().setGraph,
                setSelection: useGraphStore.getState().setSelection,
            },
            stableRedraw,
        )
        viewportRef.current = viewport
        rendererRef.current = renderer

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            stableRedraw()
        }
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)
        resize()

        return () => ro.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        redraw()
    }, [redraw])

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                width: '100%',
                height: '100%',
                touchAction: 'none',
            }}
            onPointerDown={(e) =>
                controllerRef.current?.onPointerDown(e.nativeEvent)
            }
            onPointerMove={(e) =>
                controllerRef.current?.onPointerMove(e.nativeEvent)
            }
            onPointerUp={() => controllerRef.current?.onPointerUp()}
            onWheel={(e) => controllerRef.current?.onWheel(e.nativeEvent)}
        />
    )
}
