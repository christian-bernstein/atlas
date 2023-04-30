import React, {useContext} from "react";
import {IconButton} from "../IconButton";
import {
    CloseRounded,
    DeleteRounded,
    DownloadRounded,
    FullscreenRounded,
    InfoRounded
} from "@mui/icons-material";
import {ButtonModalCompound} from "../ButtonModalCompound";
import {SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {SDInterfaceStateContext} from "./SDInterfaceMain";
import {isaDB} from "../ImageSorterAppDB";

export const SingleOutputImagePreview: React.FC = props => {
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
                <IconButton size={"small"} tooltip={"Close preview"} deactivated={state.resultImage === undefined} children={<CloseRounded/>} onClick={() => {
                    sdApi.setState(prevState => ({
                        ...prevState,
                        resultImage: undefined,
                        currentGeneratedBatchIds: undefined
                    }));
                }}/>
                <IconButton size={"small"} tooltip={"Delete generated image"} deactivated={state.resultImage === undefined} children={<DeleteRounded/>} onClick={() => {
                    const imgID = sdApi.state?.currentGeneratedBatchIds?.[0];
                    if (imgID === undefined) return;
                    sdApi.setState(prevState => ({
                        ...prevState,
                        resultImage: undefined,
                        currentGeneratedBatchIds: undefined
                    }));
                    isaDB.sdInterfaceResults.delete(imgID);
                }}/>
                <IconButton size={"small"} tooltip={"Info"} deactivated={state.resultImage === undefined} children={<InfoRounded/>} onClick={() => {}}/>
                <IconButton size={"small"} deactivated={state.resultImage === undefined} children={<DownloadRounded/>} onClick={() => {}}/>
                <ButtonModalCompound button={
                    <IconButton size={"small"} deactivated={state.resultImage === undefined} children={<FullscreenRounded/>}/>
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

            { (state.resultImage || state.previewImage) && (
                <div style={{
                    height: "100%",
                    width: "100%",
                    maxHeight: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    overflow: "scroll"
                }}>
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
                        src={`data:image/png;base64,${state.resultImage}`}
                    />
                </div>
            ) }
        </div>
    );
}
