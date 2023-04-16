import React from "react";
import {ShipComponent} from "./ShipComponent";
import {CoreState} from "./CoreState";
import {CycleContext} from "./CycleContext";
import {ShipState} from "./ShipState";
import {getVFO} from "./ManualOverridableValue";

type TemperatureAction = {
    threshold: number,

    activationDirection?: "upwards" | "downwards"

    popFuse?: boolean,
    engineLoadDelta?: number,
    engineLoad?: number,

    coolingUnitLoad?: number
}

const temperatureActions: Array<TemperatureAction> = [
    {
        activationDirection: "downwards",
        threshold: 20,
        coolingUnitLoad: 0
    },
    {
        threshold: 80,
        coolingUnitLoad: 50
    },
    {
        threshold: 90,
        coolingUnitLoad: 70
    },
    {
        threshold: 100,
        coolingUnitLoad: 100
    },
    {
        threshold: 120,
        popFuse: true,
        coolingUnitLoad: 100
    }
]

export class EngineCoreAPI extends ShipComponent {

    private static readonly naturalHeatDissipation = -.5

    private readonly engineID: string;

    private readonly coreID: string;

    private iCs: CoreState | undefined;

    private nCs: CoreState | undefined;

    constructor(engineID: string, coreID: string) {
        super(coreID);
        this.engineID = engineID;
        this.coreID = coreID;
    }

    public calculateDeltaHeat(current: CoreState): number {
        let dH = 0;
        // Linear production heat
        if (!current.fusePopped) dH += getVFO(current.selectedLoad, 0)! * .01;
        // Natural heat dissipation
        dH += EngineCoreAPI.naturalHeatDissipation;
        // Cooling unit
        dH -= current.coolingUnitLoad * .025
        return dH;
    }

    async prepareUpdate(cycle: CycleContext) {
        await super.prepareUpdate(cycle);
        // const cycle = this.useCycle();

        if (cycle === undefined) {
            throw new Error("Trying to prepare update, but cycle is undegi");
        }

        this.iCs = await this.getShipAPI().getCoreFromState(
            this.engineID, this.coreID, cycle.initialState
        );
        if (this.iCs === undefined) {
            throw new Error(`[${this.engineID}, ${this.coreID}] Cycle's initial core state is undefined`);
        }

        this.nCs = await this.getShipAPI().getCoreFromState(
            this.engineID, this.coreID, cycle.state
        );
        if (this.nCs === undefined) {
            throw new Error(`[${this.engineID}, ${this.coreID}] Cycle's next core state is undefined`);
        }

        return cycle;
    }

    private updateCore(cycle: CycleContext, updater: (core: CoreState) => void) {
        // Load the current core's state
        const s = cycle.initialState;
        const e = s.engineCluster.find(e => e.id === this.engineID)!;
        const c = e.cores.find(c => c.id = this.coreID);
        // Calculate the new engine core's state
        updater(c!);
        // Set the new value to the engine
        const ns = cycle.state;
        ns.engineCluster = [...s.engineCluster];
    }

    async dtt(cycle: CycleContext) {
        await super.dtt(cycle);
        this.updateCore(cycle, core => {
            core.heat = Math.max(0, this.nCs!.heat + this.calculateDeltaHeat(this.nCs!));
        });
        return cycle;
    }

    private applySmoothCooling(core: CoreState) {
        const lastHeat = this.iCs!.heat;

        const curHeat = core.heat;
        const idealHeat = 50, err = 2.5;
        const difVec = lastHeat - curHeat;
        const difToIdeal = Math.abs(idealHeat - curHeat);

        console.error("current", curHeat, "last", lastHeat, "ideal", idealHeat, "dir", difVec)

        // Try to keep heat within ideal range in sync
        if (difToIdeal > err) {
            console.error("changes are required")

            // Lies outside the perfect range
            if (curHeat > idealHeat && difVec <= 0) {

                console.error("--")

                // Heat too high
                core.coolingUnitLoad = Math.min(100, core.coolingUnitLoad + (difToIdeal ^ 2) * .9)
            } else if (curHeat < idealHeat && difVec >= 0) {


                console.error("++")

                // Heat too low
                core.coolingUnitLoad = Math.max(0, core.coolingUnitLoad - (difToIdeal ^ 2) * .9)
            }

            console.error("changes:", core.coolingUnitLoad)
        }
    }

    async ttd(cycle: CycleContext) {
        await super.ttd(cycle);

        this.updateCore(cycle, core => {
            this.applySmoothCooling(core);
            console.error("cooling", core.coolingUnitLoad)
        });
        return cycle;

        // console.debug("updating core", this.coreID, "initial heat", this.iCs!.heat, "heat at intermediate 2", this.nCs!.heat);
        // const lastHeat = this.iCs!.heat;
        // const curHeat = this.nCs!.heat;
        // const idealHeat = 50, err = 2.5;
        // const difVec = lastHeat - curHeat;
        // const difToIdeal = Math.abs(idealHeat - curHeat);
        // // Try to keep heat within ideal range in sync
        // if (difToIdeal > err) {
        //     // Lies outside the perfect range
        //     if (curHeat > idealHeat && difVec < 0) {
        //         // Heat too high
        //         this.nCs!.coolingUnitLoad = Math.min(100, this.nCs!.coolingUnitLoad += (difToIdeal ^ 2) * .9)
        //     } else if (curHeat < idealHeat && difVec > 0) {
        //         // Heat too low
        //         this.nCs!.coolingUnitLoad = Math.max(0, this.nCs!.coolingUnitLoad -= (difToIdeal ^ 2) * .9)
        //     }
        // } else {
        //     // Lies within the perfect range
        // }
        // // Quick actions if temperature gets out of control
        // for (let i = temperatureActions.length - 1; i >= 0; i--){
        //     const act = temperatureActions[i];
        //     const acDir = act.activationDirection ?? "upwards";
        //     if (this.iCs!.heat >= act.threshold && this.nCs!.heat < act.threshold) {
        //         // Threshold reached from above
        //         if (acDir === "upwards") break;
        //         if (!this.nCs!.fusePopped) {
        //             this.nCs!.fusePopped = act.popFuse === undefined ? this.iCs!.fusePopped : act.popFuse;
        //             this.nCs!.load = act.engineLoad !== undefined ? act.engineLoad : this.iCs!.load + (act.engineLoadDelta ?? 0)
        //             this.nCs!.coolingUnitLoad = act.coolingUnitLoad ?? this.nCs!.coolingUnitLoad;
        //         }
        //     }
        //     if (this.nCs!.heat >= act.threshold && this.iCs!.heat < act.threshold) {
        //         // Threshold reached from below
        //         if (acDir === "downwards") break;
        //         if (!this.nCs!.fusePopped) {
        //             this.nCs!.fusePopped = act.popFuse === undefined ? this.iCs!.fusePopped : act.popFuse;
        //             this.nCs!.load = act.engineLoad !== undefined ? act.engineLoad : this.iCs!.load + (act.engineLoadDelta ?? 0)
        //             this.nCs!.coolingUnitLoad = act.coolingUnitLoad ?? this.nCs!.coolingUnitLoad;
        //         }
        //     }
        // }
        // console.debug("updating core ends", this.coreID, "heat at beginning", this.nCs!.heat)
        // return cycle;
    }
}

export const EngineCoreAPIContext = React.createContext<EngineCoreAPI>(new EngineCoreAPI("N/A", "N/A"));

