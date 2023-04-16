import {BC} from "../base/BernieComponent";
import {Assembly} from "../base/logic/assembly/Assembly";
import {Themeable} from "../base/logic/style/Themeable";
import {Modal} from "../triton/components/dialogs/Modal";
import React, {useState} from "react";
import {Screen} from "../base/components/base/Page";
import {Formik} from "formik";
import {v4} from "uuid";
import {ButtonBase, ButtonVariant} from "../triton/components/buttons/ButtonBase";
import {GlobalStyles} from "@mui/material";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import '@szhsin/react-menu/dist/core.css';
import {FormikSingleSelectInput, SingleSelectOption} from "../triton/components/forms/FormikSingleSelectInput";
import {Color} from "../base/logic/style/Color";
import {arrayFactory} from "../base/Utils";
import {Orientation} from "../base/logic/style/Orientation";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {percent} from "../base/logic/style/DimensionalMeasured";
import {SyncLockRounded} from "@mui/icons-material";
import {Simulation} from "../ship/test/core/Simulation";
import {Speedometer} from "./Speedometer";
import {EngineControlUI, EngineControlUIProps} from "./EngineControlUI";
import {EngineState} from "./EngineState";
import {EngineProductionLaw} from "./EngineProductionLaw";
import {EngagementState} from "./EngagementState";
import {BooleanContext} from "./BooleanContext";
import {ControlUnitBaseProps} from "./ControlUnitBaseProps";
import {ControlUnit} from "./ControlUnit";
import {EngineControlUnit} from "./EngineControlUnit";
import {ImageSorterApp} from "../imageSorter/ImageSorterApp";

export const MANUAL_AUTHORITY: string = "manual_authority", SYSTEM_AUTHORITY: string = "system_authority";

export const authoritySelectionOption: Array<SingleSelectOption> = [
    { id: MANUAL_AUTHORITY, text: "M.A", color: Color.ofHex("#D29922") },
    { id: SYSTEM_AUTHORITY, text: "S.A" }
]

export class TestScreen extends BC<any, any, any> {
    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen deactivatePadding style={{
                flexDirection: "column-reverse",
                // Only for ImageSorterApp
                backgroundColor: "#1a1a20"
            }} children={
                <>
                    <GlobalStyles styles={{
                        "& .MuiList-root": {
                            padding: "0 !important"
                        }
                    }}/>
                    {/*
                    <ShipMain/>
                    */}
                    {/*
                    <Simulation
                        fps={1}
                        printCycleTime={true}
                        // runForXFrames={3}
                    />
                    */}
                    <ImageSorterApp/>
                </>
            }/>
        );
    }
}

export function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export type Record = {
    id: string,
    title: string,
    issuer: string,
    description: string
}

