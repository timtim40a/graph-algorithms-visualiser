import { ReactNode } from "react";

export type GraphEdgeProps = {
    id: string;
    sourceID: string;
    targetID: string;
    directed: boolean;
}

const GraphEdge: React.FC<GraphEdgeProps> = ({sourceID, targetID, directed}) => {



    return null
}