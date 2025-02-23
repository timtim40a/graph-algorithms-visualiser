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