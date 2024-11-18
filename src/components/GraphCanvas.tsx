import React, { useState, MouseEvent } from "react";
import "../styles/GraphCanvas.css";
import GraphNode, { GraphNodeProps } from "./GraphNode";
import { GraphEdgeProps } from "./GraphEdge";

type GraphCanvasProps = {
    canvasHeight?: number;
    canvasWidth?: number;
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({canvasHeight = 200, canvasWidth = 200}) => {

    const [nodeList, setNodeList] = useState<GraphNodeProps[]>([]);
    const [edgeList, setEdgeList] = useState<GraphEdgeProps[]>([]);
    const [isCreatingEdge, setIsCreatingEdge] = useState<boolean>(false);

    const getNodePosition = (id: string) => {
        const node = nodeList.find((n) => n.id == id);
        return node ? {x: node.x, y: node.y} : null;
    };

    const toggleNodeSelection = (event: React.MouseEvent<HTMLDivElement>,id: string) => {
        setNodeList((nodeList) => 
            nodeList.map((node) => 
                node.id == id ? {...node, selected: !node.selected} : {...node, selected: false}
            )
        );
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const id = "n" + nodeList.length.toString();
        const newNode: GraphNodeProps = {
            id,
            value: "default",
            selected: false,
            x: e.clientX,
            y: e.clientY,
            onClick: toggleNodeSelection
        };
        setNodeList((updatedNodeList) => [...updatedNodeList, newNode])
        console.log("id = " + id + " x&y = " + newNode.x + " " + newNode.y)
    };


    return (
        <>
        <div id="main" className="canvas" onClick={handleCanvasClick}>
            {nodeList.map((graphNode) => {
            return <GraphNode 
                key={graphNode.id}
                id={graphNode.id}
                value={graphNode.value}
                selected={graphNode.selected} 
                x={graphNode.x} 
                y={graphNode.y} 
                onClick={(event) => graphNode.onClick(event, graphNode.id)}/>})}
        </div>
        </>
    )
}

export default GraphCanvas