import {ShipComponent} from "./ShipComponent";
import React from "react";
import {StateDispatcher} from "./StateDispatcher";
import {ShipState} from "./ShipState";
import {CoreState} from "./CoreState";
import {EngineState} from "../../../test/EngineState";

export class ShipAPI extends ShipComponent {

    private state: ShipState;

    private readonly setState: StateDispatcher<ShipState>;

    constructor(state?: ShipState, setState?: StateDispatcher<ShipState>) {
        super("main");
        this.state = state!;
        this.setState = setState!;
    }


    public useStateDispatcher(): StateDispatcher<ShipState> {
        return this.setState;
    }

    getShipAPI(): ShipAPI {
        return this;
    }

    public async getCurrentShipState() {
        return new Promise<ShipState>(resolve => {
            this.setState(cs => {
                resolve(cs);
                return cs;
            });
        });
    }

    public async getEngine(engineID: string): Promise<EngineState> {
        return (await this.getCurrentShipState()).engineCluster.find(e => e.id === engineID)!;
    }

    public getEngineFromState(engineID: string, state: ShipState | undefined): EngineState | undefined {
        return state?.engineCluster.find(e => e.id === engineID);
    }

    public async getCore(engineID: string, coreID: string): Promise<CoreState> {
        return (await this.getEngine(engineID)).cores.find(e => e.id === coreID)!;
    }

    public getCoreFromState(engineID: string, coreID: string, state: ShipState | undefined): CoreState | undefined {
        return this.getEngineFromState(engineID, state)!.cores.find(c => c.id === coreID);
    }
}

export const ShipAPIContext = React.createContext<ShipAPI>(new ShipAPI());