function RecordDialog(props: { open: boolean, onCreate: (record: Record) => void, onClose: () => void }): JSX.Element {
    return (
        <Formik initialValues={{
            title: "",
            issuer: "",
            description: "",
            urgency: "",
            status: "",
            taskType: "",

            a: "Off",
            b: "Off",
            c: "Off",
            d: "Off",
            e: "Off",
            f: "Off",
            speed: "Stop",
            buffering: "Off",
            law: "Normal law",
            protection: "Auto",

            aux1: "Off",
            aux2: "Off",
            aux3: "Off",
            aux4: "Off",

            mode: "Off",
            assistance: "Automated"
        }} onSubmit={(values, formikHelpers) => {
            setTimeout(() => {
                props.onCreate({
                    id: v4(),
                    title: values.title,
                    issuer: values.issuer,
                    description: values.description
                });
                formikHelpers.setSubmitting(false)
            }, 1e3);
        }} validate={values => {
            const errors: Partial<typeof values> = {};
            if (values.title.trim().length === 0) errors.title = "Record title is required"
            if (values.issuer.trim().length === 0) errors.issuer = "An issuer is required"
            return errors;
        }} children={formikProps => (
            <Modal
                preventClosingMasterSwitch={formikProps.isSubmitting}
                title={"Add record"}
                preventClosingOnBackdropClick
                open={props.open}
                onClose={() => props.onClose()}
                onSubmit={(e) => {
                    formikProps.handleSubmit(e);
                }}
                footer={
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "4px"
                }} children={
                    <>
                        <BooleanContext children={(bool, setBool) => (
                            <>
                                <Modal open={bool} preventClosingOnBackdropClick onClose={() => { setBool(false) }} title={"Abort"}>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2, 1fr)",
                                        gap: "8px"
                                    }}>
                                        <ButtonBase text={"Cancel"} baseProps={{
                                            type: "button",
                                            onClick: () => {
                                                setBool(false);
                                            }
                                        }}/>
                                        <ButtonBase text={"Abort"} variant={ButtonVariant.DANGER} baseProps={{
                                            type: "button",
                                            onClick: () => {
                                                setBool(false);
                                                props.onClose();
                                            }
                                        }}/>
                                    </div>
                                </Modal>

                                <ButtonBase text={"Cancel"} baseProps={{
                                    type: "button",
                                    onClick: () => {
                                        if (formikProps.dirty) {
                                            setBool(true);
                                        } else {
                                            props.onClose();
                                        }
                                    }
                                }}/>
                            </>
                        )}/>

                        <ButtonBase variant={formikProps.isSubmitting ? ButtonVariant.DEFAULT : ButtonVariant.PRIMARY} text={formikProps.isSubmitting ? "Processing" : "Add record"} baseProps={{
                            type: "button",
                            onClick: () => {
                                formikProps.handleSubmit()
                            }
                        }}/>
                    </>
                }/>
            } children={
                <>
                    {/*
                    <FormElement title={"Record name"} caption={"This is visible to all board members"} children={
                        <>
                            <FormikSingleLineInput name={"title"} formikProps={formikProps}/>
                            <ErrorMessage name={"title"} formikProps={formikProps}/>
                        </>
                    }/>

                    <FormElement title={"Issuer"} children={
                        <>
                            <FormikSingleLineInput name={"issuer"} formikProps={formikProps}/>
                            <ErrorMessage name={"issuer"} formikProps={formikProps}/>
                        </>
                    }/>
                    */}

                    {/*
                    <FormikSingleSelectInput name={"status"} formikProps={formikProps} title={"Status"} options={[
                        { text: "Todo", color: Color.ofHex("#238636") },
                        { text: "Selection for today" },
                        { text: "in Progress", color: Color.ofHex("#9e6a03") },
                        { text: "Await completion / On hold" },
                        { text: "Done", color: Color.ofHex("#8957e5") },
                        { text: "Cancelled" },
                    ]}/>
                    */}

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "8px"
                    }}>
                        <FormikSingleSelectInput name={"mode"} disableSearchbar formikProps={formikProps} title={"Mode"} options={[
                            { text: "Danger", color: Color.ofHex("#d29922") },
                            { text: "On" },
                            { text: "Off", color: Color.ofHex("#da3633") }
                        ]}/>

                        <FormikSingleSelectInput disableSearchbar formikProps={formikProps} name={"assistance"} title={"Assistance"} options={[
                            { text: "Automated" },
                            { text: "Augmented" },
                            { text: "Off" }
                        ]}/>
                    </div>


                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "8px"
                    }}>
                        <FormikSingleSelectInput formikProps={formikProps} name={"urgency"} title={"Urgency"} options={[
                            { text: "Urgent", color: Color.ofHex("#da3633")},
                            { text: "High", color: Color.ofHex("#d29922") },
                            { text: "Medium" },
                            { text: "Low" }
                        ]}/>

                        <FormikSingleSelectInput disableSearchbar formikProps={formikProps} name={"taskType"} title={"Task type"} options={[
                            { text: "Recurring" },
                            { text: "Onetime" }
                        ]}/>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px"
                    }}>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"a"} title={"System A"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Standby"},
                            { text: "Auto" }
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"b"} title={"System B"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Standby"},
                            { text: "Auto" }
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"c"} title={"System C"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Standby"},
                            { text: "Auto" }
                        ]}/>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px"
                    }}>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"d"} title={"System D"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Standby"},
                            { text: "Auto" }
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"e"} title={"System E"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Standby"},
                            { text: "Auto" }
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"f"} title={"System F"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Standby"},
                            { text: "Auto" }
                        ]}/>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "8px"
                    }}>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"aux1"} title={"Aux 1"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Idle"},
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"aux2"} title={"Aux 2"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Idle"},
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"aux3"} title={"Aux 3"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Idle"},
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"aux4"} title={"Aux 4"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Idle"},
                        ]}/>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "8px"
                    }}>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"speed"} title={"Speed"} options={[
                            { text: "Unlimited", color: Color.ofHex("#8957e5") },
                            { text: "Max", color: Color.ofHex("#da3633") },
                            { text: "High", color: Color.ofHex("#d29922") },
                            { text: "Medium" },
                            { text: "Slow"},
                            { text: "Standby" },
                            { text: "Stop" },
                            { text: "ECO", color: Color.ofHex("#238636")}
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"buffering"} title={"Buffering"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Auto" }
                        ]}/>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "8px"
                    }}>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"law"} title={"Law"} options={[
                            { text: "Normal law" },
                            { text: "Alt law I", color: Color.ofHex("#d29922")},
                            { text: "Alt law II", color: Color.ofHex("#d29922") }
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"protection"} title={"Protection"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Auto" }
                        ]}/>
                    </div>

                    {/*
                    <FormElement title={"Description"} caption={"Visible in record headers and value pickers"} children={
                        <FormikTextArea name={"description"} formikProps={formikProps}/>
                    }/>
                    */}
                </>
            }/>
        )}/>
    );
}

