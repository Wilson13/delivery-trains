export class Package {
    constructor(
        private name: string,
        private start: string,
        private current: string,
        private destination: string,
        private weight: number
    ) {}

    getName(): string {
        return this.name;
    }

    getStart(): string {
        return this.start;
    }

    getCurrent(): string {
        return this.current;
    }

    getDestination(): string {
        return this.destination;
    }

    getWeight(): number {
        return this.weight;
    }
}
