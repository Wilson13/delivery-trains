# Trains

## Solution

This is an undirected weighted graph problem.

My basic idea is to use Dijkstra's algorithm to find the shortest paths.

1. Find shortest path for each package's start to destination.
2. Find a train with enough capacity at the start/current station for each package.

    1. If there isn't one, find the closest train with enough capacity.
    2. Move trains to the start stations.

3. For each train now at the start stations, pick up parcel and follow shortest path towards destination and drop parcel off the last station.

### Note

This is not an optimal solution.

## References

-   [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

-   [An Introduction to Dijkstra’s Algorithm: Theory and Python Implementation](https://python.plainenglish.io/dijkstras-algorithm-theory-and-python-implementation-c1135402c321)

-   [Dijkstra's Shortest Path Algorithm - A Detailed and Visual Introduction](https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/)

-   [Data Structures in JavaScript: Graphs](https://betterprogramming.pub/basic-interview-data-structures-in-javascript-graphs-3f9118aeb078)

-   [Graph Data Structures in JavaScript for Beginners](https://adrianmejia.com/data-structures-for-beginners-graphs-time-complexity-tutorial/#:~:text=A%20graph%20is%20a%20data,edges%20connected%20to%20a%20vertex.)

### Output Screenshot

![Output](/assets/output.png?raw=true "Optional Title")
