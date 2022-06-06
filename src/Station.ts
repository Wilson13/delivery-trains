import { IAdjacentStation, IStation } from "./interface/interface";

export class AdjacentStation implements IStation, IAdjacentStation {
    edgeName: string;
    stationName: string;
    time: number;

    constructor(edgeName: string, station: string, time: number) {
        this.edgeName = edgeName;
        this.stationName = station;
        this.time = time;
    }
}
