import React from "react";
import {TabConfig} from "./TabConfig";
import {DefaultButton} from "./DefaultButton";
import {MainTypography} from "../triton/components/typography/MainTypography";

export type TabHeaderProps = {
    config: TabConfig,
    active: boolean,
    deactivated?: boolean,
    onSelect: () => void
}
export const TabHeader: React.FC<TabHeaderProps> = props => {
    return (
        <DefaultButton size={"small"} deactivated={props.deactivated ?? false} onClick={() => props.onSelect()} variant={props.active ? "primary" : "default"}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px"
            }}>
                { props.config.icon }
                <MainTypography text={props.config.title}/>
            </div>
        </DefaultButton>
    );
}
