import React, {useContext, useRef, useState} from "react";
import {DuplexEventRelay} from "./DuplexEventRelay";
import {StyledModal} from "./StyledModal";
import {
    ApiRounded,
    BugReportRounded,
    BuildRounded,
    CloseRounded,
    CodeRounded,
    CommitRounded,
    DownloadRounded,
    FunctionsRounded,
    GraphicEqRounded, HistoryRounded,
    ImageRounded,
    PlayArrowRounded,
    PushPinRounded,
    RefreshRounded,
    RoomPreferencesRounded,
    SettingsApplicationsRounded,
    SettingsInputComponentRounded,
    StopRounded
} from "@mui/icons-material";
import {px, vw} from "../base/logic/style/DimensionalMeasured";
import Editor from "@monaco-editor/react";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {IconButton} from "./IconButton";
import axios from "axios";
import {Workspace} from "./Workspace";
import {ButtonModalCompound} from "./ButtonModalCompound";
import {Formik} from "formik";
import {FormElement} from "../triton/components/forms/FormElement";
import {Slider} from "@mui/material";
import {useAutoSettings} from "./SettingsHook";
import {SDAPIRequestData} from "./SDAPIRequestData";
import _ from "lodash";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {LanguageParserPipeline} from "./LanguageParserPipeline";
import {SDPromptEngine} from "./SDPromptEngine";
import {SDPromptField} from "./SDPromptField";
import {TabBar} from "./TabBar";
import {TabBodyRenderer} from "./TabBodyRenderer";

export type SDRequestDialogProps = {
    bus: DuplexEventRelay,
    onClose: () => void
}

export type SDRequestDialogState = {
    phase: "generating" | "default",
    resultImage?: string,
    previewImage?: string,
    progress?: any,
    debouncedRequestSaver: (req: SDAPIRequestData) => void,
    activeTab: string
}

