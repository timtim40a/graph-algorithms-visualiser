import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  ReactNode,
} from 'react'
import '../styles/GraphCanvas.css'
import GraphNode from './GraphNode'
import GraphEdge from './GraphEdge'
import GraphImportExport from './GraphImportExport'
import { GraphEdgeProps, GraphNodeProps, SearchOrder } from '@/app/types'
import AdjacencyListInput from './AdjacencyListInput'
import AdjacencyListElement from './AdjacencyListElement'
import {
  bfs,
  dfs,
  dijkstra,
  aStarWithEuclidean,
  bellmanFord,
  bestFirstSearch,
  ucs,
} from '@/utilities/GraphAlgorithms'
import useGraphStore from '@/store/useGraphStore'
import { source } from 'framer-motion/client'
import InformationWindow from './InformationWindow'
import AnimationElement from './AnimationElement'
import { error } from 'console'
import DistancesTable from './DistancesTable'
import Header from './Header'
import pseudocodes from '@/utilities/Pseudocodes'
import InfoTooltip from './InfoTooltip'
import { randomInt } from 'crypto'
import EdgeWeightRandomizer from './EdgeWeightRandomizer'
import WelcomeScreen from './WelcomeScreen'

type GraphCanvasProps = {
  canvasHeight?: number
  canvasWidth?: number
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  canvasHeight = 200,
  canvasWidth = 200,
}) => {
  const buildAdjacencyList = (
    nodes: GraphNodeProps[],
    edges: GraphEdgeProps[]
  ): Map<string, { id: string; weight: number }[]> => {
    const adjacencyList = new Map<string, { id: string; weight: number }[]>()
    nodes.forEach((node) => adjacencyList.set(node.id, []))

    edges.forEach((edge) => {
      const neighbours = adjacencyList.get(edge.sourceID) || []
      neighbours.push({ id: edge.targetID, weight: edge.weight })
      adjacencyList.set(
        edge.sourceID,
        neighbours.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)))
      )

      if (!isGraphDirected) {
        const reverseNeighbours = adjacencyList.get(edge.targetID) || []
        reverseNeighbours.push({ id: edge.sourceID, weight: edge.weight })
        adjacencyList.set(
          edge.targetID,
          reverseNeighbours.sort(
            (a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1))
          )
        )
      }
    })

    return adjacencyList
  }

  const {
    nodes,
    edges,
    currentInfoTooltip,
    isGraphDirected,
    isGraphCyclic,
    isGraphNegativeCyclic,
    isAnimationOn,
    showWelcome,
    addNode,
    removeNode,
    alterNode,
    clearNodes,
    addEdge,
    removeEdge,
    alterEdge,
    sortEdges,
    clearEdges,
    switchNodeSelection,
    setCurrentInfoTooltip,
    setIsGraphDirected,
    setIsGraphCyclic,
    setIsGraphNegativeCyclic,
    setIsAnimationOn,
    setShowWelcome,
  } = useGraphStore()
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [isCreatingEdge, setIsCreatingEdge] = useState<boolean>(false)
  const [isDeletingNode, setIsDeletingNode] = useState<boolean>(false)
  const [isEditModeOn, setIsEditModeOn] = useState<boolean>(false)
  const [nodeCounter, setNodeCounter] = useState<number>(0)
  const [message, setMessage] = useState<[string, string]>(['Welcome!', 'log'])
  const [adjList, setAdjList] = useState<
    Map<string, { id: string; weight: number }[]>
  >(buildAdjacencyList(nodes, edges))
  const [adjInput, setAdjInput] = useState<string>('')
  const divRef = useRef<HTMLDivElement | null>(null)

  const [isAnimationPaused, setIsAnimationPaused] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [animationIndex, setAnimationIndex] = useState(0)
  const [animationFrames, setAnimationFrames] = useState<
    [Map<[string, string], number>[], Map<string, number>[]]
  >([[], []])
  const [searchOrder, setSearchOrder] = useState<SearchOrder>()
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string>('')

  useEffect(() => {
    divRef.current ? divRef.current.focus() : null
  }, [])

  const toggleEdgeCreation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsCreatingEdge((prev) => !prev)
  }

  const toggleNodeDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsDeletingNode((prev) => !prev)
  }

  const toggleEditMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setAdjList(buildAdjacencyList(nodes, edges))
    sortEdges('asc')
    setIsEditModeOn((prev) => !prev)
  }

  const toggleDirectedGraph = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsGraphDirected()
  }

  const handleCloseWelcome = () => {
    setShowWelcome(false)
  }

  const handleNodeClick = (id: string) => {
    if (isDeletingNode) {
      handleNodeDelete(id)
    } else if (isCreatingEdge) {
      createNewEdge(selectedNodes[selectedNodes.length - 1], id, false)
      setSelectedNodes((prev) => [prev[prev.length - 1], id])
    } else if (!isEditModeOn) {
      setSelectedNodes((prev) => [prev[prev.length - 1], id])
    } else {
      setSelectedNodes((prev) => (prev.includes(id) ? ['none'] : [id]))
    }
  }

  const handleNodeDelete = (idToDelete: string) => {
    console.log(idToDelete)
    console.log(edges.map((edge) => edge.targetID + ' ' + edge.sourceID))
    const updateEdges = edges.filter(
      (edge) => edge.targetID === idToDelete && edge.sourceID !== idToDelete
    )
    const updateNodes = nodes.filter((node) => node.id === idToDelete)
    updateEdges.forEach((edge) => removeEdge(edge.id))
    updateNodes.forEach((node) => removeNode(node.id))
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditModeOn) {
      const id = 'n' + nodeCounter
      addNode(id, id.slice(1), e.clientX, e.clientY, () => handleNodeClick(id))
      setNodeCounter((prev) => prev + 1)
    }
  }

  const createNewEdge = (
    sourceID: string,
    targetID: string,
    directed: boolean
  ) => {
    const id =
      Number(sourceID.slice(1)) < Number(targetID.slice(1))
        ? 'e' + sourceID + targetID
        : 'e' + targetID + sourceID
    if (sourceID == 'none' || targetID == 'none') {
      console.warn(
        `Edge cannot be rendered: Missing node positions for ${sourceID} or ${targetID}`
      )
      setMessage([
        `Edge cannot be rendered: Missing node positions for ${sourceID} or ${targetID}`,
        'alert',
      ])
      return null
    }
    if (
      edges.some(
        (edge) => edge.id == id || edge.id == 'e' + targetID + sourceID
      )
    ) {
      console.warn(
        `Edge cannot be rendered: Edge between ${sourceID} and ${targetID} already exists`
      )
      setMessage([
        `Edge cannot be rendered: Edge between ${sourceID} and ${targetID} already exists`,
        'alert',
      ])
      return null
    }
    addEdge(id, sourceID, targetID, 1, directed, false)
  }

  const maxWeight = (): number => {
    const weights: number[] = []
    edges.map((edge) => weights.push(edge.weight))
    return Math.max(...weights)
  }

  const handleHotkey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'e') {
      setIsEditModeOn((prev) => !prev)
    } else if (e.key === 'd' && isEditModeOn) {
      setIsDeletingNode((prev) => !prev)
    } else if (e.key === 'l' && isEditModeOn) {
      setIsCreatingEdge((prev) => !prev)
    }
  }

  const getBfsPath = (startID: string) => {
    if (
      !selectedNodes ||
      (selectedNodes.includes('none') && selectedNodes.length === 1)
    ) {
      setMessage(['Select a node first', 'warn'])
      return
    }
    setCurrentAlgorithm('breadth-first-search')
    setMessage(['Breadth-First Search algorithm is now running...', 'log'])
    return bfs(startID, adjList)
  }

  const getDfsPath = (startID: string) => {
    if (
      !selectedNodes ||
      (selectedNodes.includes('none') && selectedNodes.length === 1)
    ) {
      setMessage(['Select a node first', 'warn'])
      return
    }
    setCurrentAlgorithm('depth-first-search')
    setMessage(['Depth-First Search algorithm is now running...', 'log'])
    return dfs(startID, adjList)
  }

  const getUnicostSearchPath = (sourceID: string, targetID: string) => {
    setCurrentAlgorithm('universal-cost-search')
    if (sourceID === targetID || sourceID === 'none' || targetID === 'none') {
      console.warn(
        'Universal-Cost Search algorithm requires two nodes selected.'
      )
      setMessage([
        'Universal-Cost Search algorithm requires two nodes selected.',
        'error',
      ])
      return null
    }
    setMessage([
      `Uniform-Cost Search algorithm is now running to get a path from node ${sourceID} to ${targetID}...`,
      'log',
    ])
    return ucs(sourceID, targetID, adjList)
  }

  const getBestFirstSearch = (sourceID: string, targetID: string) => {
    setCurrentAlgorithm('best-first-search')
    if (sourceID === targetID || sourceID === 'none' || targetID === 'none') {
      console.warn('Best-First Search algorithm requires two nodes selected.')
      setMessage([
        'Best-First Search algorithm requires two nodes selected.',
        'error',
      ])
      return null
    }
    setMessage([
      `Best-First Search algorithm is now running to get a path from node ${sourceID} to ${targetID}...`,
      'log',
    ])
    return bestFirstSearch(sourceID, targetID, nodes, adjList)
  }

  const getDijPath = (sourceID: string) => {
    if (
      !selectedNodes ||
      (selectedNodes.includes('none') && selectedNodes.length === 1)
    ) {
      setMessage(['Select a node first', 'warn'])
      return
    }
    setCurrentAlgorithm('dijkstra')
    if (edges.some((edge) => edge.weight < 0)) {
      console.warn(
        'The graph contains negative weights. Dijkstra algorithm may return unexpected paths.'
      )
      setMessage([
        'The graph contains negative weights. Dijkstra algorithm may return unexpected paths.',
        'alert',
      ])
      return null
    }
    setMessage(["Dijkstra's algorithm is now running...", 'log'])
    return dijkstra(sourceID, adjList)
  }

  const getAStarPath = (sourceID: string, targetID: string) => {
    if (sourceID === targetID || sourceID === 'none' || targetID === 'none') {
      console.warn('A* algorithm requires two nodes selected.')
      setMessage(['A* algorithm requires two nodes selected.', 'error'])
      return null
    } else if (edges.some((edge) => edge.weight < 0)) {
      console.warn(
        'The graph contains negative weights. A* algorithm may return unexpected paths.'
      )
      setMessage([
        'The graph contains negative weights. A* algorithm may return unexpected paths.',
        'alert',
      ])
      return null
    }
    setMessage([
      `A* algorithm is now running to get a path from node ${sourceID} to ${targetID}...`,
      'log',
    ])
    setCurrentAlgorithm('a-star')
    return aStarWithEuclidean(sourceID, targetID, nodes, maxWeight(), adjList)
  }

  const getBellmanFord = (sourceID: string, targetID: string) => {
    setCurrentAlgorithm('bellman-ford')
    if (sourceID === targetID || sourceID === 'none' || targetID === 'none') {
      console.warn('Bellman Ford algorithm requires two nodes selected.')
      setMessage([
        'Bellman Ford algorithm requires two nodes selected.',
        'error',
      ])
      return null
    }
    setMessage([
      `Bellman-Ford algorithm is now running to get a path from node ${sourceID} to ${targetID}...`,
      'log',
    ])
    try {
      setIsGraphNegativeCyclic(false)
      return bellmanFord(sourceID, targetID, nodes, adjList)
    } catch (error: any) {
      setMessage([error.message, 'error'])
      setIsGraphNegativeCyclic(true)
      return null
    }
  }

  const startAnimation = (newSearchOrder: SearchOrder | null | undefined) => {
    if (!newSearchOrder) return
    setSearchOrder(newSearchOrder)
    stopAnimation() // Reset first

    setTimeout(() => {
      setAnimationIndex(0)
      setAnimationFrames([newSearchOrder.edges, newSearchOrder.nodes])
      setIsAnimationOn(true)
    }, 10) // Small delay to avoid state update conflicts
  }

  const stopAnimation = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e ? e.stopPropagation : null
    setIsAnimationOn(false)
    setIsAnimationPaused(false)
    setAnimationIndex(0)
    setAnimationFrames([[], []])
    edges.forEach((edge) => (edge.activeAnimation = 0))
    nodes.forEach((node) => (node.activeAnimation = 0))
  }

  const pauseAnimation = () => setIsAnimationPaused(true)
  const resumeAnimation = () => setIsAnimationPaused(false)

  const nextFrame = () => {
    animationFrames[0][animationIndex].forEach(
      (animationMode, animationNodes) => {
        const edgeID = 'e' + animationNodes[0] + animationNodes[1]
        const edgeReverseID = 'e' + animationNodes[1] + animationNodes[0]
        const edgeToAnimate = edges.find(
          (edge) => edge.id === edgeID || edge.id === edgeReverseID
        )

        if (edgeToAnimate) {
          alterEdge(edgeToAnimate.id, { activeAnimation: animationMode })
        }

        console.log(edgeToAnimate)
      }
    )
    animationFrames[1][animationIndex].forEach(
      (animationMode, animationNode) => {
        alterNode(animationNode, { activeAnimation: animationMode })
        console.log(
          animationNode +
            ' mode: ' +
            animationMode +
            ' index: ' +
            animationIndex
        )
      }
    )
    if (animationIndex < animationFrames[0].length - 1) {
      setAnimationIndex((prev) => prev + 1)
    }
  }

  const deleteAll = (
    e: React.MouseEvent<HTMLButtonElement>,
    kind: string = 'nodes'
  ) => {
    e.stopPropagation()
    if (kind === 'nodes') {
      clearEdges()
      clearNodes()
      setSelectedNodes(['none'])
      setNodeCounter(0)
    }
    if (kind === 'edges') {
      clearEdges()
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAdjInput(event.target.value)
  }

  const clearSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setSelectedNodes([])
  }

  const heuristicsEdges = (): ReactNode => {
    const edges: ReactNode[] = []

    searchOrder?.nodes[animationIndex]?.forEach((animationMode, node) => {
      if (animationMode === 2) {
        edges.push(
          <GraphEdge
            key={node}
            id={node.toString()}
            sourceID={node}
            targetID={selectedNodes[selectedNodes.length - 1]} // Fixed negative index issue
            weight={searchOrder.heuristics?.get(node)!}
            activeAnimation={4}
          />
        )
      }
    })

    return edges
  }

  useEffect(() => {
    if (!isEditModeOn) {
      setIsDeletingNode(false)
      setIsCreatingEdge(false)
    }
    setSelectedNodes(['none'])
    stopAnimation()
    nodes.length > 2 ? getBellmanFord(nodes[0].id, nodes[1].id) : null
    setMessage([
      isEditModeOn ? 'You are now in Edit Mode' : 'You are now in View Mode',
      'log',
    ])
  }, [isEditModeOn])

  useEffect(() => {
    if (!isAnimationOn || !searchOrder) return
    setAnimationFrames([searchOrder.edges, searchOrder.nodes])
    setAnimationIndex(0)
  }, [searchOrder, isAnimationOn])

  useEffect(() => {
    if (
      !isAnimationOn ||
      isAnimationPaused ||
      animationIndex >= animationFrames[0].length
    )
      return

    const animateFrame = async () => {
      animationFrames[0][animationIndex].forEach(
        (animationMode, animationNodes) => {
          const edgeID = 'e' + animationNodes[0] + animationNodes[1]
          const edgeReverseID = 'e' + animationNodes[1] + animationNodes[0]
          const edgeToAnimate = edges.find(
            (edge) => edge.id === edgeID || edge.id === edgeReverseID
          )

          if (edgeToAnimate) {
            alterEdge(edgeToAnimate.id, { activeAnimation: animationMode })
          }

          console.log(edgeToAnimate)
        }
      )
      animationFrames[1][animationIndex].forEach(
        (animationMode, animationNode) => {
          alterNode(animationNode, { activeAnimation: animationMode })
        }
      )

      await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      setAnimationIndex((prev) => prev + 1)
    }
    animateFrame()
  }, [animationIndex, isAnimationOn, isAnimationPaused, animationSpeed])

  useEffect(() => {
    console.log(`Edge creation mode is now: ${isCreatingEdge ? 'ON' : 'OFF'}`)
    /*setMessage([
      `Edge creation mode is now: ${isCreatingEdge ? 'ON' : 'OFF'}`,
      'log',
    ])*/
    isCreatingEdge ? setIsDeletingNode(false) : null
  }, [isCreatingEdge]) // Runs whenever isCreatingEdge changes

  useEffect(() => {
    console.log(`Node deletion mode is now: ${isDeletingNode ? 'ON' : 'OFF'}`)
    /*setMessage([
      `Node deletion mode is now: ${isCreatingEdge ? 'ON' : 'OFF'}`,
      'log',
    ])*/
    isDeletingNode ? setIsCreatingEdge(false) : null
    setSelectedNodes(['none'])
  }, [isDeletingNode]) // Runs whenever isDeletingNode changes

  useEffect(() => {
    switchNodeSelection(selectedNodes)
  }, [selectedNodes])

  useEffect(() => {
    console.log(pseudocodes.get(currentAlgorithm))
  }, [currentAlgorithm])

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      setShowWelcome(true)
      localStorage.setItem('hasVisited', 'true')
    }
  }, [])

  const tenXtenGrid = (e: any) => {
    e.stopPropagation()
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        const id = i > 0 ? 'n' + i + j : 'n' + j
        const x = i * 60 + 400
        const y = j * 60 + 60
        addNode(id, id.slice(1), x, y, () => handleNodeClick(id))
      }
    }
    setNodeCounter(100)
    for (let i = 0; i < 100; i += 1) {
      const sourceID = 'n' + i
      if (i < 90) {
        const targetID = 'n' + (i + 10)
        addEdge('e' + sourceID + targetID, sourceID, targetID, 1, false, false)
      }
      if (i % 10 !== 9) {
        const targetID = 'n' + (i + 1)
        addEdge('e' + sourceID + targetID, sourceID, targetID, 1, false, false)
      }
    }
  }

  return (
    <>
      {showWelcome && <WelcomeScreen onClose={handleCloseWelcome} />}
      <div
        id="main"
        className="canvas"
        ref={divRef}
        tabIndex={0}
        onClick={handleCanvasClick}
        onKeyDown={handleHotkey}
      >
        {nodes.length === 0 ? (
          <label id="info" className="hint">
            {' '}
            {isEditModeOn
              ? 'Click anywhere to place a node'
              : 'The edit mode is off. Turn on the edit mode by pressing "E"'}{' '}
          </label>
        ) : null}
        <div className="left-sidebar">
          <button onClick={toggleEditMode} className={'button not-pressed'}>
            {isEditModeOn ? (
              <img
                src="/editmode-return.png"
                alt="Back to View Mode"
                className="icon view-mode"
              />
            ) : (
              <img
                src="/editmode.png"
                alt="Enter Edit Mode"
                className="icon edit-mode"
              />
            )}
          </button>
          <br></br>
          {isEditModeOn ? (
            <>
              <button
                onClick={toggleEdgeCreation}
                className={
                  isCreatingEdge ? 'button pressed' : 'button not-pressed'
                }
              >
                <img
                  src="/edges.png"
                  alt="Toggle Edges"
                  className="icon toggle-edges"
                />
              </button>
              <br></br>
              <button
                onClick={toggleNodeDeletion}
                className={
                  isDeletingNode ? 'button pressed' : 'button not-pressed'
                }
              >
                <img
                  src="/nodes.png"
                  alt="Delete Nodes"
                  className="icon delete-nodes"
                />
              </button>
              <br></br>
              <button onClick={(e) => deleteAll(e, 'nodes')}>
                <img src="/clearall.png" alt="Clear" className="icon clear" />
              </button>
              <br></br>
              <button onClick={(e) => deleteAll(e, 'edges')}>
                <img
                  src="/clearedges.png"
                  alt="Clear Edges"
                  className="icon clear-edges"
                />
              </button>
              <br></br>
              <button
                onClick={toggleDirectedGraph}
                className={
                  isGraphDirected ? 'button pressed' : 'button not-pressed'
                }
              >
                {' '}
                {isGraphDirected ? (
                  <img
                    src="/directed.png"
                    alt="to Directed"
                    className="icon directed"
                  />
                ) : (
                  <img
                    src="/undirected.png"
                    alt="to Undirected"
                    className="icon undirected"
                  />
                )}{' '}
              </button>
              <br></br>
              <button onClick={(e) => tenXtenGrid(e)}>Create 10x10 grid</button>
              <br></br>
            </>
          ) : (
            <>
              <button
                className="algorithm-button bfs"
                onClick={() =>
                  startAnimation(
                    getBfsPath(selectedNodes[selectedNodes.length - 1])
                  )
                }
              >
                Run BFS algorithm
              </button>
              <br></br>
              <button
                className="algorithm-button dfs"
                onClick={() =>
                  startAnimation(
                    getDfsPath(selectedNodes[selectedNodes.length - 1])
                  )
                }
              >
                Run DFS algorithm
              </button>
              <br></br>
              <button
                className="algorithm-button ucs"
                onClick={() =>
                  startAnimation(
                    getUnicostSearchPath(
                      selectedNodes[0],
                      selectedNodes[selectedNodes.length - 1]
                    )
                  )
                }
              >
                Run UCS algorithm
              </button>
              <br></br>
              <button
                className="algorithm-button bestfs"
                onClick={() =>
                  startAnimation(
                    getBestFirstSearch(
                      selectedNodes[0],
                      selectedNodes[selectedNodes.length - 1]
                    )
                  )
                }
              >
                Run BestFS algorithm
              </button>
              <br></br>
              <button
                className="algorithm-button dijkstra"
                onClick={() =>
                  startAnimation(
                    getDijPath(selectedNodes[selectedNodes.length - 1])
                  )
                }
              >
                Run Dijkstra algorithm
              </button>
              <br></br>
              <button
                className="algorithm-button a-star"
                onClick={() =>
                  startAnimation(
                    getAStarPath(
                      selectedNodes[0],
                      selectedNodes[selectedNodes.length - 1]
                    )
                  )
                }
              >
                Run A* algorithm
              </button>
              <br></br>
              <button
                className="algorithm-button bellman-ford"
                onClick={() =>
                  startAnimation(
                    getBellmanFord(
                      selectedNodes[0],
                      selectedNodes[selectedNodes.length - 1]
                    )
                  )
                }
              >
                Run Bellman-Ford algorithm
              </button>
              <br></br>
            </>
          )}
          <label className="currently-selected-nodes">
            {`Selected nodes: ${
              selectedNodes.length === 1
                ? selectedNodes[0]
                : selectedNodes.join(' ')
            }`}
          </label>
          <br></br>
          <button
            className="algorithm-button"
            onClick={(e) => clearSelection(e)}
          >
            Clear Selection
          </button>
        </div>
        <svg
          className="edge-layer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {edges.map((edge) => (
            <GraphEdge key={edge.id} {...edge} />
          ))}
          {isAnimationOn && searchOrder?.heuristics ? heuristicsEdges() : null}
        </svg>
        {nodes.map((node) => (
          <GraphNode
            key={node.id}
            {...node}
            onClick={() => handleNodeClick(node.id)}
          />
        ))}
        <div className="right-sidebar">
          {isEditModeOn ? (
            <>
              <EdgeWeightRandomizer />
              <br></br>
            </>
          ) : null}
          <div
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <input
              className="adjacency-list-input"
              placeholder="Search by node..."
              onChange={handleInputChange}
            ></input>
            <br></br>
          </div>
          <div id="adj-list" className="adj-list">
            {!isAnimationOn ? (
              edges
                .filter((edge) => edge.id.includes(adjInput))
                .map((edge) => (
                  <AdjacencyListElement
                    key={edge.id + 'ale'}
                    edge={{ ...(edge as GraphEdgeProps) }}
                    editMode={isEditModeOn}
                  />
                ))
            ) : (
              <>
                <button
                  onClick={(e) => stopAnimation(e)}
                  className="animation-button stop"
                >
                  Stop Animation
                </button>
                <br></br>
                <button
                  onClick={pauseAnimation}
                  className="animation-button pause"
                  disabled={
                    isAnimationPaused ||
                    animationIndex > animationFrames[0].length - 1
                  }
                >
                  Pause
                </button>
                <br></br>
                <button
                  onClick={resumeAnimation}
                  className="animation-button resume"
                  disabled={
                    !isAnimationPaused ||
                    animationIndex > animationFrames[0].length - 1
                  }
                >
                  Resume
                </button>
                <br></br>
                <button
                  onClick={nextFrame}
                  className="animation-button next-frame"
                  disabled={
                    !isAnimationPaused ||
                    animationIndex > animationFrames[0].length - 1
                  }
                >
                  Next Frame
                </button>
                <br></br>
                <label className="code-block">
                  {pseudocodes.get(currentAlgorithm)}
                </label>
              </>
            )}
          </div>
          <InformationWindow
            key={'inf'}
            info={message[0]}
            inftype={message[1]}
          ></InformationWindow>
        </div>
        {isAnimationOn ? (
          <div className="bottom-bar">
            <div className="animation-bar">
              {/*{searchOrder?.nodes.map((node) => (
                                <>
                                <AnimationElement 
                                    key={"anima"+node}       
                                    node={node}                   
                                    weight={searchOrder.distances && animationIndex < searchOrder.distances.length - 1 ? String(searchOrder.distances[animationIndex].get(node)) : undefined}>
                                </AnimationElement>
                                </>
                            ))}*/}
              <br></br>
              <DistancesTable
                key={'dist-table'}
                distances={searchOrder?.distances}
                animationIndex={
                  animationIndex > 0 ? animationIndex - 1 : animationIndex
                }
                heuristics={searchOrder?.heuristics}
              />
            </div>
          </div>
        ) : null}
      </div>
      <Header title="GAV"></Header>
      {currentInfoTooltip ? (
        <InfoTooltip
          x={currentInfoTooltip.x}
          y={currentInfoTooltip.y}
          heading={currentInfoTooltip.header}
        ></InfoTooltip>
      ) : null}
    </>
  )
}

export default GraphCanvas
