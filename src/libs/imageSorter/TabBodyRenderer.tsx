import React from "react";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";

export type TabBodyRendererProps = {
    active: string,
    tabs: Map<string, () => React.ReactElement>,
    noTab?: React.ReactElement
}

export const TabBodyRenderer: React.FC<TabBodyRendererProps> = props => {
    const renderer = props.tabs.get(props.active);

    if (renderer === undefined) {
        return props.noTab ?? (
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }} children={
                <DescriptiveTypography text={`No renderer for tab id='${props.active}'`}/>
            }/>
        );
    }

    try {
        return renderer();
    } catch (e) {
        console.error(e);
        return (
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }} children={
                <DescriptiveTypography text={`Error while rendering tab id='${props.active}' error='${e}`}/>
            }/>
        );
    }
}