const AdvancedFormikTestControlPanel: React.FC = props => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px"
        }}>
            <Formik initialValues={{
                title: "",
                issuer: "",
                description: "",
                urgency: "",
                status: "",
                taskType: "",
                speed: "Stop",
                buffering: "Off",
                law: "Normal law",
                protection: "Auto",
                mode: "Off",
                assistance: "Automated"
            }} onSubmit={(values, formikHelpers) => {}} children={formikProps => (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                }}>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px"
                    }}>
                        <FormikSingleSelectInput name={"mode"} disableSearchbar formikProps={formikProps} title={"Mode"} options={[
                            { text: "Danger", color: Color.ofHex("#d29922") },
                            { text: "On" },
                            { text: "Hibernation" },
                            { text: "Off", color: Color.ofHex("#da3633") }
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"law"} title={"Law"} options={[
                            { text: "Normal law" },
                            { text: "Alt law I", color: Color.ofHex("#d29922")},
                            { text: "Alt law II", color: Color.ofHex("#d29922") }
                        ]}/>
                        <FormikSingleSelectInput disableSearchbar formikProps={formikProps} name={"assistance"} title={"Assistance"} options={[
                            { text: "Automated" },
                            { text: "Augmented" },
                            { text: "Off" }
                        ]}/>
                    </div>


                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "8px"
                    }}>
                        <FormikSingleSelectInput formikProps={formikProps} name={"urgency"} title={"Urgency"} options={[
                            { text: "Urgent", color: Color.ofHex("#da3633")},
                            { text: "High", color: Color.ofHex("#d29922") },
                            { text: "Medium" },
                            { text: "Low" }
                        ]}/>

                        <FormikSingleSelectInput disableSearchbar formikProps={formikProps} name={"taskType"} title={"Task type"} options={[
                            { text: "Recurring" },
                            { text: "Onetime" }
                        ]}/>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px"
                    }}>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"speed"} title={"Speed"} options={[
                            { text: "Unlimited", color: Color.ofHex("#8957e5") },
                            { text: "Max", color: Color.ofHex("#da3633") },
                            { text: "High", color: Color.ofHex("#d29922") },
                            { text: "Medium" },
                            { text: "Slow"},
                            { text: "Standby" },
                            { text: "Stop" },
                            { text: "ECO", color: Color.ofHex("#238636")}
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"buffering"} title={"Buffering"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Auto" }
                        ]}/>
                        <FormikSingleSelectInput placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"protection"} title={"Protection"} options={[
                            { text: "On", color: Color.ofHex("#238636") },
                            { text: "Off", color: Color.ofHex("#da3633")},
                            { text: "Auto" }
                        ]}/>
                    </div>
                </div>
            )}/>

            {(() => {
                const engines = arrayFactory(i => `Reactor ${i}`, 3)

                const engineStates = [
                    { text: "Max", color: Color.ofHex("#8957e5") },
                    { text: "On", color: Color.ofHex("#238636") },
                    { text: "Off", color: Color.ofHex("#da3633")},
                    { text: "Idle"},
                    { text: "Service"},
                    { text: "Auto"},
                ];

                return (
                    <div style={{
                        padding: "8px",
                        border: "1px solid rgb(48,54,61)",
                        borderRadius: "6px"
                    }}>
                        <Formik initialValues={{
                            master: "",
                            ...engines.reduce((o, key) => ({ ...o, [key]: "Off"}), {})
                        }} onSubmit={(values, formikHelpers) => {}} children={formikProps => (
                            <div style={{
                                display: "grid",
                                gap: "8px"
                            }}>
                                {/*
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gap: "8px"
                                }}>
                                    <FormikSingleSelectInput onPreSubmit={value => {
                                        formikProps.setFormikState(prevState => ({
                                            ...prevState,
                                            values: {
                                                ...prevState.values,
                                                ...engines.reduce((o, key) => ({ ...o, [key]: value}), {})
                                            }
                                        }))
                                    }} placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"master"} title={"Master"} options={engineStates}/>
                                </div>
                                */}

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: "8px"
                                }}>
                                    { engines.map(engine => (
                                        <FormikSingleSelectInput centerSelectedElementBadge key={engine} placeholder={"Select"} disableSearchbar formikProps={formikProps} name={engine} title={engine} options={engineStates}/>
                                    )) }
                                </div>
                            </div>
                        )}/>
                    </div>
                );
            })()}

            {(() => {
                const auxiliaryEngines = arrayFactory(i => `Aux ${'abcdefghijklmnopqrstuvwxyz'.toUpperCase().charAt(i % 4)}${(i % 4) + ((i / 4) % 4) - (i % 4)/4}`, 4)

                const auxEngineState = [
                    { text: "Max", color: Color.ofHex("#8957e5") },
                    { text: "On", color: Color.ofHex("#238636") },
                    { text: "Off", color: Color.ofHex("#da3633")},
                    { text: "Idle"},
                    { text: "Service"},
                ];

                return (
                    <div style={{
                        padding: "8px",
                        border: "1px solid rgb(48,54,61)",
                        borderRadius: "6px"
                    }}>
                        <Formik initialValues={{
                            master: "",
                            ...auxiliaryEngines.reduce((o, key) => ({ ...o, [key]: "Off"}), {})
                        }} onSubmit={(values, formikHelpers) => {}} children={formikProps => (
                            <div style={{
                                display: "grid",
                                gap: "8px"
                            }}>
                                {/*
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gap: "8px"
                                }}>
                                    <FormikSingleSelectInput onPreSubmit={value => {
                                        formikProps.setFormikState(prevState => ({
                                            ...prevState,
                                            values: {
                                                ...prevState.values,
                                                ...auxiliaryEngines.reduce((o, key) => ({ ...o, [key]: value}), {})
                                            }
                                        }))
                                    }} placeholder={"Select"} disableSearchbar formikProps={formikProps} name={"master"} title={"Master"} options={auxEngineState}/>
                                </div>

                                */}

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, 1fr)",
                                    gap: "8px"
                                }}>
                                    { auxiliaryEngines.map(engine => (
                                        <FormikSingleSelectInput centerSelectedElementBadge key={engine} placeholder={"Select"} disableSearchbar formikProps={formikProps} name={engine} title={engine} options={auxEngineState}/>
                                    )) }
                                </div>
                            </div>
                        )}/>
                    </div>
                );
            })()}
        </div>
    );
}

