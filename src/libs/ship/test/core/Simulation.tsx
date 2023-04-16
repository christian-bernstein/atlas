import React, {createContext, useEffect, useRef, useState} from "react";
import {cloneDeep} from "lodash";
import {EngineCoreAPI} from "./EngineCoreApi";
import {CycleContext} from "./CycleContext";
import {ShipState} from "./ShipState";
import {ShipAPI, ShipAPIContext} from "./ShipAPI";
import {arrayFactory} from "../../../base/Utils";
import {EngagementState} from "../../../test/EngagementState";
import {EngineAPI} from "./EngineAPI";
import {EngineUI} from "./EngineUI";
import {EngineState} from "../../../test/EngineState";
import {CoreState} from "./CoreState";

export type SimulationProps = {
    fps: number,
    printCycleTime: boolean,
    runForXFrames?: number
}

export function generateSimulationInitialState(): ShipState {
    return {
        engineAvailableEProd: 0,
        engineCluster: arrayFactory<EngineState>(i => ({
            id: String(i),
            actualEProd: 0,
            selectedEProd: 0,
            // authority: MANUAL_AUTHORITY,
            authority: "manual_authority",
            engagementState: EngagementState.ENGAGED,


            cores: arrayFactory<CoreState>(cI => ({
                id: String(cI),
                heat: 75,

                fusePopped: false,
                coolingUnitLoad: 0,
                actualLoad: 0,
                selectedLoad: {
                    overwrite: false,
                    autoValue: 0,
                    overwriteValue: 0
                }
            }), 2),
        }), 1)
    }
}

export const Simulation: React.FC<SimulationProps> = props => {
    // Create initial ship state
    const [shipState, setShipState] = useState<ShipState>(generateSimulationInitialState());
    // Create main api
    const shipAPI = useRef(new ShipAPI(shipState, setShipState));

    const tick = async () => {
        // Accumulate state changes into 'cycle.state'
        const shipStateAtCycleBegin = await shipAPI.current.getCurrentShipState();
        let cycle: CycleContext = {
            initialState: shipStateAtCycleBegin,
            state: cloneDeep(shipStateAtCycleBegin)
        };
        const api = shipAPI.current;
        cycle = await api.prepareUpdate(cycle);
        cycle = await api.dtt(cycle);
        cycle = await api.ttd(cycle);
        // Dispatch the cycle's updated ship state. TODO: Check if cloneDeep is required & what the performance impact is
        setShipState(cloneDeep(cycle.state));
    }

    useEffect(() => {
        console.debug("Building simulation component tree..");
        console.debug("Initial simulation state", shipState);

        // Register sub-components
        shipState.engineCluster.forEach(engine => {
            console.debug(`Create engine api for '${engine.id}'`, engine);
            // Register all engines
            const engineAPI = new EngineAPI(engine.id);
            engineAPI.updateDisplayName(`engine-${engine.id}`)
            shipAPI.current.registerSubComponent(engineAPI);

            // Register all engine's cores
            engine.cores.forEach(core => {
                console.debug(`Create engine core api for '${core.id}'`, core);
                engineAPI.registerSubComponent(
                    new EngineCoreAPI(engine.id, core.id)
                        .updateDisplayName(`core-${engine.id},${core.id}`)
                );
            })
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loop = useRef<{
        clock?: NodeJS.Timer,
        tickCount: number
    }>({
        tickCount: 0
    });

    const stopLoop = () => {
        console.debug("Stopping clock loop..")
        clearInterval(loop.current.clock);
    }

    useEffect(() => {
        // Clear potentially preexisting loop object
        if (loop.current.clock !== undefined) stopLoop();

        // Start the simulations "game"-loop
        loop.current.clock = setInterval(async () => {
            const cycleStart = Date.now();
            await tick();
            loop.current.tickCount++;
            const cycleEnd = Date.now();
            if (props.printCycleTime) console.log(`Tick ${loop.current.tickCount} took ${cycleEnd - cycleStart} ms`);
            if (props.runForXFrames !== undefined && loop.current.tickCount >= props.runForXFrames - 1) stopLoop();
        }, 1e3 / props.fps);
    }, [props.fps, props.printCycleTime, props.runForXFrames]);

    return (
        <ShipAPIContext.Provider value={shipAPI.current}>
            <SimulationStateContext.Provider value={shipState}>
                { shipState.engineCluster.map(engine => (
                    <EngineUI key={engine.id} engineID={engine.id}/>
                )) }
            </SimulationStateContext.Provider>
        </ShipAPIContext.Provider>
    );
}

export const SimulationStateContext = createContext<ShipState>(generateSimulationInitialState())
