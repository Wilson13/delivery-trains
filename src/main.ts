import fs from "fs";
import { Dijkstra } from "./Dijkstra";
import { IData, IEdgeDetails, IPackageDetails, ITrainDetails } from "./interface/interface";
import { Network } from "./Network";
import { Package } from "./Package";
import { Train } from "./Train";

function main() {
    const data = <IData>JSON.parse(fs.readFileSync("./src/data/data.json", "utf8"));

    // Set up data and graph
    const network = saveAllEdges(data.edgeDetails);
    const packages = [...saveAllPackages(data.packageDetails)];
    const trains = [...saveAllTrains(data.trainDetails)];

    // Get shortest path
    let shortestPaths = new Map<string, string[]>(); // Store shortest path for memoization
    let shortestPathsCost = new Map<string, number>(); // Store shortest path cost for memoization
    let time = 0;
    const dijkstra = new Dijkstra();

    printObject("data: ", data);
    network.printStations();
    // printObject("path: ", path);
    // printObject("packages: ", packages);
    // printObject("trains: ", trains);

    // Based on package's starting point and destination point, find out all possible paths.
    saveAllPackagesShortestPaths(packages, network, dijkstra, shortestPaths, shortestPathsCost);
    printMap("shortestPaths: ", shortestPaths);
    // Based on all possible paths, find a train that's at the start or near the start that has the capacity.
    time = moveTrainsToPackages(packages, trains, network, dijkstra, shortestPaths, shortestPathsCost, time);
    startDelivery(packages, trains, network, shortestPaths, time);
}

function printObject(label: string, data: any, space?: number) {
    console.log(label, JSON.stringify(data, null, space ?? 0));
}

function printMap(label: string, data: Map<string, any>) {
    console.log(label);
    for (const [key, value] of data) {
        console.log(key, value);
    }
}

function saveAllEdges(edgeData: IEdgeDetails): Network {
    let network: Network = new Network();

    for (const edge of edgeData.edges) {
        network.addConnectedStation(edge.name, edge.stationOne, edge.stationTwo, edge.time);
    }

    return network;
}

function saveAllPackages(packageData: IPackageDetails): Package[] {
    const packages = [];

    // package is reserved keyword
    for (const parcel of packageData.packages) {
        const { name, start, destination, weight } = parcel;
        packages.push(new Package(name, start, start, destination, weight));
    }

    return packages;
}

function saveAllTrains(trainData: ITrainDetails): Train[] {
    const trains = [];

    // package is reserved keyword
    for (const train of trainData.trains) {
        const { name, start, capacity } = train;
        trains.push(new Train(name, start, start, capacity));
    }

    return trains;
}

function saveAllPackagesShortestPaths(
    packages: Package[],
    network: Network,
    dijkstra: Dijkstra,
    shortestPaths: Map<string, string[]>,
    shortestPathsCost: Map<string, number>
) {
    for (const pkg of packages) {
        const source = pkg.getStart();
        const dest = pkg.getDestination();
        const { path, totalTime } = dijkstra.findShortestPath(network, source, dest, shortestPaths, shortestPathsCost);
        shortestPaths.set(source + dest, path);
        shortestPathsCost.set(source + dest, totalTime);
    }
}

function moveTrainsToPackages(
    packages: Package[],
    trains: Train[],
    network: Network,
    dijkstra: Dijkstra,
    shortestPaths: Map<string, string[]>,
    shortestPathsCost: Map<string, number>,
    time: number
): number {
    // Find trains that are at the start station of package, if none exist, find the closest one.

    for (const pck of packages) {
        // Find train that has enough capacity at source
        let train = trains.find((ele) => ele.getCurrent() === pck.getCurrent() && ele.getCapacity() >= pck.getWeight());

        if (train === undefined) {
            train = findTrainForPackage(pck, trains, network, dijkstra, shortestPaths, shortestPathsCost);
        }

        // Move train to package current location if not there
        let pathToPck = shortestPaths.get(train.getCurrent() + pck.getCurrent());
        for (let i = 1; i < pathToPck.length; i++) {
            console.log(
                "W =",
                time,
                "T =",
                train.getName(),
                "N1 =",
                pathToPck[i - 1],
                "P1 =",
                "[]",
                "N2 =",
                pathToPck[i],
                "P2 =",
                "[]"
            );
            train.setCurrent(pathToPck[i]);
            const edgeKey = [pathToPck[i - 1], train.getCurrent()].sort().join("");
            time += network.edges.get(edgeKey);
        }
    }
    return time;
}

function startDelivery(
    packages: Package[],
    trains: Train[],
    network: Network,
    shortestPaths: Map<string, string[]>,
    time
) {
    for (const pck of packages) {
        // Find train that has enough capacity at source
        let train = trains.find((ele) => ele.getCurrent() === pck.getCurrent() && ele.getCapacity() >= pck.getWeight());

        if (train) {
            // Move train to package current location if not there
            let pathToPck = shortestPaths.get(pck.getCurrent() + pck.getDestination());
            for (let i = 1; i < pathToPck.length; i++) {
                let pickup = "";
                let dropoff = "";
                if (i === 1) {
                    pickup = pck.getName();
                } else if (i === pathToPck.length - 1) {
                    dropoff = pck.getName();
                }
                console.log(
                    "W =",
                    time,
                    "T =",
                    train.getName(),
                    "N1 =",
                    pathToPck[i - 1],
                    "P1 =",
                    `[${pickup}]`,
                    "N2 =",
                    pathToPck[i],
                    "P2 =",
                    `[${dropoff}]`
                );
                train.setCurrent(pathToPck[i]);
                const edgeKey = [pathToPck[i - 1], train.getCurrent()].sort().join("");
                time += network.edges.get(edgeKey);
            }
        }
    }
    return time;
}

function findTrainForPackage(
    pck: Package,
    trains: Train[],
    network: Network,
    dijkstra: Dijkstra,
    shortestPaths: Map<string, string[]>,
    shortestPathsCost: Map<string, number>
): Train {
    // Filter trains with enough capacity
    let validTrains = trains.filter((ele) => ele.getCapacity() >= pck.getWeight());

    // Get all shortest paths for valid trains' current station to package's current station
    for (const train of validTrains) {
        const source = train.getCurrent();
        const dest = pck.getCurrent();
        const { path, totalTime } = dijkstra.findShortestPath(
            network,
            train.getCurrent(),
            pck.getCurrent(),
            shortestPaths,
            shortestPathsCost
        );

        shortestPaths.set(source + dest, path);
        shortestPathsCost.set(source + dest, totalTime);
    }

    // Get the closest train to package's current station
    let closestTrain: Train = undefined;
    let minimumCost = undefined;

    for (const train of validTrains) {
        const source = train.getCurrent();
        const dest = pck.getCurrent();
        const cost = shortestPathsCost.get(source + dest);
        if (closestTrain === undefined || cost < minimumCost) {
            closestTrain = train;
            minimumCost = cost;
        }
    }

    return closestTrain;
}

main();
