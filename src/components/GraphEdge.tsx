import { GraphEdgeProps } from "@/app/types";
import { keyframes, motion } from "framer-motion"
import "../styles/GraphEdge.css";
import { text } from "stream/consumers";
import useGraphStore from "@/store/useGraphStore";

const GraphEdge: React.FC<GraphEdgeProps> = ({id, sourceID, targetID, weight, directed, activeAnimation = false}) => {

    const { nodes, isGraphDirected } = useGraphStore()
    
    const getNodePosition = (id: string) => {
        const node = nodes.find((n) => n.id === id);
        return node ? { x: node.x, y: node.y } : {x:0, y:0};
    };

    const source = getNodePosition(sourceID)
    const target = getNodePosition(targetID)
    const sourceX = source.x
    const sourceY = source.y
    const targetX = target.x
    const targetY = target.y
    const nodeSize = 30

    const edgeLength = Math.sqrt(Math.pow(targetX - sourceX,2) + Math.pow(targetY - sourceY,2))
    const edgeEndX = (edgeLength*targetX + nodeSize*sourceX)/(edgeLength+nodeSize)
    const edgeEndY = (edgeLength*targetY + nodeSize*sourceY)/(edgeLength+nodeSize)
    

    

    

    return (
        <>
        {sourceID != targetID ? 
        <>
        <defs>
            <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
        </defs>
        <line
            id={isGraphDirected ? "e" + sourceID + targetID : id}
            //className={activeAnimation ? "animated-edge" : "edge"}
            x1={sourceX}
            y1={sourceY}
            x2={isGraphDirected ? edgeEndX : targetX}
            y2={isGraphDirected ? edgeEndY : targetY}
            strokeWidth="3px"
            stroke="rgb(0,0,0)"
            markerEnd={isGraphDirected ? "url(#arrow)" : undefined}>
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