export const SDRequestDialog: React.FC<SDRequestDialogProps> = props => {
    const api = useContext(ImageSorterAPIContext);

    const [state, setState] = useState<SDRequestDialogState>({
        phase: "default",
        activeTab: "main",
        debouncedRequestSaver: _.debounce((req: SDAPIRequestData) => {
            api.settingsManager.updateSettingsObject("SDAPIRequestData", () => req).then(() => {});
        }, 2e3)
    });

    // Initial state -> Retrieved from the local database
    const initialRequestData = useAutoSettings<SDAPIRequestData>("SDAPIRequestData", {
        prompt: "",
        negativePrompt: ""
    });

    // Local updates -> Get mixed in to the database mirror
    const deltaRequestData = useRef<SDAPIRequestData>({
        prompt: "",
        negativePrompt: ""
    });

    //
    const updateRequest = (delta: Partial<SDAPIRequestData>) => {
        const newRequest: SDAPIRequestData = { ...deltaRequestData.current, ...delta };
        deltaRequestData.current = newRequest;
        state.debouncedRequestSaver(newRequest);
    }

    const generate = () => {
        setState(prevState => ({ ...prevState, phase: "generating" }));

        let progressRetriever = setInterval(() => {
            axios.get("http://127.0.0.1:7860/sdapi/v1/progress").then(res => {
                setState(prevState => ({
                    ...prevState,
                    progress: res.data,
                    previewImage: res.data.current_image
                }));
            });
        }, 500);

        const conf = {
            prompt: deltaRequestData.current.prompt,
            negative_prompt: deltaRequestData.current.negativePrompt,
            steps: 50,
            sampler_index: "Euler",
            cfg_scale: 7,
            // width: 600,
            width: 512,
            // height: 960,
            height: 512,
            denoising_strength: 0,
            enable_hr: true,
            hr_scale: 1.5,
            hr_upscaler: "R-ESRGAN 4x+ Anime6B",
            hr_second_pass_steps: 50,
        };

        axios.post("http://127.0.0.1:7860/sdapi/v1/txt2img", conf).then(res => {
            clearInterval(progressRetriever);
            setState(prevState => ({
                ...prevState,
                phase: "default",
                resultImage: res.data.images,
                previewImage: undefined,
                progress: undefined
            }));
        }).catch(reason => {
            clearInterval(progressRetriever);
            setState(prevState => ({
                ...prevState,
                phase: "default",
                resultImage: prevState.previewImage ?? prevState.resultImage,
                progress: undefined
            }));
            alert("ERROR! " + reason);
        });
    }

    const interrupt = () => {
        axios.post("http://127.0.0.1:7860/sdapi/v1/interrupt").then(res => {
            setState(prevState => ({
                ...prevState,
                phase: "default",
                resultImage: res.data,
                previewImage: undefined
            }));
        });
    }

    return (
        <StyledModal onClose={() => props.onClose()} loading={state.phase === "generating"} title={"SD API UI"} w={vw(60)} icon={<ApiRounded/>} children={
            <div style={{
                display: "grid",
                gridTemplateRows: "min-content auto",
                gap: "1rem",
                maxHeight: "70vh"
            }}>
                {/* HEADER */}
                <TabBar
                    activeBar={state.activeTab}
                    onTabChange={tab => setState(prevState => ({ ...prevState, activeTab: tab }))}
                    tabs={[
                        { id: "main", title: "SD Prompt", icon: <CodeRounded/> },
                        { id: "config", title: "Generation config", icon: <SettingsApplicationsRounded/> },
                        { id: "mixins", title: "Mixins", icon: <CommitRounded/> },
                        { id: "history", title: "History", icon: <HistoryRounded/> }
                    ]}
                />

                {/* TAB BODY RENDERERS */}
                <TabBodyRenderer
                    active={state.activeTab}
                    tabs={new Map<string, () => React.ReactElement>([
                        ["main", () => <>main</>],
                        ["config", () => <>config</>],
                        ["mixins", () => <>mixins</>],
                    ])}
                />

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1rem",
                    maxHeight: "100%"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "8px",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <DescriptiveTypography text={"Prompt"}/>
                            <IconButton size={"small"} children={<BugReportRounded/>} onClick={() => {
                                const ctx = new SDPromptEngine().parse(deltaRequestData.current.prompt);
                                alert(JSON.stringify(ctx));
                            }}/>
                        </div>

                        <SDPromptField
                            value={initialRequestData?.prompt ?? ""}
                            onChange={value => updateRequest({
                                prompt: value ?? ""
                            })}
                        />

                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "8px",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <DescriptiveTypography text={"Negative prompt"}/>
                            <IconButton size={"small"} children={<BugReportRounded/>} onClick={() => {
                                const ctx = new SDPromptEngine().parse(deltaRequestData.current.negativePrompt);
                                alert(JSON.stringify(ctx));
                            }}/>
                        </div>
                        <SDPromptField
                            value={initialRequestData?.negativePrompt ?? ""}
                            onChange={value => updateRequest({
                                negativePrompt: value ?? ""
                            })}
                        />
                    </div>

                    <Workspace config={{ name: "sd-result-view", mode: "desktop" }} children={
                        <div style={{
                            height: "100%",
                            maxHeight: "calc(100% - 0px)",
                            overflow: "scroll",
                            display: "grid",
                            gap: "8px",
                            justifyContent: "center",
                            gridTemplateRows: "min-content auto",
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                overflow: "hidden",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px"
                            }}>
                                <IconButton size={"small"} deactivated={state.resultImage === undefined} children={<CloseRounded/>} onClick={() => {
                                    setState(prevState => ({
                                        ...prevState, resultImage: undefined
                                    }));
                                }}/>

                                <IconButton size={"small"} deactivated={state.resultImage === undefined} children={<DownloadRounded/>} onClick={() => {

                                }}/>
                            </div>

                            { (state.resultImage || state.previewImage) && (
                                <ButtonModalCompound button={
                                    <img
                                        style={{
                                            borderRadius: "8px",
                                            height: "auto",
                                            width: "auto",
                                            maxHeight: "100%",
                                            maxWidth: "100%",
                                            cursor: "pointer"
                                        }}
                                        alt={"stable diffusion result"}
                                        src={`data:image/png;base64,${state.previewImage ?? state.resultImage}`}
                                    />
                                } modalContent={() => (
                                    <img
                                        style={{
                                            height: "100vh",
                                            width: "auto",
                                            maxWidth: "100vw",
                                        }}
                                        alt={"stable diffusion result"}
                                        src={`data:image/png;base64,${state.previewImage ?? state.resultImage}`}
                                    />
                                )}/>
                            ) }

                            { !(state.resultImage || state.previewImage) && (
                                <span style={{
                                    height: "auto",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }} children={
                                    <ImageRounded/>
                                }/>
                            ) }
                        </div>
                    }/>
                </div>
            </div>
        } footer={
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                gap: "8px"
            }}>
                <IconButton
                    tooltip={state.phase === "default" ? "Generate" : "Interrupt"}
                    onClick={() => {
                        if (state.phase === "generating") interrupt();
                        else if (state.phase === "default") generate();
                    }}
                    size={"small"}
                    children={state.phase === "default" ? (
                        <PlayArrowRounded style={{ color: "mediumseagreen" }}/>
                    ) : (
                        <StopRounded style={{ color: "crimson" }}/>
                    )}
                />


                { state.progress && (
                    <DescriptiveTypography text={`${Math.ceil(state.progress.progress * 100)}% ETA: ${state.progress.eta_relative} STATE: ${state.progress.textinfo}`}/>
                ) }
            </div>
        }/>
    );
}
