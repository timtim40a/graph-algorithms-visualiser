import React, { useState, MouseEvent } from "react";
import "../styles/GraphCanvas.css";
import GraphNode, { GraphNodeProps } from "./GraphNode";
import GraphEdge, { GraphEdgeProps } from "./GraphEdge";

type GraphCanvasProps = {
    canvasHeight?: number;
    canvasWidth?: number;
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({canvasHeight = 200, canvasWidth = 200}) => {

    const [nodeList, setNodeList] = useState<GraphNodeProps[]>([]);
    const [selectedNode, setSelectedNode] = useState<string>();
    const [nodesToEdge, setNodesToEdge] = useState<string[]>([]);
    const [edgeList, setEdgeList] = useState<GraphEdgeProps[]>([]);
    const [isCreatingEdge, setIsCreatingEdge] = useState<boolean>(true);

    const getNodePosition = (id: string) => {
        const node = nodeList.find((n) => n.id == id);
        return node ? {x: node.x, y: node.y} : null;
    }

    const toggleNodeSelection = (e: React.MouseEvent<HTMLDivElement>) => {
        let id: string = e.currentTarget.id;
        console.log(id)
        selectedNode == id ? setSelectedNode("") : setSelectedNode(id)
        if (isCreatingEdge) {
            console.log(nodesToEdge)
            if (nodesToEdge.length === 1) {
                createNewEdge(nodesToEdge[0], id); // Create edge using the existing and current node
                setNodesToEdge([]); // Reset after creating the edge
            } else {
                setNodesToEdge([id]); // Start the edge creation process
            }}
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const id = "n" + nodeList.length.toString();
        const newNode: GraphNodeProps = {
            id,
            value: id.slice(1),
            selected: false,
            x: e.clientX,
            y: e.clientY,
            onClick: (event) => toggleNodeSelection(event)
        };
        setNodeList((prevNodeList) => [...prevNodeList, newNode])
        console.log("id = " + id + " x&y = " + newNode.x + " " + newNode.y)
    };

    const createNewEdge = (sourceID: string, targetID: string) => {
        const id = "e" + sourceID + targetID;
        const newEdge: GraphEdgeProps = {
            id,
            sourceID: sourceID,
            targetID: targetID,
            directed: false,
            getNodePosition: getNodePosition
        }
        setEdgeList((updatedEdgeList) => [...updatedEdgeList, newEdge])
    }


    return (
        <>
        <div id="main" className="canvas" onClick={handleCanvasClick}>
            {nodeList.map((graphNode) => {
            return <GraphNode 
                key={graphNode.id}
                id={graphNode.id}
                value={graphNode.value}
                selected={graphNode.id == selectedNode ? true : false} 
                x={graphNode.x} 
                y={graphNode.y} 
                onClick={(event) => graphNode.onClick(event, graphNode.id)}/>})}
            <svg
            className="edge-layer"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none", // Ensures SVG does not block mouse events for the canvas
            }}>
            {edgeList.map((graphEdge) => {
                return <GraphEdge
                key={graphEdge.id}
                id={graphEdge.id}
                sourceID={graphEdge.sourceID}
                targetID={graphEdge.targetID}
                directed={false}
                getNodePosition={getNodePosition}
                />
            })}
            </svg>
        </div>
        </>
    )
}

export default GraphCanvas