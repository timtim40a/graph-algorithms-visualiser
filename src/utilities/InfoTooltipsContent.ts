const infoTooltipsContents: Map<string, [string,string]> = new Map()

infoTooltipsContents.set("canvas",["Canvas", "The main working area of the visualiser. You can create nodes by clicking anywhere on it, while in the Edit Mode"])

infoTooltipsContents.set("graph-node", ["Node, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges."])

infoTooltipsContents.set("adj-element-label", ["Edge","This labels represent the edges of your graph: their names correspond to the nodes they are connecting. You can change their weight, direction, or delete them using buttons to the right."])

infoTooltipsContents.set("adj-element-input", ["Weight input","Please use this field to specify the weight for the corresponding edge, then press ENTER, or the burron to the right."])

infoTooltipsContents.set("adj-element-button weight", ["Change weight","Press here to apply specified weight."])

infoTooltipsContents.set("adj-element-button direction", ["Change direction","Press here to change the direction of the edge."])

infoTooltipsContents.set("adj-element-button delete", ["Delete edge","Use this button to delete current edge."])

infoTooltipsContents.set("icon delete-edge", ["Delete edge","Use this button to delete current edge."])

infoTooltipsContents.set("animation-button stop", ["Stop Animation","Use this button to stop the animation after or during the execution of any algorithm."])

infoTooltipsContents.set("animation-button pause", ["Pause Animation","Use this button to pause the animation. This gives a possibility to look at the graph frame-by-frame."])

infoTooltipsContents.set("animation-button resume", ["Resume Animation","Use this button to resume the animation after it has been paused."])

infoTooltipsContents.set("animation-button next-frame", ["Next Frame","Use this button to See the next frame of the animation"])

infoTooltipsContents.set("info-window log", ["Log window","Here you will see any warnings, errors or logs on what has happened and what algorithms have returned"])

infoTooltipsContents.set("info-window warn", ["Log window","Here you will see any warnings, errors or logs on what has happened and what algorithms have returned"])

infoTooltipsContents.set("info-window error", ["Log window","Here you will see any warnings, errors or logs on what has happened and what algorithms have returned"])

infoTooltipsContents.set("algorithm-button bfs", ["Run Breadth First Search Algorithm"," Input: one node selected.\n\nBFS is one of the most popular and simplest algorithms out there. It starts at a given node and explores all its neighboring nodes at the present depth before moving on to nodes at the next depth level, using a queue to keep track of the nodes to be explored. It guarantees to find the shortest path in an unweighted graph."])

infoTooltipsContents.set("algorithm-button dfs", ["Run Depth First Search Algorithm"," Input: one node selected.\n\nDFS starts at the chosen node and explores as far as possible until there is a node that doesn't have more neighbours. It traverses the graph along each branch before backtracking. It does not guarantee to find the shortest path but it guarantees to find *a* path if it exists."])

infoTooltipsContents.set("algorithm-button ucs", ["Run Uniform Cost Search Algorithm"," Input: source and target nodes selected.\n\n It expands the node with the lowest cumulative cost first on each iteration. It guarantees to find the least cost path from a starting node to a goal node in a non-negative weighted graph."])

infoTooltipsContents.set("algorithm-button bestfs", ["Run Best First Search Algorithm"," Input: source and target nodes selected.\n\nBestFS is the simplest heuristical algorithm. It is a search algorithm which explores a graph by expanding the most promising node chosen according to a specified rule (in this visualiser -- this rule is the distance to the target node in pixels). It is usually faster then BFS or DFS on some graphs, but it very much depends on graphs structure."])

infoTooltipsContents.set("algorithm-button dijkstra", ["Run Dijkstra's Algorithm"," Input: one node selected.\n\nDijkstra's algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It expands nodes in increasing order of their distance from the source, ensuring the shortest path is found for each of them. It guarantees to find the shortest path, in non-negative weighted graphs."])

infoTooltipsContents.set("algorithm-button a-star", ["Run A* Algorithm"," Input: source and target nodes selected.\n\nA* is an extension of Dijkstra's algorithm that uses both the current path cost and a heuristic estimate to the target node. It combines the strengths of Dijkstra's algorithm (finding the shortest path) and Best-First Search (using a heuristic to guide the search), making it faster and more efficient in most cases. Also uses distances between nodes in pixels as heuristics"])

infoTooltipsContents.set("algorithm-button bellman-ford", ["Run Bellman-Ford Algorithm"," Input: source node selected.\n\nBellman-Ford algorithm finds the shortest path from a source node to all other nodes in a weighted graph, even if the graph contains negative edge weights. It repeatedly relaxes all edges, updating the shortest known distance. It is slower than Dijkstra's algorithm, but it can work on negative weights and detect negative weight cycles."])



export default infoTooltipsContents