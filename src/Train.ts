export class Train {
    constructor(private name: string, private start: string, private current: string, private capacity: number) {}

    getName(): string {
        return this.name;
    }

    getStart(): string {
        return this.start;
    }

    getCurrent(): string {
        return this.current;
    }

    getCapacity(): number {
        return this.capacity;
    }

    setCurrent(stationName: string): void {
        this.current = stationName;
    }
}
