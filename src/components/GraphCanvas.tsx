import React, { useState, useEffect } from "react";
import "../styles/GraphCanvas.css";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";
import { GraphEdgeProps } from "@/app/types";
import AdjacencyListInput from "./AdjacencyListInput";
import AdjacencyListElement from "./AdjacencyListElement";
import { buildAdjacencyList, bfs, dfs, dijkstra } from "@/utilities/GraphAlgorithms";
import useGraphStore from "@/store/useGraphStore";

type GraphCanvasProps = {
    canvasHeight?: number;
    canvasWidth?: number;
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({ canvasHeight = 200, canvasWidth = 200 }) => {
    const { nodes, edges, addNode, removeNode, addEdge, removeEdge, alterEdge, switchNodeSelection } = useGraphStore();
    const [selectedNodes, setSelectedNodes] = useState<string[]>(["none"]);
    const [isCreatingEdge, setIsCreatingEdge] = useState<boolean>(false);
    const [isDeletingNode, setIsDeletingNode] = useState<boolean>(false);
    const [isEditModeOn, setIsEditModeOn] = useState<boolean>(false);
    const [nodeCounter, setNodeCounter] = useState<number>(0);

    const toggleEdgeCreation = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsCreatingEdge((prev) => !prev);
    };

    const toggleNodeDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsDeletingNode((prev) => !prev);
    };

    const toggleEditMode = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsEditModeOn((prev) => !prev);
    };

    const handleNodeClick = (id: string) => {
        if (isDeletingNode) {
            handleNodeDelete(id);
        } else if (isCreatingEdge) {
            createNewEdge(selectedNodes[selectedNodes.length - 1], id, false);
            setSelectedNodes((prev) => [prev[prev.length - 1], id]);
        } else if (!isEditModeOn) {
            setSelectedNodes((prev) => [prev[prev.length - 1], id]);
        } else {
            setSelectedNodes((prev) => (prev.includes(id) ? ["none"] : [id]));
        }
    };

    const handleNodeDelete = (idToDelete: string) => {
        console.log(idToDelete)
        console.log(edges.map((edge) => edge.targetID + " " + edge.sourceID))
        const updateEdges = edges.filter((edge) => edge.targetID === idToDelete 
            && edge.sourceID !== idToDelete)
        const updateNodes = nodes.filter((node) => node.id === idToDelete)
        updateEdges.forEach((edge) => removeEdge(edge.id))
        updateNodes.forEach((node) => removeNode(node.id))
    }


    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isEditModeOn) {
            const id = "n" + nodeCounter;
            addNode(id, id.slice(1), e.clientX, e.clientY, () => handleNodeClick(id));
            setNodeCounter((prev) => prev + 1);
        }
    };

    const createNewEdge = (sourceID: string, targetID: string, directed: boolean) => {
        const id = "e" + sourceID + targetID;
        if (sourceID == "none" || targetID == "none") {
            console.warn(`Edge cannot be rendered: Missing node positions for ${sourceID} or ${targetID}`);
            return null;
        }
        if (edges.some((edge) => edge.id == id || edge.id == "e" + targetID + sourceID)) {
            console.warn(`Edge cannot be rendered: Edge between ${sourceID} and ${targetID} already exists`);
            return null;
        }
        addEdge(id, sourceID, targetID, 1, directed, false)}

    const getBfsPath = (startID: string) => {
        return bfs(startID, buildAdjacencyList(nodes, edges))
    }
    
    const getDfsPath = (startID: string) => {
        return dfs(startID, buildAdjacencyList(nodes, edges))
    }
    
    const getDijPath = (sourceID: string, targetID: string) => {
        if (sourceID === targetID) {
            console.warn("only one node was selected: TWO required");
            return null;
        }
        return dijkstra(sourceID, targetID, buildAdjacencyList(nodes, edges))
    }

    const startSearchAnimation = async (searchOrder: { nodes: string[]; edges: [string, string][] } | null) => {
        if (!searchOrder) return;
        stopAnimation();
        const searchOrderNodes = searchOrder.nodes;
        const searchOrderEdges = searchOrder.edges;
        console.log(searchOrderEdges)
        for (let i = 0; i < searchOrderEdges.length; i++) {
            const edgeID = "e" + searchOrderEdges[i][0] + searchOrderEdges[i][1]
            const edgeReverseID = "e" + searchOrderEdges[i][1] + searchOrderEdges[i][0]
            const edgeToAnimate = edges.find((edge) => edge.id === edgeID || edge.id === edgeReverseID);
            edgeToAnimate ? alterEdge(edgeToAnimate.id, {activeAnimation: true}) : null
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log(edgeToAnimate)
        }
        await new Promise(resolve => setTimeout(resolve, 10000))
        stopAnimation()
    }

    const stopAnimation = () => {
        edges.forEach((edge) => alterEdge(edge.id, {activeAnimation: false}))
    }

    const deleteAll = (kind: string = "nodes") => {
        if (kind === "nodes") {
            edges.forEach((edge) => removeEdge(edge.id))
            nodes.forEach((node) => removeNode(node.id))
            setSelectedNodes(["none"])
            setNodeCounter(0)
        }
        if (kind === "edges") {
            edges.forEach((edge) => removeEdge(edge.id))
        }
    }

    useEffect(() => {
        if (!isEditModeOn) {
            setIsDeletingNode(false);
            setIsCreatingEdge(false);
        }
        setSelectedNodes(["none"]);
    }, [isEditModeOn]);

    useEffect(() => {
        console.log(`Edge creation mode is now: ${isCreatingEdge ? "ON" : "OFF"}`);
        isCreatingEdge ? setIsDeletingNode(false) : null;
    }, [isCreatingEdge]); // Runs whenever isCreatingEdge changes

    useEffect(() => {
        console.log(`Node deletion mode is now: ${isDeletingNode ? "ON" : "OFF"}`);
        isDeletingNode ? setIsCreatingEdge(false) : null;
        setSelectedNodes(["none"]);
    }, [isDeletingNode]); // Runs whenever isDeletingNode changes

    useEffect(() => {
        switchNodeSelection(selectedNodes)
    }, [selectedNodes])

    return (
        <>
            <button onClick={toggleEditMode} className={isEditModeOn ? "button pressed" : "button not-pressed"}>{isEditModeOn ? "Edit Mode ON" : "Edit Mode OFF"}</button>
            {isEditModeOn ? (
                <>
                    <button onClick={toggleEdgeCreation} className={isCreatingEdge ? "button pressed" : "button not-pressed"}>{isCreatingEdge ? "Edges ON" : "Edges OFF"}</button>
                    <button onClick={toggleNodeDeletion} className={isDeletingNode ? "button pressed" : "button not-pressed"}>{isDeletingNode ? "Delete Nodes ON" : "Delete Nodes OFF"}</button>
                    <button onClick={() => deleteAll('nodes')}>Clear</button>
                    <button onClick={() => deleteAll('edges')}>Clear Edges</button>
                </>
            ) : (
                <>
                    <button onClick={() => startSearchAnimation(getBfsPath(selectedNodes[selectedNodes.length-1]))}>
                        Get BFS path
                    </button>
                    <button onClick={() => startSearchAnimation(getDfsPath(selectedNodes[selectedNodes.length-1]))}>
                        Get DFS path
                    </button>
                    <button onClick={() => startSearchAnimation(getDijPath(selectedNodes[0],selectedNodes[selectedNodes.length-1]))}>
                        Get Dijkstra path
                    </button>
                </>
            )}
            <label>
                {`Currently selected nodes: ${selectedNodes.length === 1 ? selectedNodes[0] : selectedNodes.join(" ")}`}
            </label>
            <div id="main" className="canvas" onClick={handleCanvasClick}>
                <svg className="edge-layer" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                    {edges.map((edge) => (
                        <GraphEdge key={edge.id} {...edge} />
                    ))}
                </svg>
                {nodes.map((node) => (
                    <GraphNode key={node.id} {...node} onClick={() => handleNodeClick(node.id)}/>
                ))}
            </div>
            <div className="right-sidebar">
                    <AdjacencyListInput />
                    {edges.map((edge) => (
                        <AdjacencyListElement key={edge.id + "ale"} {...edge} />
                    ))}
            </div>
        </>
    );
};

export default GraphCanvas;
