import { Network } from "./Network";
import { AdjacentStation } from "./Station";

// Undirected Graph
export class Dijkstra {
    network: Network;
    unvisitedStations: Map<string, string>;
    prevStations: Map<string, string>;
    journeyTimes: Map<string, number>; // aka weight / distance

    private addNetwork(network: Network) {
        this.network = network;

        for (const key of network.stations.keys()) {
            // Save station names
            this.unvisitedStations.set(key, key);
        }
    }

    findShortestPath(
        network: Network,
        source: string,
        dest: string,
        shortestPaths: Map<string, string[]>,
        shortestPathsCost: Map<string, number>
    ): { path: string[]; totalTime: number } {
        if (shortestPaths.has(source + dest)) {
            return { path: shortestPaths.get(source + dest), totalTime: shortestPathsCost.get(source + dest) };
        }

        this.unvisitedStations = new Map<string, string>();
        this.prevStations = new Map<string, string>();
        this.journeyTimes = new Map<string, number>(); // Reset / Initialize
        this.journeyTimes.set(source, 0);
        let path = [];

        this.addNetwork(network);

        // Stop processing when we have visited destination station
        while (this.unvisitedStations.has(dest)) {
            const { selectedStationName, selectedStationTime } = this.getShortestDistNodeFromSource(
                this.unvisitedStations,
                this.journeyTimes
            );
            // Mark selectedStationName as visited
            this.unvisitedStations.delete(selectedStationName);

            // Visit each connected station of selected station still not visited
            let selectedStation: AdjacentStation[] = this.network.stations.get(selectedStationName);

            if (selectedStation && selectedStation.length > 0) {
                // Iterate every neightbour
                for (const adjStation of selectedStation) {
                    // Check if visited
                    if (!this.unvisitedStations.has(adjStation.stationName)) {
                        continue;
                    }

                    let alt = selectedStationTime + adjStation.time;
                    let neighbourDistFromSource = this.journeyTimes.get(adjStation.stationName);

                    // Check if distance from source -> selected node -> neighbour is faster than source -> neighbour
                    if (alt < neighbourDistFromSource || neighbourDistFromSource === undefined) {
                        this.journeyTimes.set(adjStation.stationName, alt);
                        this.prevStations.set(adjStation.stationName, selectedStationName);
                    }
                }
            }
        }
        // Calculate path by back trekking from destination node
        path = [...this.getPath(this.prevStations, dest)];
        return { path: path, totalTime: this.journeyTimes.get(dest) };
    }

    /**
     * Find closest unvisited station to source.
     * @param unvisitedStations
     * @param distance
     * @returns
     */
    getShortestDistNodeFromSource(
        unvisitedStations: Map<string, string>,
        distance: Map<string, number>
    ): { selectedStationName; selectedStationTime } {
        let node = "";
        let min = undefined;

        for (const [key, value] of distance.entries()) {
            if (!unvisitedStations.has(key)) {
                continue;
            }
            if (min === undefined || value < min) {
                node = key;
                min = value;
            }
        }

        return { selectedStationName: node, selectedStationTime: min };
    }

    getPath(prevStations: Map<string, string>, dest: string): string[] {
        let path: string[] = [];
        let current = dest;

        while (current) {
            path.unshift(current); // Push from left so we have source -> dest order
            current = prevStations.get(current);
        }

        return path;
    }
}
