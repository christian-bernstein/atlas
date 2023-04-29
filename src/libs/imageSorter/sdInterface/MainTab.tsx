import React, {useContext} from "react";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {IconButton} from "../IconButton";
import {BugReportRounded, CloseRounded, DownloadRounded, ImageRounded} from "@mui/icons-material";
import {SDPromptEngine} from "./SDPromptEngine";
import {SDPromptField} from "./SDPromptField";
import {Workspace} from "../Workspace";
import {ButtonModalCompound} from "../ButtonModalCompound";
import {SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {SDInterfaceRequestContext, SDInterfaceStateContext} from "./SDInterfaceMain";

export const MainTab: React.FC = props => {
    const sdApi = useContext(SDInterfaceAPIContext);
    const state = useContext(SDInterfaceStateContext);
    const requestContextData = useContext(SDInterfaceRequestContext);
    const initialRequestData = requestContextData?.initialRequestData!;
    const deltaRequestData = requestContextData?.deltaRequestData!;

    if (requestContextData === undefined) return <>RCD not available</>

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
            height: "100%",
            maxHeight: "100%"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                height: "100%"
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
                    <IconButton size={"small"} children={<BugReportRounded/>} onClick={async () => {
                        const ctx = (await new SDPromptEngine().initUserMixins()).parse(deltaRequestData.prompt);
                        alert(JSON.stringify(ctx));
                    }}/>
                </div>

                <SDPromptField
                    value={initialRequestData?.prompt ?? ""}
                    onChange={value => sdApi.updateRequestData({
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
                    <IconButton size={"small"} children={<BugReportRounded/>} onClick={async () => {
                        const ctx = (await new SDPromptEngine().initUserMixins()).parse(deltaRequestData.negativePrompt);
                        alert(JSON.stringify(ctx));
                    }}/>
                </div>
                <SDPromptField
                    value={initialRequestData?.negativePrompt ?? ""}
                    onChange={value => sdApi.updateRequestData({
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
                            sdApi.setState(prevState => ({
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
    );
}
