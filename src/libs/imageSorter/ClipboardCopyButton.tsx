import React from "react";
import {utilizeGlobalTheme} from "../base/logic/app/App";
import {getOr, Utils} from "../base/Utils";
import {If} from "../base/components/logic/If";
import {CustomTooltip} from "../base/components/base/CustomTooltip";
import {Text} from "../base/components/base/Text";
import {ObjectVisualMeaning} from "../base/logic/style/ObjectVisualMeaning";

export type ClipboardCopyButtonProps = {
    copyValueProducer: () => string
}

export const ClipboardCopyButton: React.FC<ClipboardCopyButtonProps> = props => {
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (copied) setCopied(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [copied]);

    return (
        <button onClick={() => {
            if (!copied) {
                Utils.copyTextToClipboard(props.copyValueProducer());
                setCopied(true);
            }
        }} style={{
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            appearance: "none",
            padding: 0,
            margin: 0,
            border: 0,
            outline: 0,
            cursor: "pointer",
            backgroundColor: "transparent",
            color: "white"
        }} children={
            <div style={{position: "relative", height: 16, width: 16}}>
                <Clippy style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    strokeDasharray: 50,
                    strokeDashoffset: copied ? -50 : 0,
                    transition: "all 300ms ease-in-out"
                }}/>
                <Check isVisible={copied} style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    strokeDasharray: 50,
                    strokeDashoffset: copied ? 0 : -50,
                    transition: "all 300ms ease-in-out"
                }}/>
            </div>
        }/>
    );
}

export const Clippy: React.FC<any> = props => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5.75 4.75H10.25V1.75H5.75V4.75Z"/>
            <path
                d="M3.25 2.88379C2.9511 3.05669 2.75 3.37987 2.75 3.75001V13.25C2.75 13.8023 3.19772 14.25 3.75 14.25H12.25C12.8023 14.25 13.25 13.8023 13.25 13.25V3.75001C13.25 3.37987 13.0489 3.05669 12.75 2.88379"/>
        </svg>
    );
}

export const Check: React.FC<any> = props => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M13.25 4.75L6 12L2.75 8.75"/>
        </svg>
    );
}