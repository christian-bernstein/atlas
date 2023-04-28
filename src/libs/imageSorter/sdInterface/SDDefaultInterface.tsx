import React, {useContext} from "react";
import {DuplexEventRelay} from "../DuplexEventRelay";
import {vw} from "../../base/logic/style/DimensionalMeasured";
import {
    ApiRounded,
    BugReportRounded, CloseRounded,
    CodeRounded,
    CommitRounded, DownloadRounded,
    HistoryRounded, ImageRounded,
    SettingsApplicationsRounded
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

export type SDDefaultInterfaceProps = {
    bus: DuplexEventRelay,
    onClose: () => void
}

export const SDDefaultInterface: React.FC<SDDefaultInterfaceProps> = props => {
    const sdApi = useContext(SDInterfaceAPIContext);
    const state = useContext(SDInterfaceStateContext);

    console.log("[SDDefaultInterface] sd api:", sdApi, "state", state);

    return (
        <StyledModal
            onClose={() => props.onClose()}
            loading={state.phase === "generating"}
            title={`SD API UI`}
            w={vw(60)}
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
                            { id: "mixins", title: "Mixins", icon: <CommitRounded/> },
                            { id: "history", title: "History", icon: <HistoryRounded/> }
                        ]}
                    />

                    {/* TAB BODY RENDERERS */}
                    <div style={{
                        width: "100%",
                        overflow: "hidden",
                        height: "50vh"
                    }} children={
                        <TabBodyRenderer
                            active={state.activeTab}
                            tabs={new Map<string, () => React.ReactElement>([
                                ["main", () => <MainTab/>],
                                ["mixins", () => <MixinTab/>]
                            ])}
                        />
                    }/>
                </div>
            }
        />
    );
}
