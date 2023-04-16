import React from "react";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {IconButton} from "./IconButton";
import {ContentCopyRounded} from "@mui/icons-material";
import {CopyIcon} from "../base/components/base/CopyIcon";
import {ClipboardCopyButton} from "./ClipboardCopyButton";

export type MetaBasicEntryProps = {
    title: string,
    displayValue?: string,
    value: string
}

export const MetaBasicEntry: React.FC<MetaBasicEntryProps> = props => {

    return (
        <div style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%"
        }}>
            <div style={{
                display: "flex",
                gap: "2px",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <DescriptiveTypography text={`${props.title}:`} style={{
                    fontWeight: "bold"
                }}/>
                <DescriptiveTypography text={props.displayValue ?? props.value}/>
            </div>

            <ClipboardCopyButton copyValueProducer={() => props.value}/>
        </div>
    );
}
