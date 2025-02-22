import { ReactNode } from "react";
import GraphCanvas from "./GraphCanvas";
import { GraphEdgeProps } from "@/app/types";
import { keyframes, motion } from "framer-motion"
import "../styles/GraphEdge.css";
import { text } from "stream/consumers";

const GraphEdge: React.FC<GraphEdgeProps> = ({id, sourceID, targetID, weight, getNodePosition, directed = false, activeAnimation = false}) => {

    const source = getNodePosition(sourceID)
    const target = getNodePosition(targetID)
    const sourceX = source.x
    const sourceY = source.y
    const targetX = target.x
    const targetY = target.y

    

    return (
        <>
        {sourceID != targetID ? 
        <>
        <line
            id={id}
            //className={activeAnimation ? "animated-edge" : "edge"}
            x1={sourceX}
            y1={sourceY}
            x2={targetX}
            y2={targetY}
            strokeWidth="3px"
            stroke="rgb(0,0,0)"
            markerEnd={directed ? "url(#arrowhead)" : undefined}>
            {activeAnimation ? 
                <animate
                    attributeName="stroke"
                    from="rgb(0,0,0)"
                    to="rgb(0,128,0)"
                    begin="0s"
                    dur="9s"
                    fill="freeze"
                /> 
                //<motion.line
                //id={id}
                //animate={{ stroke: ["rgb(0,0,0)" , "rgb(0,128,0)"] }}
                //transition={{
                //    times: [0,1],
                //    duration: 9,
                //    type: "keyframes",
                //    ease: "easeIn"
                //}}
                ///>
                : null}
        </line> 
        <rect
            x={(sourceX + targetX)/2-5}
            y={(sourceY + targetY)/2-5}
            width={15}
            height={15}
            fill="white"
            >
        </rect>
        <text
            x={(sourceX + targetX)/2}
            y={(sourceY + targetY)/2}
        >
            {weight}
        </text>
        </>
        :
        <circle
            id={id}
            cx={sourceX+20}
            cy={sourceY+20}
            r="20px"
            fillOpacity="0"
            stroke="black"
            strokeWidth="3px">
        </circle>}
        </>
    )
}

export default GraphEdge