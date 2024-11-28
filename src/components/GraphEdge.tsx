import { ReactNode } from "react";
import GraphCanvas from "./GraphCanvas";

export type GraphEdgeProps = {
    id: string;
    sourceID: string;
    targetID: string;
    directed: boolean;
    getNodePosition: any;
}

const GraphEdge: React.FC<GraphEdgeProps> = ({sourceID, targetID, getNodePosition, directed = false}) => {

    const source = getNodePosition(sourceID)
    const target = getNodePosition(targetID)

    if (!source || !target) {
        console.warn(`Edge cannot be rendered: Missing node positions for ${sourceID} or ${targetID}`);
        return null;
    }

    return (
        <line
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="black"
            markerEnd={directed ? "url(#arrowhead)" : undefined}>

        </line>
    )
}

export default GraphEdge