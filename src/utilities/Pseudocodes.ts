const pseudocodes : Map<string, string> = new Map();

pseudocodes.set("breadth-first-search",
    "BFS(graph, startNode):\n\tCreate a queue and enqueue startNode\n\tMark startNode as visited\n\n\twhile queue is not empty:\n\t\tcurrentNode = dequeue from queue\n\t\tProcess currentNode\n\n\t\tfor each neighbor in graph[currentNode]:\n\t\t\tif neighbor is not visited:\n\t\t\t\tMark neighbor as visited\n\t\t\t\tEnqueue neighbor into the queue"

)
pseudocodes.set("depth-first-search",
    "DFS(graph, currentNode, visitedSet):\n\tProcess currentNode\n\tMark currentNode as visited\n\n\tfor each neighbor in graph[currentNode]:\n\t\tif neighbor is not visited:\n\t\t\tDFS(graph, neighbor, visitedSet)"

)
pseudocodes.set("universal-cost-search",
    "UniformCostSearch(graph, startNode, goalNode):\n\tCreate a priority queue and enqueue (startNode, 0)\n\tInitialize cost[startNode] = 0, all others = ∞\n\tInitialize previousNode map\n\n\twhile priority queue is not empty:\n\t\tcurrentNode, currentCost = dequeue node with the lowest cost\n\n\t\tif currentNode == goalNode:\n\t\t\treturn reconstructPath(previousNode, goalNode)\n\n\t\tfor each neighbor in graph[currentNode]:\n\t\t\tnewCost = currentCost + edgeWeight(currentNode, neighbor)\n\n\t\t\tif newCost < cost[neighbor]:\n\t\t\t\tcost[neighbor] = newCost\n\t\t\t\tpreviousNode[neighbor] = currentNode\n\t\t\t\tEnqueue (neighbor, newCost) into the priority queue"

)
pseudocodes.set("best-first-search",
    "BestFirstSearch(graph, startNode, goalNode, heuristic):\n\tCreate a priority queue and enqueue (startNode, heuristic(startNode))\n\tMark startNode as visited\n\n\twhile priority queue is not empty:\n\t\tcurrentNode = dequeue with the lowest heuristic value\n\t\tProcess currentNode\n\n\t\tif currentNode == goalNode:\n\t\t\treturn SUCCESS\n\n\t\tfor each neighbor in graph[currentNode]:\n\t\t\tif neighbor is not visited:\n\t\t\t\tMark neighbor as visited\n\t\t\t\tEnqueue (neighbor, heuristic(neighbor)) into the priority queue"

)
pseudocodes.set("dijkstra",
    "Dijkstra(graph, startNode):\n\tCreate a priority queue and enqueue (startNode, 0)\n\tInitialize distance[startNode] = 0, all others = ∞\n\tInitialize previousNode map\n\n\twhile priority queue is not empty:\n\t\tcurrentNode, currentDistance = dequeue smallest distance\n\n\t\tfor each neighbor in graph[currentNode]:\n\t\t\tnewDistance = currentDistance + edgeWeight(currentNode, neighbor)\n\n\t\t\tif newDistance < distance[neighbor]:\n\t\t\t\tdistance[neighbor] = newDistance\n\t\t\t\tpreviousNode[neighbor] = currentNode\n\t\t\t\tEnqueue (neighbor, newDistance) into the priority queue"

)
pseudocodes.set("a-star",
    "AStar(graph, startNode, goalNode, heuristic):\n\tCreate a priority queue and enqueue (startNode, 0)\n\tInitialize gScore[startNode] = 0, all others = ∞\n\tInitialize fScore[startNode] = heuristic(startNode)\n\tInitialize previousNode map\n\n\twhile priority queue is not empty:\n\t\tcurrentNode = dequeue node with lowest fScore\n\n\t\tif currentNode == goalNode:\n\t\t\treturn reconstructPath(previousNode, goalNode)\n\n\t\tfor each neighbor in graph[currentNode]:\n\t\t\ttentativeGScore = gScore[currentNode] + edgeWeight(currentNode, neighbor)\n\n\t\t\tif tentativeGScore < gScore[neighbor]:\n\t\t\t\tgScore[neighbor] = tentativeGScore\n\t\t\t\tfScore[neighbor] = gScore[neighbor] + heuristic(neighbor)\n\t\t\t\tpreviousNode[neighbor] = currentNode\n\t\t\t\tEnqueue (neighbor, fScore[neighbor]) into the priority queue"

)
pseudocodes.set("bellman-ford",
    "BellmanFord(graph, startNode):\n\tInitialize distance[startNode] = 0, all others = ∞\n\tInitialize previousNode map\n\n\tfor i from 1 to number_of_nodes - 1:\n\t\tfor each edge (u, v, weight) in graph:\n\t\t\tif distance[u] + weight < distance[v]:\n\t\t\t\tdistance[v] = distance[u] + weight\n\t\t\t\tpreviousNode[v] = u\n\n\tfor each edge (u, v, weight) in graph:\n\t\tif distance[u] + weight < distance[v]:\n\t\t\treturn \"Negative cycle detected\""

)

export default pseudocodes