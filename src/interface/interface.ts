export interface IData {
    stationDetails: IStationDetails;
    edgeDetails: IEdgeDetails;
    packageDetails: IPackageDetails;
    trainDetails: ITrainDetails;
}

export interface IStationDetails {
    count: number;
    stations: string[];
}

export interface IEdgeDetails {
    count: number;
    edges: IEdge[];
}

export interface IPackageDetails {
    count: number;
    packages: IPackage[];
}

export interface ITrainDetails {
    count: number;
    trains: ITrain[];
}

export interface IEdge {
    name: string;
    stationOne: string;
    stationTwo: string;
    time: number;
}
export interface IPackage {
    name: string;
    start: string;
    destination: string;
    weight: number;
}

export interface ITrain {
    name: string;
    start: string;
    capacity: number;
}

export interface IStation {
    stationName: string;
}

export interface IAdjacentStation {
    edgeName: string;
    time: number;
}
