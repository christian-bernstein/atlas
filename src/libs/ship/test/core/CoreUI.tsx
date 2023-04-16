import React, {useContext, useState} from "react";
import {ShipState} from "./ShipState";
import {ShipAPIContext} from "./ShipAPI";
import {DescriptiveTypography} from "../../../triton/components/typography/DescriptiveTypography";
import {Speedometer} from "../../../test/Speedometer";
import {ms, s} from "../../../base/logic/misc/TimeMeasured";
import {SimulationStateContext} from "./Simulation";
import {EngineAPI} from "./EngineAPI";
import {getVFO} from "./ManualOverridableValue";

export type CoreUIProps = {
    engineID: string,
    coreID: string
}

export const CoreUI: React.FC<CoreUIProps> = props => {
    const api = useContext(ShipAPIContext);
    const state = useContext(SimulationStateContext);
    const core = api.getCoreFromState(props.engineID, props.coreID, state);
    const coreComponent = api.component<EngineAPI>(props.engineID)?.component(props.coreID);

    console.debug(`Rendering core UI for core '${props.engineID}@${props.coreID}'`, core, `Test value:`, core?.selectedLoad)

    return (
        <div style={{ backgroundColor: "black", padding: "8px", borderRadius: "8px", display: "flex", gap: "8px", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <DescriptiveTypography text={"Load"}/>
                <Speedometer
                    transitionDelay={ms(0)}
                    val={getVFO(core?.selectedLoad)}
                    transition={s(1)}
                    ease={false}
                />
                <DescriptiveTypography text={"Heat"}/>
                <Speedometer
                    transitionDelay={ms(0)}
                    val={core?.heat}
                    transition={s(1)}
                    ease={false}
                />
                <DescriptiveTypography text={"Cooling unit load"}/>
                <Speedometer
                    transitionDelay={ms(0)}
                    val={core?.coolingUnitLoad}
                    transition={s(1)}
                    ease={false}
                />
            </div>
        </div>
    );
}
