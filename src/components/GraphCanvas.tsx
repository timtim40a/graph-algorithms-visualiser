import React, { useState, useEffect, useRef } from "react";
import "../styles/GraphCanvas.css";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";
import { GraphEdgeProps, GraphNodeProps, SearchOrder } from "@/app/types";
import AdjacencyListInput from "./AdjacencyListInput";
import AdjacencyListElement from "./AdjacencyListElement";
import { bfs, dfs, dijkstra, aStarWithEuclidean } from "@/utilities/GraphAlgorithms";
import useGraphStore from "@/store/useGraphStore";
import { source } from "framer-motion/client";
import InformationWindow from "./InformationWindow";

type GraphCanvasProps = {
    canvasHeight?: number;
    canvasWidth?: number;
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({ canvasHeight = 200, canvasWidth = 200 }) => {
    
    const buildAdjacencyList = (
        nodes: GraphNodeProps[],
        edges: GraphEdgeProps[]
      ): Map<string, {id: string, weight: number}[]> => {
        const adjacencyList = new Map<string, {id: string, weight: number}[]>();
        nodes.forEach((node) => adjacencyList.set(node.id, []));
      
        edges.forEach((edge) => {
          const neighbours = adjacencyList.get(edge.sourceID) || [];
          neighbours.push({id:edge.targetID, weight:edge.weight});
          adjacencyList.set(edge.sourceID, neighbours);
      
          if (!isGraphDirected) {
            const reverseNeighbours = adjacencyList.get(edge.targetID) || [];
            reverseNeighbours.push({id:edge.sourceID, weight:edge.weight});
            adjacencyList.set(edge.targetID, reverseNeighbours);
          }
        });
      
        return adjacencyList;
      };
    
    const { nodes, 
            edges, 
            isGraphDirected,
            isAnimationOn,
            addNode, 
            removeNode,
            alterNode, 
            addEdge, 
            removeEdge, 
            alterEdge, 
            sortEdges, 
            switchNodeSelection,
            setIsGraphDirected,
            setIsAnimationOn } = useGraphStore();
    const [selectedNodes, setSelectedNodes] = useState<string[]>(["none"]);
    const [isCreatingEdge, setIsCreatingEdge] = useState<boolean>(false);
    const [isDeletingNode, setIsDeletingNode] = useState<boolean>(false);
    const [isEditModeOn, setIsEditModeOn] = useState<boolean>(false);
    const [nodeCounter, setNodeCounter] = useState<number>(0);
    const [message, setMessage] = useState<[string,string]>(["Welcome!","log"]);
    const [adjList, setAdjList] = useState<Map<string, {id: string, weight: number}[]>>(buildAdjacencyList(nodes,edges));
    const divRef = useRef<HTMLDivElement | null>(null);

    const [isAnimationPaused, setIsAnimationPaused] = useState(false);
    const [animationIndex, setAnimationIndex] = useState(0);
    const [animationFrames, setAnimationFrames] = useState<[string, string][]>([]);
    const [searchOrder, setSearchOrder] = useState<SearchOrder>()

    useEffect(() => {
        divRef.current ?
        divRef.current.focus() : null        
    }, []);

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
        setAdjList(buildAdjacencyList(nodes, edges))
        sortEdges("asc");
        setIsEditModeOn((prev) => !prev);
    };

    const toggleDirectedGraph = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsGraphDirected();
    }

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
        const id = Number(sourceID.slice(1)) < Number(targetID.slice(1)) ? "e" + sourceID + targetID : "e" + targetID + sourceID
        if (sourceID == "none" || targetID == "none") {
            console.warn(`Edge cannot be rendered: Missing node positions for ${sourceID} or ${targetID}`);
            setMessage([`Edge cannot be rendered: Missing node positions for ${sourceID} or ${targetID}`,"alert"])
            return null;
        }
        if (edges.some((edge) => edge.id == id || edge.id == "e" + targetID + sourceID)) {
            console.warn(`Edge cannot be rendered: Edge between ${sourceID} and ${targetID} already exists`);
            setMessage([`Edge cannot be rendered: Edge between ${sourceID} and ${targetID} already exists`,"alert"]);
            return null;
        }
        addEdge(id, sourceID, targetID, 1, directed, false)
    }

    const handleHotkey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "e") { setIsEditModeOn((prev) => !prev) }
        else if (e.key === "d" && isEditModeOn) { setIsDeletingNode((prev) => !prev) }
        else if (e.key === "l" && isEditModeOn) { setIsCreatingEdge((prev) => !prev) }
    }

    const getBfsPath = (startID: string) => {
        return bfs(startID, adjList)
    }
    
    const getDfsPath = (startID: string) => {
        return dfs(startID, adjList)
    }
    
    const getDijPath = (sourceID: string, targetID: string) => {
        if (sourceID === targetID) {
            console.warn("Dijkstra algorithm requires two nodes selected.");
            setMessage(["Dijkstra algorithm requires two nodes selected.", "error"])
            return null;
        }
        if (edges.some((edge) => edge.weight < 0)) {
            console.warn("The graph contains negative weights. Dijkstra algorithm may return unexpected paths.");
            setMessage(["The graph contains negative weights. Dijkstra algorithm may return unexpected paths.", "alert"])
            return null;
        }
        return dijkstra(sourceID, targetID, adjList)
    }

    const getAStarPath = (sourceID: string, targetID: string) => {
        if (sourceID === targetID) {
            console.warn("A* algorithm requires two nodes selected.");
            setMessage(["A* algorithm requires two nodes selected.", "error"]);
            return null;
        } if (edges.some((edge) => edge.weight < 0)) {
            console.warn("The graph contains negative weights. A* algorithm may return unexpected paths.");
            setMessage(["The graph contains negative weights. A* algorithm may return unexpected paths.", "alert"])
            return null;
        }
        return aStarWithEuclidean(sourceID, targetID, nodes, adjList)
    }

    const startSearchAnimation = async (searchOrder: { nodes: string[]; edges: [string, string][] } | null) => {
        if (!searchOrder) return;
        stopAnimation();
        setIsAnimationOn(true);
        const searchOrderNodes = searchOrder.nodes;
        const searchOrderEdges = searchOrder.edges;
        console.log(searchOrderEdges)
        for (let i = 0; i < searchOrderEdges.length && isAnimationOn; i++) {
            const edgeID = "e" + searchOrderEdges[i][0] + searchOrderEdges[i][1]
            const edgeReverseID = "e" + searchOrderEdges[i][1] + searchOrderEdges[i][0]
            const edgeToAnimate = edges.find((edge) => edge.id === edgeID || edge.id === edgeReverseID);
            edgeToAnimate ? alterEdge(edgeToAnimate.id, {activeAnimation: true}) : null
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log(edgeToAnimate)
        }
    }

    const stopAnimation = (e?: React.MouseEvent<HTMLButtonElement>) => {
        e ? e.stopPropagation() : null;
        edges.forEach((edge) => alterEdge(edge.id, {activeAnimation: false}))
        setIsAnimationOn(false)
    }

    const deleteAll = (e: React.MouseEvent<HTMLButtonElement>, kind: string = "nodes") => {
        e.stopPropagation()
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
        if (!isAnimationOn || !searchOrder) return;
        setAnimationFrames(searchOrder.edges);
        setAnimationIndex(0);
      }, [searchOrder, isAnimationOn]);

      useEffect(() => {
        if (!isAnimationOn || isAnimationPaused || animationIndex >= animationFrames.length) return;
    
        const animateFrame = async () => {
          const [nodeA, nodeB] = animationFrames[animationIndex];
          const edgeID = "e" + nodeA + nodeB;
          const edgeReverseID = "e" + nodeB + nodeA;
          const edgeToAnimate = edges.find((edge) => edge.id === edgeID || edge.id === edgeReverseID);
    
          if (edgeToAnimate) {
            alterEdge(edgeToAnimate.id, { activeAnimation: true });
          }
    
          console.log(edgeToAnimate);
    
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setAnimationIndex((prev) => prev + 1);
        };
    
        animateFrame();
      }, [animationIndex, isAnimationOn, isAnimationPaused]);

    useEffect(() => {
        console.log(`Edge creation mode is now: ${isCreatingEdge ? "ON" : "OFF"}`);
        setMessage([`Edge creation mode is now: ${isCreatingEdge ? "ON" : "OFF"}`, "log"]);
        isCreatingEdge ? setIsDeletingNode(false) : null;
    }, [isCreatingEdge]); // Runs whenever isCreatingEdge changes

    useEffect(() => {
        console.log(`Node deletion mode is now: ${isDeletingNode ? "ON" : "OFF"}`);
        setMessage([`Node deletion mode is now: ${isCreatingEdge ? "ON" : "OFF"}`, "log"])
        isDeletingNode ? setIsCreatingEdge(false) : null;
        setSelectedNodes(["none"]);
    }, [isDeletingNode]); // Runs whenever isDeletingNode changes

    useEffect(() => {
        switchNodeSelection(selectedNodes)
    }, [selectedNodes])

    return (
        <>
            <div id="main" className="canvas" ref={divRef} tabIndex={0} onClick={handleCanvasClick} onKeyDown={handleHotkey}>
                <div className="left-sidebar">
                    <button onClick={toggleEditMode} className={isEditModeOn ? "button pressed" : "button not-pressed"}>{isEditModeOn ? "Edit Mode ON" : "Edit Mode OFF"}</button>
                    <br></br>
                    {isEditModeOn ? (
                        <>
                            <button onClick={toggleEdgeCreation} className={isCreatingEdge ? "button pressed" : "button not-pressed"}>{isCreatingEdge ? "Edges ON" : "Edges OFF"}</button>
                            <br></br>
                            <button onClick={toggleNodeDeletion} className={isDeletingNode ? "button pressed" : "button not-pressed"}>{isDeletingNode ? "Delete Nodes ON" : "Delete Nodes OFF"}</button>
                            <br></br>
                            <button onClick={(e) => deleteAll(e, 'nodes')}>Clear</button>
                            <br></br>
                            <button onClick={(e) => deleteAll(e, 'edges')}>Clear Edges</button>
                            <br></br>
                            <button onClick={toggleDirectedGraph} className={isGraphDirected ? "button pressed" : "button not-pressed"}> {isGraphDirected ? "Directed" : "Undirected"} </button>
                            <br></br>
                        </>
                    ) : (
                        <>
                            <button onClick={() => startSearchAnimation(getBfsPath(selectedNodes[selectedNodes.length-1]))}>
                                Get BFS path
                            </button>
                            <br></br>
                            <button onClick={() => startSearchAnimation(getDfsPath(selectedNodes[selectedNodes.length-1]))}>
                                Get DFS path
                            </button>
                            <br></br>
                            <button onClick={() => startSearchAnimation(getDijPath(selectedNodes[0],selectedNodes[selectedNodes.length-1]))}>
                                Get Dijkstra path
                            </button>
                            <br></br>
                            <button onClick={() => startSearchAnimation(getAStarPath(selectedNodes[0],selectedNodes[selectedNodes.length-1]))}>
                                Get A* path
                            </button>
                            <br></br>
                            {isAnimationOn ? (<>
                            <button onClick={(e) => stopAnimation(e)}>
                                Stop Animation
                            </button>
                            <br></br>
                            </>) : null}
                        </>
                    )}
                    <label>
                        {`Currently selected nodes: ${selectedNodes.length === 1 ? selectedNodes[0] : selectedNodes.join(" ")}`}
                    </label>
                </div>
                <svg className="edge-layer" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                    {edges.map((edge) => (
                        <GraphEdge key={edge.id} {...edge} />
                    ))}
                </svg>
                {nodes.map((node) => (
                    <GraphNode key={node.id} {...node} onClick={() => handleNodeClick(node.id)}/>
                ))}
                <div className="right-sidebar">
                    <AdjacencyListInput />
                    <div id="adj-list">
                    {edges.map((edge) => (
                        <AdjacencyListElement key={edge.id + "ale"} edge={{...(edge as GraphEdgeProps)}} editMode={isEditModeOn}/>
                    ))}
                    </div>
                    <InformationWindow key={"inf"} info={message[0]} inftype={message[1]}></InformationWindow>
                </div>
            </div>
        </>
    );
};

export default GraphCanvas;
