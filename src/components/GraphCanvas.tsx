import React, { useState, MouseEvent, useEffect } from "react";
import "../styles/GraphCanvas.css";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";
import { GraphEdgeProps, GraphNodeProps } from "@/app/types";
import AdjacencyListInput from "./AdjacencyListInput";
import AdjacencyListElement from "./AdjacencyListElement";

type GraphCanvasProps = {
    canvasHeight?: number;
    canvasWidth?: number;
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({canvasHeight = 200, canvasWidth = 200}) => {

    const [nodeList, setNodeList] = useState<GraphNodeProps[]>([]);
    const [selectedNodes, setSelectedNodes] = useState<string[]>(["none"]);
    const [edgeList, setEdgeList] = useState<GraphEdgeProps[]>([]);
    const [isCreatingEdge, setIsCreatingEdge] = useState<boolean>(false);

    const toggleEdgeCreation = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setIsCreatingEdge((prevIsCreatingEdge) => !prevIsCreatingEdge)
    }

    const getNodePosition = (id: string) => {
        const node = nodeList.find((n) => n.id == id);
        return node ? {x: node.x, y: node.y} : null;
    }

    const handleNodeClick = (id: string) => {
        if (isCreatingEdge) {
            console.log("clicked for edge: " + id)
            console.log(selectedNodes)
            console.log(selectedNodes[selectedNodes.length-1])
            createNewEdge(selectedNodes[selectedNodes.length-1], id)
            setSelectedNodes((prevSelectedNodes) => [prevSelectedNodes[selectedNodes.length-1], id])
        } else {
            console.log("just clicked: " + id)
            setSelectedNodes((prevSelectedNode) => 
                prevSelectedNode.includes(id) ? ["none"] : [id]
            )
        }
    }

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const id = "n" + nodeList.length.toString();
        const newNode: GraphNodeProps = {
            id,
            value: id.slice(1),
            selected: false,
            x: e.clientX,
            y: e.clientY,
            onClick: () => handleNodeClick(id)
        };
        setNodeList((prevNodeList) => [...prevNodeList, newNode])
        console.log("id = " + id + " x&y = " + newNode.x + " " + newNode.y)
    };

    const createNewEdge = (sourceID: string, targetID: string) => {
        const id = "e" + sourceID + targetID;
        if (sourceID == "none" || targetID == "none") {
            console.warn(`Edge cannot be rendered: Missing node positions for ${sourceID} or ${targetID}`);
            return null;
        }
        if (edgeList.some((edge) => edge.id == id)) {
            console.warn(`Edge cannot be rendered: Edge between ${sourceID} and ${targetID} already exists`);
            return null;
        }
        const newEdge: GraphEdgeProps = {
            id,
            sourceID: sourceID,
            targetID: targetID,
            activeAnimation: false,
            directed: false,
            getNodePosition: getNodePosition
        }
        setEdgeList((updatedEdgeList) => [...updatedEdgeList, newEdge])
    }

    useEffect(() => {
        console.log(`Edge creation mode is now: ${isCreatingEdge ? "ON" : "OFF"}`);
    }, [isCreatingEdge]); // Runs whenever isCreatingEdge changes

    return (
        <>
        <button onClick={(e) => toggleEdgeCreation(e)}>{isCreatingEdge ? "Edges ON" : "Edges OFF"}</button>
        <label>
                {`Currently selected nodes: ${selectedNodes.length == 1 ? 
                    selectedNodes : selectedNodes[0] + " " + selectedNodes[1]}`}
        </label>
        <div id="main" className="canvas" onClick={handleCanvasClick}>
            <svg
            className="edge-layer"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none", // for SVG layer to not block mouse events for the canvas
            }}>
            {edgeList.map((graphEdge) => {
                return <GraphEdge
                key={graphEdge.id}
                id={graphEdge.id}
                sourceID={graphEdge.sourceID}
                targetID={graphEdge.targetID}
                directed={false}
                activeAnimation={false}
                getNodePosition={getNodePosition}
                />
            })}
            </svg>
            {nodeList.map((graphNode) => {
            return <GraphNode 
                key={graphNode.id}
                id={graphNode.id}
                value={graphNode.value}
                selected={selectedNodes.includes(graphNode.id) ? true : false} 
                x={graphNode.x} 
                y={graphNode.y} 
                onClick={() => handleNodeClick(graphNode.id)}/>})}
            
            
            <div className="right-sidebar">
            <AdjacencyListInput/>
            {edgeList.map((edge) => {
                return <AdjacencyListElement
                {...edge}
                />})}
            </div>
        </div>
        </>
    )
}

export default GraphCanvas