import { Html } from "next/document";
import "../styles/GraphNode.css"
import { root } from "postcss";
import { GraphNodeProps } from "@/app/types";

const GraphNode: React.FC<GraphNodeProps> = ({id, value, selected, x, y, onClick}) => {

    //const nodeSize = Number(getComputedStyle().getPropertyValue("--node-size").slice(0,-2))
    const nodeSize = 30

    return (
        <>
        <div 
            id={id} 
            className={selected ? "graph-node selected" : "graph-node"} 
            style={{
                left:x-(nodeSize/2),
                top:y-(nodeSize/2)}}
            onClick={(event) => {
                event.stopPropagation();
                onClick(event, id);}
            }    
            >
            {value}
        </div>
        </>
    )
}

export default GraphNode