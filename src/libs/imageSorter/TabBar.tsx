import React from "react";
import {TabConfig} from "./TabConfig";
import {TabHeader} from "./TabHeader";

export type TabBarProps = {
    activeBar: string,
    onTabChange: (tab: string) => void
    tabs: Array<TabConfig>
}

export const TabBar: React.FC<TabBarProps> = props => {

    return (
        <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px"
        }} children={props.tabs.map(cfg => {
            return (
                <TabHeader
                    key={cfg.id}
                    config={cfg}
                    active={cfg.id === props.activeBar}
                    onSelect={() => props.onTabChange(cfg.id)}
                />
            );
        })}/>
    );
}
