import React, {useContext} from "react";
import {DuplexEventRelay} from "../DuplexEventRelay";
import {vw} from "../../base/logic/style/DimensionalMeasured";
import {
    ApiRounded,
    BugReportRounded, CloseRounded,
    CodeRounded,
    CommitRounded, DownloadRounded,
    HistoryRounded, ImageRounded, LiveTvRounded, PlayArrowRounded, PreviewRounded,
    SettingsApplicationsRounded, StopRounded, TokenRounded
} from "@mui/icons-material";
import {StyledModal} from "../StyledModal";
import {SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {TabBar} from "../TabBar";
import {TabBodyRenderer} from "../TabBodyRenderer";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {IconButton} from "../IconButton";
import {SDPromptEngine} from "./SDPromptEngine";
import {SDPromptField} from "./SDPromptField";
import {Workspace} from "../Workspace";
import {ButtonModalCompound} from "../ButtonModalCompound";
import {SDInterfaceStateContext} from "./SDInterfaceMain";
import {MainTab} from "./MainTab";
import {MixinTab} from "./MixinTab";
import {HistoryTab} from "./HistoryTab";
import {Menu} from "../Menu";
import {MenuButton} from "../MenuButton";
import {LinearProgress, Zoom} from "@mui/material";
import {TransitionGroup} from "react-transition-group";
import {GenerationConfigTab} from "./GenerationConfigTab";
import {LiveProcessTab} from "./LiveProcessTab";

export type SDDefaultInterfaceProps = {
    bus: DuplexEventRelay,
    onClose: () => void
}

export const SDDefaultInterface: React.FC<SDDefaultInterfaceProps> = props => {
    const sdApi = useContext(SDInterfaceAPIContext);
    const state = useContext(SDInterfaceStateContext);

    return (
        <StyledModal
            onClose={() => props.onClose()}
            loading={state.phase === "generating"}
            title={`SD API UI`}
            w={vw(65)}
            icon={<ApiRounded/>}
            children={
                <div style={{
                    display: "grid",
                    gridTemplateRows: "min-content auto",
                    gap: "1rem",
                    maxHeight: "70vh"
                }}>
                    {/* HEADER */}
                    <TabBar
                        activeBar={state.activeTab}
                        onTabChange={tab => sdApi.setState(prevState => ({ ...prevState, activeTab: tab }))}
                        tabs={[
                            { id: "main", title: "SD Prompt", icon: <CodeRounded/> },
                            { id: "config", title: "Generation config", icon: <SettingsApplicationsRounded/> },
                            { id: "mixins", title: "Mixins", icon: <TokenRounded/> },
                            { id: "history", title: "History", icon: <HistoryRounded/> },
                            { id: "live", title: "Live process preview", icon: <LiveTvRounded/> }
                        ]}
                    />

                    {/* TAB BODY RENDERERS */}
                    <div style={{
                        width: "100%",
                        // overflow: "hidden",
                        height: "50vh"
                    }} children={
                        <TabBodyRenderer
                            active={state.activeTab}
                            tabs={new Map<string, () => React.ReactElement>([
                                ["main", () => <MainTab/>],
                                ["mixins", () => <MixinTab/>],
                                ["history", () => <HistoryTab/>],
                                ["config", () => <GenerationConfigTab/>],
                                ["live", () => <LiveProcessTab/>],
                            ])}
                        />
                    }/>
                </div>
            }
            footer={
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    alignItems: "center",
                    width: "100%",
                    gap: "8px"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        gap: "8px"
                    }}>
                        <Menu>
                            <MenuButton icon={<StopRounded/>} text={"Try to interrupt SD generation"} onSelect={() => {
                                sdApi.interruptImageGeneration();
                            }}/>
                        </Menu>
                        <IconButton
                            tooltip={state.phase === "default" ? "Generate" : "Interrupt"}
                            onClick={() => {
                                if (state.phase === "generating") sdApi.interruptImageGeneration();
                                else if (state.phase === "default") sdApi.generate().then(() => {});
                            }}
                            size={"small"}
                            children={state.phase === "default" ? (
                                <PlayArrowRounded style={{ color: "mediumseagreen" }}/>
                            ) : (
                                <StopRounded style={{ color: "crimson" }}/>
                            )}
                        />
                        { state.progress && (
                            <DescriptiveTypography
                                text={`${Math.ceil(state.progress.progress * 100)}% ETA: ${Math.floor(state.progress.eta_relative)}`}
                            />
                        ) }
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        gap: "8px"
                    }}>
                        <TransitionGroup style={{
                            width: "100%",
                            height: "100%"
                        }} children={
                            (state.progress !== undefined) && (
                                <Zoom children={
                                    <LinearProgress
                                        value={Math.ceil(state.progress.progress * 100)}
                                        style={{ width: "100%", borderRadius: "50px", overflow: "hidden" }}
                                        variant={"determinate"}
                                        // sx={{ color: "#5028c8" }}
                                        color={"error"}
                                    />
                                }/>
                            )
                        }/>
                    </div>
                </div>
            }
        />
    );
}
