import React, {useContext} from "react";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {IconButton} from "../IconButton";
import {
    BugReportRounded,
    CloseRounded,
    DeleteRounded,
    DownloadRounded,
    FullscreenRounded,
    ImageRounded, InfoRounded
} from "@mui/icons-material";
import {SDPromptEngine} from "./SDPromptEngine";
import {SDPromptField} from "./SDPromptField";
import {Workspace} from "../Workspace";
import {ButtonModalCompound} from "../ButtonModalCompound";
import {SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {SDInterfaceRequestContext, SDInterfaceStateContext} from "./SDInterfaceMain";
import {ISADBImageGrid} from "../ISADBImageGrid";
import {SingleOutputImagePreview} from "./SingleOutputImagePreview";
import {SDLivePreview} from "./SDLivePreview";
import {Menu} from "../Menu";
import {MenuButton} from "../MenuButton";

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
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "8px",
                        alignItems: "center"
                    }}>
                        <Menu>
                            <MenuButton icon={<BugReportRounded/>} text={"Try to compile prompt"} onSelect={async () => {
                                const ctx = (await new SDPromptEngine().initUserMixins()).parse(deltaRequestData.prompt);
                                alert(JSON.stringify(ctx));
                            }}/>
                        </Menu>
                    </div>
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
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "8px",
                        alignItems: "center"
                    }}>
                        <Menu>
                            <MenuButton icon={<BugReportRounded/>} text={"Try to compile prompt"} onSelect={async () => {
                                const ctx = (await new SDPromptEngine().initUserMixins()).parse(deltaRequestData.negativePrompt);
                                alert(JSON.stringify(ctx));
                            }}/>
                        </Menu>
                    </div>
                </div>
                <SDPromptField
                    value={initialRequestData?.negativePrompt ?? ""}
                    onChange={value => sdApi.updateRequestData({
                        negativePrompt: value ?? ""
                    })}
                />
            </div>

            <Workspace config={{ name: "sd-result-view", mode: "desktop" }} children={
                (() => {
                    // Preview image present
                    if (state.phase === "generating") {
                        // TODO: Add preview display
                        return (
                            <SDLivePreview/>
                        );
                    }

                    // Not rendering && single result preview available
                    else if (state.phase === "default" && state.currentGeneratedBatchIds !== undefined && state.currentGeneratedBatchIds.length === 1) {
                        return (
                            <SingleOutputImagePreview/>
                        );
                    }

                    // Not rendering && multiple result previews available
                    else if (state.phase === "default" && state.currentGeneratedBatchIds !== undefined && state.currentGeneratedBatchIds.length > 1) {
                        return (
                            <ISADBImageGrid isaTable={"sdInterfaceResults"} imageIDs={state.currentGeneratedBatchIds}/>
                        );
                    }

                    // Not rendering && No image available
                    else if ((state.currentGeneratedBatchIds === undefined || state.currentGeneratedBatchIds.length === 0) && !state.previewImage) {
                        return (
                            <div style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }} children={
                                <span style={{
                                    height: "auto",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"}
                                } children={
                                    <ImageRounded/>
                                }/>
                            }/>
                        )
                    }
                })()
            }/>
        </div>
    );
}
