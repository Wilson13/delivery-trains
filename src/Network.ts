import { AdjacentStation } from "./Station";

// Undirected Graph
export class Network {
    // Connected stations (adjacency list)
    stations = new Map<string, AdjacentStation[]>();
    // Edges
    edges = new Map<string, number>();

    // addEdge equivalent
    addConnectedStation(edgeName: string, stationOne: string, stationTwo: string, time: number): void {
        const stationOneArr = this.stations.get(stationOne);
        const stationTwoArr = this.stations.get(stationTwo);

        const edgeKey = [stationOne, stationTwo].sort().join("");
        this.edges.set(edgeKey, time);

        // addAdjacent equivalent
        if (stationOneArr === undefined) {
            this.stations.set(stationOne, [new AdjacentStation(edgeName, stationTwo, time)]);
        } else {
            this.stations.set(stationOne, [...stationOneArr, new AdjacentStation(edgeName, stationTwo, time)]);
        }

        if (stationTwoArr === undefined) {
            this.stations.set(stationTwo, [new AdjacentStation(edgeName, stationOne, time)]);
        } else {
            this.stations.set(stationTwo, [...stationTwoArr, new AdjacentStation(edgeName, stationOne, time)]);
        }
    }

    printStations(): void {
        console.log("Network: ");
        for (const [key, value] of this.stations.entries()) {
            console.log(key, ": ", JSON.stringify(value));
        }
    }
}
