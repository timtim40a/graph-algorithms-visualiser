import { ReactNode } from "react";
import GraphCanvas from "./GraphCanvas";
import { GraphEdgeProps } from "@/app/types";
import { keyframes, motion } from "framer-motion"
import "../styles/GraphEdge.css";

const GraphEdge: React.FC<GraphEdgeProps> = ({id, sourceID, targetID, getNodePosition, directed = false, activeAnimation = false}) => {

    const source = getNodePosition(sourceID)
    const target = getNodePosition(targetID)

    

    return (
        <>
        {sourceID != targetID ? 
        <line
            id={id}
            //className={activeAnimation ? "animated-edge" : "edge"}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
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