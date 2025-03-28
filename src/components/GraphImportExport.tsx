import React from 'react'
import useGraphStore from '../store/useGraphStore' // Importing Zustand store
import { GraphEdgeProps, GraphNodeProps, SearchOrder } from '@/app/types'

type GraphData = {
  nodes: GraphNodeProps[]
  edges: GraphEdgeProps[]
}

const GraphImportExport: React.FC = () => {
  const {
    nodes,
    edges,
    addNode,
    addEdge,
    isGraphDirected,
    setIsGraphDirected,
    clearNodes,
    clearEdges,
  } = useGraphStore()

  // Export Graph to JSON File
  const exportGraph = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const jsonData = JSON.stringify({ nodes, edges }, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    e.stopPropagation()
    a.href = url
    a.download = 'graph.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Import Graph from JSON File
  const importGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        clearEdges()
        clearNodes()
        const parsedGraph: GraphData = JSON.parse(e.target?.result as string)
        parsedGraph.nodes.forEach((node) => {
          addNode(node.id, node.value, node.x, node.y, node.onClick)
        })
        parsedGraph.edges.forEach((edge) => {
          addEdge(
            edge.id,
            edge.sourceID,
            edge.targetID,
            edge.weight,
            isGraphDirected,
            false
          )
        })
      } catch (error) {
        console.error('Invalid JSON file', error)
        alert('Error: Invalid JSON format')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <h2>Graph Import/Export</h2>
      <button onClick={(e) => exportGraph(e)}>Export Graph</button>
      <input
        type="file"
        accept=".json"
        onChange={importGraph}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default GraphImportExport
