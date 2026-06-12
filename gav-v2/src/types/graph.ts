export interface GraphNode {
    id: string;
    label: string;
    x: number;
    y: number;
    /** Arbitrary domain data attached to the node */
    data?: Record<string, unknown>;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
    directed?: boolean;
    weight?: number;
    /** Arbitrary domain data attached to the edge */
    data?: Record<string, unknown>;
}

export interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export interface SelectionState {
    nodeIds: string[];
    edgeIds: string[];
}

export interface ViewportState {
    /** Pan offset in canvas pixels */
    x: number;
    y: number;
    /** Zoom scale factor (1 = 100%) */
    zoom: number;
}
