import React, {useContext, useState} from "react";
import axios from "axios";
import {SDInterfaceAPIContext} from "./SDInterfaceAPI";
import {Workspace} from "../Workspace";
import {IconButton} from "../IconButton";
import {PlayArrowRounded} from "@mui/icons-material";

export type LiveProcessTabState = {
    listener?: NodeJS.Timer,
    listening: boolean,
    previewImage?: string
}

export const LiveProcessTab: React.FC = props => {
    const sdApi = useContext(SDInterfaceAPIContext);
    const [localState, setLocalState] = useState<LiveProcessTabState>({
        listening: false
    });

    return (
        <Workspace config={{ name: "live-process", mode: "desktop" }} children={
            localState.listening ? (
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
                        src={`data:image/png;base64,${localState.previewImage}`}
                    />
                </div>
            ) : (
                <IconButton onClick={() => {
                    setLocalState(prevState => ({
                        ...prevState,
                        listening: true,
                        listener: setInterval(() => {
                            axios.get("http://127.0.0.1:7860/sdapi/v1/progress").then(res => {
                                setLocalState(prevState => ({
                                    ...prevState,
                                    previewImage: res.data.current_image
                                }));
                            });
                        }, 500)
                    }))
                }} children={
                    <PlayArrowRounded/>
                }/>
            )
        }/>
    );
}