export const thrusterStates = [
    { text: "Max", color: Color.ofHex("#8957e5") },
    { text: "Red", color: Color.ofHex("#D29922") },
    { text: "On", color: Color.ofHex("#238636") },
    { text: "Off", color: Color.ofHex("#da3633") },
    { text: "Idle"},
    { text: "Service"},
];

export const thrusterEnergyStates = new Map<string, number>([
    ["On", 75],
    ["Max", 100],
    ["Idle", 5],
    ["Red", 50],
]);

export type ShipMainState = {
    engines: Array<EngineState>
}

const generateInitialShipState: () => ShipMainState = () => {
    return ({
        engines: arrayFactory(i => ({
            id: String(i),
            actualEProd: 0,
            selectedEProd: 0,
            authority: MANUAL_AUTHORITY,
            engagementState: EngagementState.ENGAGED,
            cores: [],
            coreStates: arrayFactory(cI => ({
                id: String(cI),
                eProd: 0,
                manual: false,
                eProdCap: 100,
                state: EngineProductionLaw.OFF
            }), 4)
        }), 4)
    });
}

export function ShipMain(): JSX.Element {
    const [state, setState]: [ShipMainState, ((value: (((prevState: ShipMainState) => ShipMainState) | ShipMainState)) => void)] = useState(generateInitialShipState());

    const getEngine: (id: string) => EngineState = id => state.engines.find(e => e.id === id)!;

    const updateEngine: (id: string, updater: ((engine: EngineState) => EngineState)) => void = (id, updater) => {
        updater(getEngine(id));
        setState(prevState => ({ ...prevState, engines: [...prevState.engines]}));
        onEngineUpdate();
    }

    const calculateCommutativeEngineEProd: () => number = () => state.engines
        .filter(e => e.engagementState === EngagementState.ENGAGED)
        .map(e => e.actualEProd)
        .reduce((acc, n) => acc + n, 0)

    const calculateCommutativeEngineEProdPercentage: () => number = () => calculateCommutativeEngineEProd() / state.engines.length * 1.33333;

    const onEngineUpdate = () => {
        // syncMasterToCores();
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "10px" }}>


            {(() => {
                const thrusters = arrayFactory(i => `Engine ${'abcdefghijklmnopqrstuvwxyz'.toUpperCase().charAt(i)}`, 4)

                return (
                    <div style={{
                        padding: "8px",
                        border: "1px solid rgb(48,54,61)",
                        borderRadius: "6px"
                    }}>
                        <Formik initialValues={{
                            ...thrusters.reduce((o, key) => ({ ...o, [key]: "Off"}), {}),
                            ...thrusters.reduce((o, key) => ({ ...o, [key + "_engagement"]: EngagementState.DISENGAGED}), {}),
                        }} onSubmit={(values, formikHelpers) => {}} children={formikProps => {


                            const commutativeEngineEProdPercentage = calculateCommutativeEngineEProdPercentage();

                            return (
                                <div style={{
                                    display: "grid",
                                    gap: "8px",
                                    gridTemplateColumns: "min-content auto min-content"
                                }}>
                                    <Speedometer val={commutativeEngineEProdPercentage} orientation={Orientation.VERTICAL}/>

                                    <div style={{
                                        display: "grid",
                                        gap: "8px"
                                    }}>
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(2, 1fr)",
                                            gap: "8px"
                                        }}>
                                            { state.engines.map(engine => {
                                                return (
                                                    <EngineControlUI
                                                        key={engine.id}
                                                        formikProps={formikProps}
                                                        id={engine.id}
                                                        displayName={engine.id}
                                                        engineState={engine}
                                                        controlUnit={new EngineControlUnit().setProps({
                                                            engineID: engine.id,
                                                            state: state,
                                                            setState: setState
                                                        })}
                                                    />
                                                )
                                            }) }
                                        </div>

                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(3, 1fr)",
                                            gap: "8px"
                                        }}>
                                            <ButtonBase text={"OP"} baseProps={{
                                                onClick: async () => {
                                                    function sleep(milliseconds: number): Promise<void> {
                                                        return new Promise(resolve => setTimeout(resolve, milliseconds));
                                                    }

                                                    for (const t of thrusters) {
                                                        formikProps.setFieldValue(t, "On");
                                                        await sleep(1e3)
                                                    }

                                                    await sleep(1e3)

                                                    for (const v1 of Object.entries<string>(formikProps.values)
                                                        .filter(v => v[0].endsWith("_engagement"))
                                                        .map(v => v[0])
                                                        ) {
                                                        formikProps.setFieldValue(v1, EngagementState.ENGAGING)
                                                        await sleep(350)
                                                    }

                                                    await sleep(500)

                                                    for (const v1 of Object.entries<string>(formikProps.values)
                                                        .filter(v => v[0].endsWith("_engagement"))
                                                        .map(v => v[0])
                                                        ) {
                                                        formikProps.setFieldValue(v1, EngagementState.ENGAGED)
                                                        await sleep(350)
                                                    }
                                                }
                                            }}/>

                                            <FormikSingleSelectInput formikProps={formikProps} disableSearchbar centerSelectedElementBadge name={"TP"} placeholder={"Throughput"} options={thrusterStates} onPreSubmit={async value => {
                                                function sleep(milliseconds: number): Promise<void> {
                                                    return new Promise(resolve => setTimeout(resolve, milliseconds));
                                                }

                                                for (const t of thrusters) {
                                                    formikProps.setFieldValue(t, value);
                                                    await sleep(500)
                                                }
                                            }}/>

                                            <ButtonBase text={"Off"} baseProps={{
                                                onClick: async () => {
                                                    function sleep(milliseconds: number): Promise<void> {
                                                        return new Promise(resolve => setTimeout(resolve, milliseconds));
                                                    }

                                                    for (const v1 of Object.entries<string>(formikProps.values)
                                                        .filter(v => v[0].endsWith("_engagement"))
                                                        .map(v => v[0])
                                                        ) {
                                                        formikProps.setFieldValue(v1, EngagementState.DISENGAGING)
                                                        await sleep(350)
                                                    }

                                                    for (const t of thrusters) {
                                                        formikProps.setFieldValue(t, "Off");
                                                        await sleep(1e3)
                                                    }

                                                    await sleep(2e3)

                                                    for (const v1 of Object.entries<string>(formikProps.values)
                                                        .filter(v => v[0].endsWith("_engagement"))
                                                        .map(v => v[0])
                                                        ) {
                                                        formikProps.setFieldValue(v1, EngagementState.DISENGAGED)
                                                        // await sleep(350)
                                                    }
                                                }
                                            }}/>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}/>
                    </div>
                );
            })()}
        </div>
    );
}

