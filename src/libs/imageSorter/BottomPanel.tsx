import React from "react";
import {Workspace} from "./Workspace";
import {DnsRounded} from "@mui/icons-material";
import {IconButton} from "./IconButton";
import {Menu} from "./Menu";
import {MenuButton} from "./MenuButton";

export const BottomPanel: React.FC = props => {

    return (
        <Workspace config={{
            name: "bottom-panel",
            mode: "desktop"
        }} children={
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <div children={<>start</>} style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "center",
                }}/>

                <div children={<>mid</>} style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "center",
                }}/>

                <div children={
                    <Menu menuProps={{ direction: "top" }} opener={<IconButton size={"small"} children={<DnsRounded/>}/>}>
                        <MenuButton text={"Internal"}/>
                        <MenuButton text={"ABC"}/>
                        <MenuButton text={"ABC"}/>
                        <MenuButton text={"ABC"}/>
                    </Menu>
                } style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "center",
                }}/>

            </div>
        }/>
    );
}
