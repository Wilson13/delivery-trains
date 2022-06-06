import { AdjacentStation } from "./Station";

export class Edge {
    constructor(
        private name: string,
        private nodeA: AdjacentStation,
        private nodeB: AdjacentStation,
        private time: number
    ) {}

    getName(): string {
        return this.name;
    }

    getStations(): AdjacentStation[] {
        return [this.nodeA, this.nodeB];
    }

    getJourneyTime(): number {
        return this.time;
    }
}
