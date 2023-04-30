import React, {useContext} from "react";
import {SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {SDInterfaceStateContext} from "./SDInterfaceMain";
import {IconButton} from "../IconButton";
import {
    CloseRounded,
    DeleteRounded,
    DownloadRounded,
    FullscreenRounded,
    InfoRounded,
    StopRounded
} from "@mui/icons-material";
import {ButtonModalCompound} from "../ButtonModalCompound";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";

export const SDLivePreview: React.FC = props => {
    const sdApi = useContext(SDInterfaceAPIContext);
    const state = useContext(SDInterfaceStateContext);

    return (
        <div style={{
            height: "100%",
            maxHeight: "calc(100% - 0px)",
            overflow: "hidden",
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
                <IconButton size={"small"} tooltip={"Interrupt"} children={<StopRounded style={{
                    color: "crimson"
                }}/>} onClick={() => {
                    sdApi.interruptImageGeneration();
                }}/>
                <ButtonModalCompound button={
                    <IconButton size={"small"} deactivated={state.previewImage === undefined} children={<FullscreenRounded/>}/>
                } modalContent={() => (
                    <img
                        style={{
                            height: "auto",
                            width: "auto",
                            maxHeight: "100%",
                            maxWidth: "100%",
                        }}
                        alt={"stable diffusion result"}
                        src={`data:image/png;base64,${state.previewImage ?? state.resultImage}`}
                    />
                )}/>
            </div>

            <div style={{
                height: "100%",
                width: "100%",
                maxHeight: "100%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                overflow: "scroll"
            }}>
                { state.previewImage && (
                    <img
                        style={{
                            borderRadius: "8px",
                            height: "auto",
                            width: "auto",
                            maxHeight: "100%",
                            maxWidth: "100%",
                            cursor: "pointer",
                            objectFit: "scale-down"
                        }}
                        alt={"stable diffusion result"}
                        src={`data:image/png;base64,${state.previewImage}`}
                    />
                ) }
            </div>
        </div>
    );
}
