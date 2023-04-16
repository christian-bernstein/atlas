import React, {useRef} from "react";
import {v4} from "uuid";
import {Tooltip} from "react-tooltip";
import {HelpRounded} from "@mui/icons-material";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";

export type HelpHintProps = {
    text?: string
}

// TODO: Add fade-feature
export const HelpHint: React.FC<HelpHintProps> = props => {
    const internalID = useRef(v4());
    if (props.text === undefined || props.text.trim().length === 0) return <></>;
    return (
        <>
            <HelpRounded data-tooltip-id={internalID.current} style={{
                cursor: "help",
                width: "16px",
                height: "16px",
                color: "rgb(139, 148, 158)"
            }}/>
            <Tooltip className={"tooltip"} style={{
                fontSize: "12px",
                fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Noto Sans,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
                lineHeight: 1.5,
                backgroundColor: "#1a1a20"
            }} id={internalID.current}>
                <DescriptiveTypography text={props.text}/>
            </Tooltip>
        </>
    );
}
