import { Html } from "next/document";
import "../styles/GraphNode.css"
import { root } from "postcss";
import { GraphNodeProps } from "@/app/types";

const GraphNode: React.FC<GraphNodeProps> = ({id, value, selected, x, y, activeAnimation, onClick}) => {

    //const nodeSize = Number(getComputedStyle().getPropertyValue("--node-size").slice(0,-2))
    const nodeSize = 30

    const determineState = () => {
        let c = "graph-node"
        if (selected) {
            c += " selected"
        }
        
        if (activeAnimation === 1) {
            c += " not-observed"
        } else if (activeAnimation === 2) {
            c += " current"
        } else if (activeAnimation === 3) {
            c += " on-frontier"
        } else if (activeAnimation === 4) {
            c += " observed"
        }

        return c
    }

    return (
        <>
        <div 
            id={id} 
            className={determineState()} 
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