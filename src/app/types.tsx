export type GraphNodeProps = {
    id: string;
    value: string;
    selected: boolean;
    x: number;
    y: number;
    activeAnimation: number;
    onClick: ((event: React.MouseEvent<HTMLDivElement>, id: string) => void);
}

export type GraphEdgeProps = {
    id: string;
    sourceID: string;
    targetID: string;
    weight: number;
    activeAnimation: number;
    
}

export type AdjacencyListElementProps = {
    edge: GraphEdgeProps;
    editMode: boolean;
}

export type MessageProps = {
    info: string;
    inftype: string;
}

export type SearchOrder = {
    nodes: Map<string, number>[];
    edges: Map<[string, string], number>[];
    distances?: Map<string, number>[];
    heuristics?: Map<string, number>;
}

export type AnimationElementProps = {
    node: string;
    weight?: string;
}

export type DistancesTableProps = {
    animationIndex: number,
    distances: Map<string, number>[] | undefined, 
    heuristics?: Map<string, number>
} 