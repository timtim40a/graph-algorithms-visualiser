import type { GraphData, SelectionState } from "../types";
import type { Settings, Tool } from "../store/useGraphStore";
import { getNodeRadius } from "../core/graph-utils";
import { hitTestEdge, hitTestNode } from "./hitTest";
import type { ViewportController } from "./ViewportController";

const ZOOM_FACTOR = 0.9;

interface StoreAccess {
    getGraph: () => GraphData;
    getSelection: () => SelectionState;
    getTool: () => Tool;
    getSettings: () => Settings;
    setGraph: (g: GraphData) => void;
    setSelection: (s: SelectionState) => void;
}

export class GraphInteractionController {
    private isDragging = false;
    private lastPointer = { x: 0, y: 0 };
    private readonly viewport: ViewportController;
    private readonly store: StoreAccess;
    private readonly redraw: () => void;
    private readonly onStartRename?: (
        nodeId: string,
        offsetX: number,
        offsetY: number
    ) => void;

    constructor(
        viewport: ViewportController,
        store: StoreAccess,
        redraw: () => void,
        onStartRename?: (
            nodeId: string,
            offsetX: number,
            offsetY: number
        ) => void
    ) {
        this.viewport = viewport;
        this.store = store;
        this.redraw = redraw;
        this.onStartRename = onStartRename;
    }

    onPointerDown(e: PointerEvent): void {
        (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
        this.lastPointer = { x: e.clientX, y: e.clientY };

        const world = this.viewport.screenToWorld(e.offsetX, e.offsetY);
        const graph = this.store.getGraph();
        const selection = this.store.getSelection();
        const tool = this.store.getTool();
        const settings = this.store.getSettings();

        const findHitNode = () =>
            graph.nodes.find((n) =>
                hitTestNode(
                    n,
                    world.x,
                    world.y,
                    getNodeRadius(n.id, graph, settings)
                )
            );

        if (tool === "select") {
            const hitNode = findHitNode();
            if (hitNode) {
                this.store.setSelection({ nodeIds: [hitNode.id], edgeIds: [] });
                this.isDragging = true;
                return;
            }
            const hitEdge = graph.edges.find((e) =>
                hitTestEdge(e, graph.nodes, world.x, world.y)
            );
            if (hitEdge) {
                this.store.setSelection({ nodeIds: [], edgeIds: [hitEdge.id] });
                return;
            }
            this.store.setSelection({ nodeIds: [], edgeIds: [] });
            this.isDragging = true; // pan
        }

        if (tool === "addNode") {
            const hitNode = findHitNode();
            if (hitNode) {
                this.store.setSelection({ nodeIds: [hitNode.id], edgeIds: [] });
                return;
            }
            const id = crypto.randomUUID();
            this.store.setGraph({
                ...graph,
                nodes: [
                    ...graph.nodes,
                    { id, label: id.slice(0, 4), x: world.x, y: world.y },
                ],
            });
        }

        if (tool === "addEdge") {
            const hitNode = findHitNode();
            if (hitNode) {
                if (
                    selection.nodeIds.length === 1 &&
                    selection.nodeIds[0] !== hitNode.id
                ) {
                    this.store.setGraph({
                        ...graph,
                        edges: [
                            ...graph.edges,
                            {
                                id: crypto.randomUUID(),
                                source: selection.nodeIds[0],
                                target: hitNode.id,
                            },
                        ],
                    });
                    if (settings.consecutiveEdgeCreation) {
                        this.store.setSelection({
                            nodeIds: [hitNode.id],
                            edgeIds: [],
                        });
                    } else {
                        this.store.setSelection({ nodeIds: [], edgeIds: [] });
                    }
                } else {
                    this.store.setSelection({
                        nodeIds: [hitNode.id],
                        edgeIds: [],
                    });
                }
            }
        }

        if (tool === "delete") {
            const hitNode = findHitNode();
            if (hitNode) {
                this.store.setGraph({
                    nodes: graph.nodes.filter((n) => n.id !== hitNode.id),
                    edges: graph.edges.filter(
                        (e) =>
                            e.source !== hitNode.id && e.target !== hitNode.id
                    ),
                });
                return;
            }
            const hitEdge = graph.edges.find((e) =>
                hitTestEdge(e, graph.nodes, world.x, world.y)
            );
            if (hitEdge) {
                this.store.setGraph({
                    ...graph,
                    edges: graph.edges.filter((e) => e.id !== hitEdge.id),
                });
            }
        }
    }

    onPointerMove(e: PointerEvent): void {
        if (!this.isDragging) return;

        const dx = e.clientX - this.lastPointer.x;
        const dy = e.clientY - this.lastPointer.y;
        this.lastPointer = { x: e.clientX, y: e.clientY };

        const tool = this.store.getTool();
        const selection = this.store.getSelection();

        if (
            tool === "select" &&
            selection.nodeIds.length > 0 &&
            this.store.getSettings().draggableNodes
        ) {
            const nodeId = selection.nodeIds[0];
            const worldDx = dx / this.viewport.zoom;
            const worldDy = dy / this.viewport.zoom;
            const graph = this.store.getGraph();
            this.store.setGraph({
                ...graph,
                nodes: graph.nodes.map((n) =>
                    n.id === nodeId
                        ? { ...n, x: n.x + worldDx, y: n.y + worldDy }
                        : n
                ),
            });
        } else {
            this.viewport.panBy(dx, dy);
            this.redraw();
        }
    }

    onPointerUp(): void {
        this.isDragging = false;
    }

    onWheel(e: WheelEvent): void {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
        this.viewport.zoomAt(e.offsetX, e.offsetY, factor);
        this.redraw();
    }

    onDoubleClick(e: MouseEvent): void {
        const world = this.viewport.screenToWorld(e.offsetX, e.offsetY);
        const graph = this.store.getGraph();
        const settings = this.store.getSettings();

        const hitNode = graph.nodes.find((n) =>
            hitTestNode(
                n,
                world.x,
                world.y,
                getNodeRadius(n.id, graph, settings)
            )
        );
        if (hitNode && this.store.getSettings().renamableNodes) {
            this.onStartRename?.(hitNode.id, e.offsetX, e.offsetY);
        }
    }
}
