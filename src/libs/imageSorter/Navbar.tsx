import React from "react";
import {IconButton} from "./IconButton";
import {HubRounded, ImageRounded} from "@mui/icons-material";

export const Navbar: React.FC = props => {

    return (
        <div style={{
            display: "flex",
            width: "100%",
            justifyContent: "end",
            alignItems: "center",
            gap: "8px"
        }}>
            <IconButton children={<ImageRounded/>} tooltip={"Gallery"}/>
            <IconButton children={<HubRounded/>} tooltip={"Stable-Diffusion suite"}/>
        </div>
    );
}