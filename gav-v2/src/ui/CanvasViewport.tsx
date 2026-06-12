import { useCallback, useEffect, useRef, useState } from "react";
import { GraphInteractionController } from "../canvas/GraphInteractionController";
import { GraphRenderer } from "../canvas/GraphRenderer";
import { ViewportController } from "../canvas/ViewportController";
import { useGraphStore } from "../store/useGraphStore";
import { RenameInput } from "./RenameInput";

interface RenamingTarget {
    nodeId: string;
    x: number;
    y: number;
    initialLabel: string;
}

export function CanvasViewport() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<GraphRenderer | null>(null);
    const viewportRef = useRef<ViewportController | null>(null);
    const controllerRef = useRef<GraphInteractionController | null>(null);

    const [renamingTarget, setRenamingTarget] =
        useState<RenamingTarget | null>(null);
    // Ref keeps stableRedraw current without re-creating it
    const renamingNodeIdRef = useRef<string | null>(null);
    useEffect(() => {
        renamingNodeIdRef.current = renamingTarget?.nodeId ?? null;
    }, [renamingTarget]);

    const graph = useGraphStore((s) => s.graph);
    const selection = useGraphStore((s) => s.selection);
    const settings = useGraphStore((s) => s.settings);

    // Reactive redraw — fires whenever graph, selection, settings, or rename target change
    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        const renderer = rendererRef.current;
        const viewport = viewportRef.current;
        if (!canvas || !renderer || !viewport) return;
        renderer.render(
            graph,
            selection,
            settings,
            viewport,
            canvas.width,
            canvas.height,
            renamingTarget?.nodeId
        );
    }, [graph, selection, settings, renamingTarget]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const viewport = new ViewportController();
        const renderer = new GraphRenderer(ctx);

        // Stable redraw reads fresh Zustand state — used for imperative pan/zoom
        const stableRedraw = () => {
            const {
                graph: g,
                selection: s,
                settings: st,
            } = useGraphStore.getState();
            renderer.render(
                g,
                s,
                st,
                viewport,
                canvas.width,
                canvas.height,
                renamingNodeIdRef.current ?? undefined
            );
        };

        controllerRef.current = new GraphInteractionController(
            viewport,
            {
                getGraph: () => useGraphStore.getState().graph,
                getSelection: () => useGraphStore.getState().selection,
                getTool: () => useGraphStore.getState().tool,
                getSettings: () => useGraphStore.getState().settings,
                setGraph: useGraphStore.getState().setGraph,
                setSelection: useGraphStore.getState().setSelection,
            },
            stableRedraw,
            (nodeId, offsetX, offsetY) => {
                const node = useGraphStore
                    .getState()
                    .graph.nodes.find((n) => n.id === nodeId);
                if (!node) return;
                setRenamingTarget({
                    nodeId,
                    x: offsetX,
                    y: offsetY,
                    initialLabel: node.label,
                });
            }
        );
        viewportRef.current = viewport;
        rendererRef.current = renderer;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            stableRedraw();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        return () => ro.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        redraw();
    }, [redraw]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    touchAction: "none",
                }}
                onPointerDown={(e) =>
                    controllerRef.current?.onPointerDown(e.nativeEvent)
                }
                onPointerMove={(e) =>
                    controllerRef.current?.onPointerMove(e.nativeEvent)
                }
                onPointerUp={() => controllerRef.current?.onPointerUp()}
                onWheel={(e) => controllerRef.current?.onWheel(e.nativeEvent)}
                onDoubleClick={(e) =>
                    controllerRef.current?.onDoubleClick(e.nativeEvent)
                }
            />
            {renamingTarget && (
                <RenameInput
                    {...renamingTarget}
                    onDone={() => setRenamingTarget(null)}
                />
            )}
        </div>
    );
}