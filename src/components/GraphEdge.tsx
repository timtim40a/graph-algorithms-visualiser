import { ReactNode } from "react";
import GraphCanvas from "./GraphCanvas";
import { GraphEdgeProps } from "@/app/types";

const GraphEdge: React.FC<GraphEdgeProps> = ({id, sourceID, targetID, getNodePosition, directed = false, activeAnimation = false}) => {

    const source = getNodePosition(sourceID)
    const target = getNodePosition(targetID)

    

    return (
        <>
        {sourceID != targetID ? 
        <line
            id={id}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="black"
            strokeWidth="3px"
            markerEnd={directed ? "url(#arrowhead)" : undefined}>
            {activeAnimation ?
            <animate
                attributeName="stroke"
                begin="0s"
                dur="1s"
                keyTimes="0; 0.5; 1"
                values="#000000;#00AA00;#00DD00"
                fill="freeze"
            />
            : null}
        </line> 
        :
        <circle
            id={id}
            cx={source.x+20}
            cy={source.y+20}
            r="20px"
            fillOpacity="0"
            stroke="black"
            strokeWidth="3px">
        </circle>}
        </>
    )
}

export default GraphEdge