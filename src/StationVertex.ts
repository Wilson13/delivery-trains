import { IStation } from "./interface/interface";

export class VertexStation implements IStation {
    edgeName: string;
    stationName: string;
    timeFromSource: number;
    previousNode: string;
    visited: boolean;

    constructor(stationName: string, edgeName: string) {
        this.edgeName = edgeName;
        this.stationName = stationName;
        this.visited = false;
    }
}
