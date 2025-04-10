const infoTooltipsContents: Map<string, [string,string]> = new Map()

infoTooltipsContents.set("canvas",["Canvas", "The main working area of the visualiser. You can create nodes by clicking anywhere on it, while in the Edit Mode"])

infoTooltipsContents.set("graph-node", ["Node, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges."])

infoTooltipsContents.set("graph-node selected", ["Node, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges. This node is currently selected."])

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

infoTooltipsContents.set("graph-node not-observed", ["Non-observed Node, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges. It has not been observed yet."])

infoTooltipsContents.set("graph-node current", ["Current Node, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges. This node is currently being explored by the algorithm and it's neighbours are being taken into account."])

infoTooltipsContents.set("graph-node on-frontier", ["Node on the Frontier, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges. It has been discovered as a neighbour of some node, but not explored yet."])

infoTooltipsContents.set("graph-node observed", ["Explored Node, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges. This node has already been explored and will not be chosen as a current node agains"])

infoTooltipsContents.set("graph-node selected not-observed", ["Non-observed Node, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges. It has not been observed yet."])

infoTooltipsContents.set("graph-node selected current", ["Current Node, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges. This node is currently being explored by the algorithm and it's neighbours are being taken into account."])

infoTooltipsContents.set("graph-node selected on-frontier", ["Node on the Frontier, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges. It has been discovered as a neighbour of some node, but not explored yet."])

infoTooltipsContents.set("graph-node selected observed", ["Explored Node, aka: Vertex, Point, Junction","One of the points on which the graph is defined and which may be connected by graph edges. This node has already been explored and will not be chosen as a current node agains"])

infoTooltipsContents.set("code-block",["Pseudocode","The pseudocode that explains how the algorithm that is currently running works. Take a close look at it and try to create some parallels between it and what happens on the screen during the animation."])

infoTooltipsContents.set("icon view-mode",["Back to View Mode","Go to view mode, where you can use different algorithms on the graph that you have created."])

infoTooltipsContents.set("icon edit-mode",["Go to Edit Mode","Go to edit mode, where you can create or alter the graph that you have already created."])

infoTooltipsContents.set("icon toggle-edges",["Toggle Edge Creation","Use this button to switch the behaviour of your node-clicks. This option will allow to connect the nodes with edges."])

infoTooltipsContents.set("icon delete-nodes",["Toggle Node Deletion","Use this button to switch the behaviour of your node-clicks. This option will allow to delete the nodes by clicking on them."])

infoTooltipsContents.set("icon clear",["Clear All","Deletes the current graph entirely. Be careful."])

infoTooltipsContents.set("icon clear-edges",["Clear Edges","Deletes all the edges betwen the nodes so that you can sart from scratch."])

infoTooltipsContents.set("icon directed",["Directed","Switch the graph to directed. Edges will now lead from the *first* node that you have chosen to the *second* one. The algorithms will be able to traverse it only in the direction specified."])

infoTooltipsContents.set("icon undirected",["Undirected","Switch the graph to undirected. All edges will be bidirectional, and the algorithms will be able tot raverse them in both directions."])

infoTooltipsContents.set("info-tooltip", ["Info Tooltip","This is an info tooltip. Usually you will see some information here about the object that you clicked on."])

infoTooltipsContents.set("adj-list", ["Right Sidebar", "This is the area where you can see the list of edges currently on the canvas, the pseudocode for the running algorithm, animation controls (in View mode), edge editing options and edge weight randomizer (in Edit mode)"])

infoTooltipsContents.set("left-sidebar", ["Left Sidebar", "This is the area where you can see the list of algorithms which you can run on the graph (in View mode) and various editing tools (in Edit mode)"])

export default infoTooltipsContents