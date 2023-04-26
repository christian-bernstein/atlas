import React, {useContext, useRef, useState} from "react";
import {DuplexEventRelay} from "./DuplexEventRelay";
import {StyledModal} from "./StyledModal";
import {
    ApiRounded, BugReportRounded,
    CloseRounded,
    DownloadRounded,
    ImageRounded,
    PlayArrowRounded, RefreshRounded,
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

export type SDRequestDialogProps = {
    bus: DuplexEventRelay,
    onClose: () => void
}

export type SDRequestDialogState = {
    phase: "generating" | "default",
    resultImage?: string,
    previewImage?: string,
    progress?: any,
    debouncedRequestSaver: (req: SDAPIRequestData) => void
}

export const SDRequestDialog: React.FC<SDRequestDialogProps> = props => {
    const api = useContext(ImageSorterAPIContext);

    const [state, setState] = useState<SDRequestDialogState>({
        phase: "default",
        debouncedRequestSaver: _.debounce((req: SDAPIRequestData) => {
            api.settingsManager.updateSettingsObject("SDAPIRequestData", () => req).then(() => {
                // TODO mark as saved
                console.log("sd request state saved")
            });
        }, 2e3)
    });

    const sdRequestData = useAutoSettings<SDAPIRequestData>("SDAPIRequestData", {
        prompt: "",
        negativePrompt: ""
    });

    const promptDelta = useRef<SDAPIRequestData>({
        prompt: "",
        negativePrompt: ""
    });

    const updateRequest = (delta: Partial<SDAPIRequestData>) => {
        const newRequest: SDAPIRequestData = { ...promptDelta.current, ...delta };
        promptDelta.current = newRequest;
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
            prompt: promptDelta.current.prompt,
            negative_prompt: promptDelta.current.negativePrompt,
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
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem",
                maxHeight: "70vh"
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
                            const ctx = new SDPromptEngine().parse(promptDelta.current.prompt);
                            alert(JSON.stringify(ctx));
                        }}/>
                    </div>

                    <div style={{
                        width: "100%",
                        backgroundColor: "#101016",
                        paddingTop: "1rem",
                        paddingBottom: "1rem",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }} children={
                        <Editor
                            className={"searchbar-input"}
                            height={"150px"}
                            width={"100%"}
                            saveViewState
                            value={sdRequestData?.prompt ?? ""}
                            options={{
                                fontSize: 14,
                                fontLigatures: true,
                                lineNumbers: "off",
                                autoIndent: "full",
                                codeLens: false,
                                autoClosingBrackets: "always",
                                autoClosingQuotes: "always",
                                hideCursorInOverviewRuler: true,
                                lineDecorationsWidth: 0,
                                renderValidationDecorations: "off",
                                overviewRulerBorder: false,
                                renderLineHighlight: "none",
                                cursorStyle: "underline",
                                matchBrackets: "always",
                                scrollbar: {
                                    vertical: "hidden",
                                    horizontal: "hidden"
                                },
                                minimap: {
                                    enabled: false
                                },
                            }}
                            onChange={(value, ev) => {
                                updateRequest({
                                    prompt: value ?? ""
                                });
                            }}
                            beforeMount={monaco => {
                                monaco.languages.register({ id: "sd-prompt" });

                                monaco.languages.setMonarchTokensProvider("sd-prompt", {
                                    tokenizer: {
                                        root: [
                                            [/\([\w,\s@]+:(\d|(\d.\d))\)/, "full-keyword"],
                                            [/!/, "symbol"],
                                            [/:[\w<>=]+/, "keyword"],
                                            [/#[\s\w]+/, "comment"],
                                            [/\/\*.*\*\//, "comment"],
                                            [/-\w+/, "param"],
                                            [/\$\w+/, "variable"],
                                            [/@\w+/, "annotation"],
                                            [/->/, "arrow-right"],
                                            [/=>/, "arrow-right"],
                                            [/-/, "bullet-point"],
                                            [/:/, "double-point"],
                                            [/,/, "symbol"],
                                            [/(\d*\.?\d+|\d{1,3}(,\d{3})*(\.\d+)?)/, "number"],
                                            [/\w+/, "string"],
                                            // units
                                            [/'.*'/, "string"],
                                            [/mb/, "unit"],

                                            [/gb/, "unit"]
                                        ]
                                    }
                                });

                                monaco.editor.defineTheme("ses-x-dark-tritanopia-notes", {
                                    base: "vs-dark",
                                    inherit: true,
                                    rules: [
                                        { token: "full-keyword", foreground: "#CA7732" },
                                        { token: "arrow-right", foreground: "#A782BB" },
                                        { token: "unit", foreground: "#A782BB" },
                                        { token: "bullet-point", foreground: "#585858" },
                                        { token: "double-point", foreground: "#585858" },
                                        { token: "comment", foreground: "#585858" },
                                        { token: "param", foreground: "#585858" },
                                        { token: "symbol", foreground: "#CA7732" },
                                        { token: "keyword", foreground: "#CA7732" },
                                        { token: "semicolon", foreground: "#CA7732" },
                                        { token: "method", foreground: "#FFC66D" },
                                        { token: "tag", foreground: "#FFC66D" },
                                        { token: "macro", foreground: "#FFC66D" },
                                        { token: "variable", foreground: "#FFC66D" },
                                        { token: "annotation", foreground: "#FFC66D" },
                                        { token: "number", foreground: "#A782BB" },
                                        { token: "string", foreground: "#FFC66D" },
                                    ],
                                    colors: {
                                        "editor.background": "#101016",
                                        "editor.lineHighlightBackground":  "#101016",
                                    }
                                });
                            }}
                            theme={"ses-x-dark-tritanopia-notes"}
                            language={"sd-prompt"}
                        />
                    }/>

                    <DescriptiveTypography text={"Negative prompt"}/>

                    <SDPromptField
                        value={sdRequestData?.negativePrompt ?? ""}
                        onChange={value => updateRequest({
                            negativePrompt: value ?? ""
                        })}
                    />


                    <Formik initialValues={{
                        samplingSteps: 50
                    }} onSubmit={values => {}}>
                        {
                            fp => (
                                <FormElement title={"Sampling steps"}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: "8px",
                                        width: "100%",
                                    }}>
                                        <Slider
                                            size={"small"}
                                            valueLabelDisplay={"auto"}
                                            value={fp.values.samplingSteps}
                                            onChange={(event, value) => fp.setFieldValue("samplingSteps", value)}
                                            color={"secondary"}
                                            marks={[
                                                { value: 50, label: <DescriptiveTypography text={"default"}/> },
                                                { value: 0, label: <DescriptiveTypography text={"0"}/> },
                                                { value: 100, label: <DescriptiveTypography text={"100"}/> }
                                            ]}
                                        />
                                        <input value={fp.values.samplingSteps} inputMode={"numeric"} min={0} max={100} type={"number"} step={1} onChange={event => {
                                            fp.setFieldValue("samplingSteps", event.currentTarget.value)
                                        }}/>
                                        <IconButton size={"small"} onClick={() => fp.setFieldValue("samplingSteps", 50)} children={
                                            <RefreshRounded/>
                                        }/>
                                    </div>
                                </FormElement>
                            )
                        }
                    </Formik>
















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