export type EngineCoreState = {
    id: string,
    eProd: number,
    state: EngineProductionLaw,
    manual: boolean,
    eProdCap: number
}


type EngineArrayControlUnitProps = ControlUnitBaseProps;

class EngineArrayControlUnit implements ControlUnit<EngineArrayControlUnitProps, EngineArrayControlUnit> {

    props: EngineArrayControlUnitProps | undefined;

    setProps(props: EngineArrayControlUnitProps): EngineArrayControlUnit {
        this.props = props;
        return this;
    }
}

const EngineArrayControlUI: React.FC<EngineControlUIProps> = props => {
    const [cores, setCores] = useState(arrayFactory(i => ({
        id: `${i}`,
        eProd: 50,
        state: EngineProductionLaw.OPERATIONAL,
        manual: false,
        eProdCap: 100
    }), 5));

    const calculateCumulativeEProd = () => cores.map(c => c.eProd).reduce((acc, n) => acc + n, 0) / cores.length;

    const [accProd, setAccProd] = useState(calculateCumulativeEProd())

    const syncMasterToCores = () => {
        setAccProd(calculateCumulativeEProd());
    }

    const applyProdConstraints = async () => {
        const reqRaw = props.formikProps.values.req;
        if (reqRaw === undefined) return;
        const req = reqRaw > 0 ? reqRaw * cores.length : 0;
        const cur = cores.map(c => c.eProd).reduce((acc, n) => acc + n, 0)
        let d = req - cur;
        if (d < 0) {
            d = d * -1;
            // Reduce from the right
            for (let c of cores.filter(c => !c.manual).reverse()) {
                await sleep(500);

                if (c.eProd >= d) {
                    // This core is the last to be affected
                    const newEProd = c.eProd - d;
                    updateCore(c.id, core => {
                        core.eProd = newEProd;
                        return core;
                    });
                    break;
                } else {
                    const redBy = c.eProd;
                    updateCore(c.id, core => {
                        core.eProd = 0;
                        return core;
                    });
                    d -= redBy;
                }
            }
        } else {
            // Increase from the left
            for (let c of cores.filter(c => !c.manual)) {
                await sleep(500);

                let tilCap = c.eProdCap - c.eProd;
                if (tilCap >= d) {
                    // This core is the last to be affected
                    const newEProd = c.eProd + d;
                    updateCore(c.id, core => {
                        core.eProd = newEProd;
                        return core;
                    });
                    break;
                } else {
                    updateCore(c.id, core => {
                        core.eProd = c.eProdCap;
                        return core;
                    });
                    d -= tilCap;
                }
            }
        }
    }

    const getCore: (id: string) => EngineCoreState = id => {
        return cores.find(c => c.id === id)!;
    }

    const updateCore: (id: string, updater: ((core: EngineCoreState) => EngineCoreState)) => void = (id, updater) => {
        updater(getCore(id));
        setCores([...cores]);
        syncMasterToCores();
    }

    return (
        <div style={{
            display: "grid",
            gap: "8px"
        }}>
            <div style={{
                width: "100%",
                backgroundColor: "rgb(1, 4, 9)",
                position: "relative",
                border: "1px solid rgb(33, 38, 45)",
                borderRadius: "8px",
                padding: "8px",
                display: "grid",
                gap: "8px"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px"
                }} children={ cores.map(core => {

                    return (
                        <div key={core.id} style={{
                            width: "100%",
                            display: "grid",
                            gap: "8px",
                        }}>
                            <span style={{
                                height: "50px"
                            }} children={
                                <Speedometer cap={core.eProdCap} width={percent(100)} orientation={Orientation.VERTICAL} key={`${core.id}-speedometer`} val={(core.eProd ?? 0) / core.eProdCap  * 100}/>
                            }/>
                            <FormikSingleSelectInput placeholder={""} disableSearchbar centerSelectedElementBadge formikProps={props.formikProps} name={`core-man-${core.id}`} options={[
                                { text: "A" },
                                { text: "M", color: Color.ofHex("#D29922") }
                            ]} onPreSubmit={value => {
                                updateCore(core.id, cU => {
                                    cU.manual = value === "M"
                                    return cU;
                                });
                                applyProdConstraints();
                            }}/>

                            <FormikSingleSelectInput placeholder={"%"} disableSearchbar centerSelectedElementBadge formikProps={props.formikProps} name={`core-prod-${core.id}`} options={[
                                { text: "150" },
                                { text: "100" },
                                { text: "50" },
                                { text: "0" }
                            ]} onPreSubmit={value => {
                                updateCore(core.id, cU => {
                                    cU.eProd = Number(value);
                                    return cU;
                                });
                                applyProdConstraints();
                            }}/>

                            <ButtonBase children={
                                <span style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }} children={
                                    <SyncLockRounded sx={{
                                        width: 16,
                                        height: 16,
                                    }}/>
                                }/>
                            } baseProps={{
                                type: "button",
                                onClick: () => {
                                    updateCore(core.id, cU => {
                                        cU.eProd = Number(props.formikProps.values[`core-prod-${core.id}`]);
                                        return cU;
                                    });
                                    applyProdConstraints();
                                }
                            }}/>
                        </div>
                    );
                })}/>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "min-content auto",
                gap: "8px",
            }}>
                <div style={{
                    width: "100%",
                    backgroundColor: "rgb(1, 4, 9)",
                    position: "relative",
                    border: "1px solid rgb(33, 38, 45)",
                    borderRadius: "8px",
                    padding: "8px",
                    display: "grid",
                    gap: "8px",
                }}>
                    <Speedometer
                        orientation={Orientation.VERTICAL}
                        key={`${props.id}-speedometer`}
                        val={accProd ?? 0}
                    />
                </div>

                <div style={{
                    width: "100%",
                    backgroundColor: "rgb(1, 4, 9)",
                    position: "relative",
                    border: "1px solid rgb(33, 38, 45)",
                    borderRadius: "8px",
                    padding: "8px",
                    display: "grid",
                    gap: "8px",
                    gridTemplateColumns: "repeat(3, 1fr)"
                }}>
                    <FormikSingleLineInput name={"req"} formikProps={props.formikProps}/>

                    <ButtonBase text={"Off"} baseProps={{
                        type: "button",
                        onClick: () => {
                            props.formikProps.setFieldValue("req", 0)
                            applyProdConstraints();
                        }
                    }}/>

                    <ButtonBase text={"On"} baseProps={{
                        type: "button",
                        onClick: () => {
                            props.formikProps.setFieldValue("req", 100)
                            applyProdConstraints();
                        }
                    }}/>

                    <ButtonBase children={
                        <span style={{
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }} children={
                            <SyncLockRounded sx={{
                                width: 16,
                                height: 16,
                            }}/>
                        }/>
                    } baseProps={{
                        type: "button",
                        onClick: () => {
                            applyProdConstraints();
                        }
                    }}/>

                    <ButtonBase text={"Def cap"} baseProps={{
                        type: "button",
                        onClick: () => {
                            cores.forEach(c => {
                                updateCore(c.id, cU => {
                                    c.eProdCap = 100;
                                    return cU;
                                });
                            })
                            applyProdConstraints();
                        }
                    }}/>

                    <ButtonBase text={"Max cap"} baseProps={{
                        type: "button",
                        onClick: () => {
                            cores.forEach(c => {
                                updateCore(c.id, cU => {
                                    c.eProdCap = 150;
                                    return cU;
                                });
                            })
                            applyProdConstraints();
                        }
                    }}/>
                </div>
            </div>
        </div>
    );
}

