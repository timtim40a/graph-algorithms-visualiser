export type GraphNodeProps = {
    id: string;
    value: string;
    selected: boolean;
    x: number;
    y: number;
    onClick: ((event: React.MouseEvent<HTMLDivElement>, id: string) => void);
}

export type GraphEdgeProps = {
    id: string;
    sourceID: string;
    targetID: string;
    directed: boolean;
    activeAnimation: boolean;
    getNodePosition: any;
}