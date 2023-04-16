import {ShipState} from "./ShipState";

export type CycleContext = {
    readonly initialState: ShipState,
    state: ShipState,
}
