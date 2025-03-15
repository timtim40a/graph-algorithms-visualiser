export type GraphNodeProps = {
    id: string;
    value: string;
    selected: boolean;
    x: number;
    y: number;
    onFrontier: boolean;
    onClick: ((event: React.MouseEvent<HTMLDivElement>, id: string) => void);
}

export type GraphEdgeProps = {
    id: string;
    sourceID: string;
    targetID: string;
    weight: number;
    directed: boolean;
    activeAnimation: boolean
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
    nodes: string[];
    edges: [string, string][];
    distances?: Map<string, number>;
}

export type AnimationElementProps = {
    node: string;
    visible: boolean;
    active: boolean;
    weight?: string;
}