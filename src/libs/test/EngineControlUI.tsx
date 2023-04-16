import React from "react";
import {Speedometer} from "./Speedometer";
import {Orientation} from "../base/logic/style/Orientation";
import {BasicSingleSelect} from "../triton/components/forms/BasicSingleSelect";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {SettingsRounded} from "@mui/icons-material";
import {Modal} from "../triton/components/dialogs/Modal";
import {Formik, FormikProps} from "formik";
import {EngineState} from "./EngineState";
import {authoritySelectionOption, thrusterStates} from "./TestScreen";
import {BooleanContext} from "./BooleanContext";
import {EngageSwitch} from "./EngageSwitch";
import {EngineControlUnit} from "./EngineControlUnit";
import {ShipAPIContext} from "../ship/test/core/ShipAPI";

export type EngineControlUIProps = {

    // TODO: Remove
    formikProps: FormikProps<any>,

    id: string,
    displayName: string,
    engineState: EngineState,
    controlUnit: EngineControlUnit
}

export const EngineControlUI: React.FC<EngineControlUIProps> = props => {
    const engagementState = props.controlUnit.getEngine().engagementState;

    return (
        <ShipAPIContext.Consumer children={api => {
            return (
                <div style={{
                    width: "100%",
                    backgroundColor: "rgb(1, 4, 9)",
                    position: "relative",
                    border: "1px solid rgb(33, 38, 45)",
                    borderRadius: "8px",
                    padding: "8px",
                    display: "grid",
                    gridTemplateColumns: "min-content auto",
                    gap: "8px"
                }}>
                    <Speedometer
                        orientation={Orientation.VERTICAL}
                        key={`${props.id}-speedometer`}
                        val={props.controlUnit.getEngineEProd()}
                    />

                    <div style={{
                        display: "grid",
                        gap: "8px"
                    }}>
                        <BasicSingleSelect
                            selected={props.engineState.manualSelectedProgram}
                            centerSelectedElementBadge
                            placeholder={"Program"}
                            disableSearchbar
                            name={`program-${props.id}`}
                            options={thrusterStates}
                            onSelect={program => props.controlUnit.selectEngineProgram(program)}
                        />

                        <BasicSingleSelect
                            selected={props.engineState.authority}
                            centerSelectedElementBadge
                            placeholder={"Authority"}
                            disableSearchbar
                            name={`authority-${props.id}`}
                            options={authoritySelectionOption}
                            onSelect={authority => props.controlUnit.setEngineAuthority(authority)}
                        />

                        <div style={{
                            display: "grid",
                            gap: "8px",
                            gridTemplateColumns: "repeat(2, 1fr)"
                        }}>

                            <EngageSwitch state={engagementState} onStateChange={to => {
                                props.controlUnit.toggleEngagement().then(() => {});
                            }}/>

                            <BooleanContext children={(bool, setBool) => (
                                <>
                                    <ButtonBase children={
                                        <span style={{
                                            display: "flex",
                                            height: "100%",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }} children={
                                            <SettingsRounded sx={{
                                                width: 16,
                                                height: 16,
                                            }}/>
                                        }/>
                                    } baseProps={{
                                        type: "button",
                                        onClick: () => setBool(!bool)
                                    }}/>
                                    <Modal open={bool} title={props.displayName} onClose={() => setBool(false)}>
                                        <Formik initialValues={{}} onSubmit={() => {
                                        }} children={props => (
                                            <>Implement</>

                                            // <EngineArrayControlUI id={"test"} displayName={"Test"} formikProps={props}/>

                                        )}/>
                                    </Modal>
                                </>
                            )}/>
                        </div>
                    </div>
                </div>
            );
        }}/>
    );
}
