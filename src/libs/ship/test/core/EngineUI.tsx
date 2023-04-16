import React, {useContext} from "react";
import {ShipAPIContext} from "./ShipAPI";
import {DescriptiveTypography} from "../../../triton/components/typography/DescriptiveTypography";
import {SimulationStateContext} from "./Simulation";
import {ButtonBase} from "../../../triton/components/buttons/ButtonBase";
import {EngineAPI} from "./EngineAPI";
import {CoreUI} from "./CoreUI";
import {Speedometer} from "../../../test/Speedometer";
import {ms, s} from "../../../base/logic/misc/TimeMeasured";

export type EngineUIProps = {
    engineID: string
}

export const EngineUI: React.FC<EngineUIProps> = props => {
    const api = useContext(ShipAPIContext);
    const state = useContext(SimulationStateContext);
    const engine = api.getEngineFromState(props.engineID, state);
    const engineComponent = api.component<EngineAPI>(props.engineID);

    return (
        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
            <div style={{ backgroundColor: "black", padding: "8px", borderRadius: "8px", display: "flex", gap: "8px", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <ButtonBase text={"eProd 0"} baseProps={{
                        onClick: () => {
                            engineComponent.selectEProd(0);
                        }
                    }}/>
                    <ButtonBase text={"eProd 100"} baseProps={{
                        onClick: () => {
                            engineComponent.selectEProd(100);
                        }
                    }}/>

                    <Speedometer
                        transitionDelay={ms(0)}
                        transition={s(1)}
                        ease={false}
                        val={engine?.selectedEProd ?? -1}
                    />

                    <DescriptiveTypography
                        text={`Engine UI: ${props.engineID}, State defined: '${state !== undefined}', Cores: '${engine!.cores.length}', Sel eProd: '${engine!.selectedEProd}', Act eProd: '${engine!.actualEProd}'`}
                    />
                </div>
            </div>
            <div style={{ display: "grid", gap: "8px", alignItems: "center", gridTemplateColumns: `repeat(${engine!.cores.length}, 1fr)` }}>
                { engine!.cores.map(core => (
                    <CoreUI key={core.id} engineID={props.engineID} coreID={core.id}/>
                )) }
            </div>
        </div>
    );
}
