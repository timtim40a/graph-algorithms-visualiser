import React, { useState, MouseEvent, useEffect } from "react";
import "../styles/GraphCanvas.css";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";
import { GraphEdgeProps, GraphNodeProps } from "@/app/types";
import AdjacencyListInput from "./AdjacencyListInput";
import AdjacencyListElement from "./AdjacencyListElement";
import { buildAdjacencyList, bfs, dfs } from "@/utilities/GraphAlgorithms";

type GraphCanvasProps = {
    canvasHeight?: number;
    canvasWidth?: number;
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({canvasHeight = 200, canvasWidth = 200}) => {

    const [nodeList, setNodeList] = useState<GraphNodeProps[]>([]);
    const [selectedNodes, setSelectedNodes] = useState<string[]>(["none"]);
    const [edgeList, setEdgeList] = useState<GraphEdgeProps[]>([]);
    const [isCreatingEdge, setIsCreatingEdge] = useState<boolean>(false);
    const [isDeletingNode, setIsDeletingNode] = useState<boolean>(false);

    /*
    0: Creating Nodes
    1: Creating Edges
    2: Deleting Nodes
    3: (reserved) Deleting Edges
    4: Altering Nodes
    5: Altering Edges
    */
    const [nodeCounter, setNodeCounter] = useState<number>(0);

    const toggleEdgeCreation = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setIsCreatingEdge((prevIsCreatingEdge) => !prevIsCreatingEdge)
    }

    const toggleNodeDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setIsDeletingNode((prevIsDeletingNode) => !prevIsDeletingNode)
    }

    const getNodePosition = (id: string) => {
        const node = nodeList.find((n) => n.id == id);
        return node ? {x: node.x, y: node.y} : null;
    }

    const handleNodeClick = (id: string) => {
        if (isDeletingNode) {
            console.log("node " + id + " is being deleted")
            handleNodeDelete(id)
        } else if (isCreatingEdge) {
            console.log("clicked for edge: " + id)
            console.log(selectedNodes)
            console.log(selectedNodes[selectedNodes.length-1])
            createNewEdge(selectedNodes[selectedNodes.length-1], id, false)
            setSelectedNodes((prevSelectedNodes) => [prevSelectedNodes[selectedNodes.length-1], id])
        } else {
            console.log("just clicked: " + id)
            setSelectedNodes((prevSelectedNode) => 
                prevSelectedNode.includes(id) ? ["none"] : [id]
            )
        }
    }

    const handleNodeDelete = (idToDelete: string) => {
        console.log(idToDelete)
        console.log(edgeList.map((edge) => edge.targetID + " " + edge.sourceID))
        const updateEdges = edgeList.filter((edge) => edge.targetID !== idToDelete 
            && edge.sourceID !== idToDelete)
        const updateNodes = nodeList.filter((node) => node.id !== idToDelete)
        setEdgeList(updateEdges)
        setNodeList(updateNodes)
    }

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const id = "n" + nodeCounter;
        const newNode: GraphNodeProps = {
            id,
            value: id.slice(1),
            selected: false,
            x: e.clientX,
            y: e.clientY,
            onClick: () => handleNodeClick(id)
        };
        setNodeList((prevNodeList) => [...prevNodeList, newNode])
        setNodeCounter((prevNodeCounter) => prevNodeCounter += 1)
        console.log("id = " + id + " x&y = " + newNode.x + " " + newNode.y)
    };

    const createNewEdge = (sourceID: string, targetID: string, directed: boolean) => {
        const id = "e" + sourceID + targetID;
        if (sourceID == "none" || targetID == "none") {
            console.warn(`Edge cannot be rendered: Missing node positions for ${sourceID} or ${targetID}`);
            return null;
        }
        if (edgeList.some((edge) => edge.id == id || edge.id == "e" + targetID + sourceID)) {
            console.warn(`Edge cannot be rendered: Edge between ${sourceID} and ${targetID} already exists`);
            return null;
        }
        const newEdge: GraphEdgeProps = {
            id,
            sourceID: sourceID,
            targetID: targetID,
            activeAnimation: false,
            directed: directed,
            getNodePosition: getNodePosition
        }
        setEdgeList((updatedEdgeList) => [...updatedEdgeList, newEdge])
        /*if (!directed && sourceID != targetID) {
            const idReverse = "e" + targetID + sourceID;
            if (edgeList.some((edge) => edge.id == idReverse)) {
                console.warn(`Edge cannot be rendered: Edge between ${sourceID} and ${targetID} already exists`);
                return null;
            }
            const newEdgeReverse: GraphEdgeProps = {
                id: idReverse,
                sourceID: targetID,
                targetID: sourceID,
                activeAnimation: false,
                directed: false,
                getNodePosition: getNodePosition
            }
            setEdgeList((updatedEdgeList) => [...updatedEdgeList, newEdgeReverse])
        }*/
    }

    const getBfsPath = (startID: string) => {
        return bfs(startID, buildAdjacencyList(nodeList, edgeList))
    }

    const getDfsPath = (startID: string) => {
        return dfs(startID, buildAdjacencyList(nodeList, edgeList))
    }

    const startSearchAnimation = async (searchOrder: string[][]) => {
        console.log(searchOrder)
        for (let i = 0; i < searchOrder.length; i++) {
            const id = "e" + searchOrder[i][0] + searchOrder[i][1]
            const idReverse = "e" + searchOrder[i][1] + searchOrder[i][0]
            const edgeToAnimate = edgeList.find((edge) => edge.id === id || edge.id === idReverse);
            const updateEdges = edgeList.filter((edge) => edge.id !== id && edge.id !== idReverse);
            await new Promise(resolve => setTimeout(resolve, 1000))
            edgeToAnimate ? edgeToAnimate.activeAnimation = true : null
            console.log(edgeToAnimate)
            edgeToAnimate ? setEdgeList([...updateEdges, edgeToAnimate]) : null
        }
        await new Promise(resolve => setTimeout(resolve, 10000))
        stopAnimation()
    }

    const stopAnimation = () => {
        const stoppedAnimationEdgeList = edgeList
        stoppedAnimationEdgeList.forEach((edge) => edge.activeAnimation = false)
        setEdgeList(stoppedAnimationEdgeList)
    }

    const deleteAll = (kind: string = "nodes") => {
        if (kind === "nodes") {
            setEdgeList([])
            setNodeList([])
            setSelectedNodes(["none"])
            setNodeCounter(0)
        }
        if (kind === "edges") {
            setEdgeList([])
        }
    }

    useEffect(() => {

    }, [edgeList])

    useEffect(() => {
        console.log(`Edge creation mode is now: ${isCreatingEdge ? "ON" : "OFF"}`);
        isCreatingEdge ? setIsDeletingNode(false) : null;
    }, [isCreatingEdge]); // Runs whenever isCreatingEdge changes

    useEffect(() => {
        console.log(`Node deletion mode is now: ${isDeletingNode ? "ON" : "OFF"}`);
        isDeletingNode ? setIsCreatingEdge(false) : null;
        setSelectedNodes(["none"]);
    }, [isDeletingNode]); // Runs whenever isDeletingNode changes

    return (
        <>
            <button onClick={(e) => toggleEdgeCreation(e)}>
                {isCreatingEdge ? "Edges ON" : "Edges OFF"}
            </button>
            <button onClick={(e) => toggleNodeDeletion(e)}>
                {isDeletingNode ? "Delete Nodes ON" : "Delete Nodes OFF"}
            </button>
            <button onClick={(e) => startSearchAnimation(getBfsPath("n" + (0)))}>
                Get BFS path
            </button>
            <button onClick={(e) => startSearchAnimation(getDfsPath("n" + (0)))}>
                Get DFS path
            </button>
            <button onClick={(e) => deleteAll("nodes")}>
                Clear
            </button>
            <button onClick={(e) => deleteAll("edges")}>
                Clear Edges
            </button>
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
                activeAnimation={graphEdge.activeAnimation}
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
                return <AdjacencyListElement key={edge.id + "ale"}
                {...edge}
                />})}
            </div>
        </div>
        </>
    )
}

export default GraphCanvas