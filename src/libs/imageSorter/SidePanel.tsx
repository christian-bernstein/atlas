import React, {useContext} from "react";
import {IconButton} from "./IconButton";
import {
    AlignHorizontalLeftRounded,
    AlignHorizontalRightRounded, FolderRounded, ImageRounded, ImageSearch, ImagesearchRollerRounded, ImageSearchRounded,
    LooksOneRounded, LooksTwoRounded
} from "@mui/icons-material";
import {Workspace} from "./Workspace";
import {LayoutTabButton} from "./LayoutTabButton";

export type SidePanelsProps = {
    start?: React.ReactNode,
    end?: React.ReactNode
}

export const SidePanel: React.FC<SidePanelsProps> = props => {
    return (
        <Workspace config={{
            name: "side-panel",
            mode: "desktop"
        }} children={
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                height: "100%",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <div children={props.start} style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "center",
                }}/>

                <div children={props.end} style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "center",
                }}/>

            </div>
        }/>
    );
}
