import React, {useState} from "react";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";

export type InlineEditTextProps = {
    initialText?: string,
    onSave?: (s: string) => void
}

export const InlineEditableDescriptiveTextArea: React.FC<InlineEditTextProps> = props => {
    const [state, setState] = useState<{
        editMode: boolean
    }>({
        editMode: false
    });

    const closeEditMode = () => setState(prevState => ({ ...prevState, editMode: false }));

    return state.editMode ? (
        <textarea style={{
            border: "none",
            // margin: "2px",
            // border: "2px #5028c8",
            // backgroundColor: "#5028c830",
            // borderRadius: "8px",
            padding: 0,
            color: "rgb(139,148,158)",
            lineHeight: 1.5,
            fontSize: 12,
            height: 18,
            fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
            outline: "none",
            // outline: "1px #5028c8",
            backgroundColor: "transparent",
            resize: "vertical"
        }} defaultValue={props.initialText} autoFocus onBlur={() => {
            closeEditMode();
        }} onKeyDown={e => {
            if (e.key === "Escape") {
                closeEditMode();
            }

            if (e.ctrlKey && e.key === "Enter") {
                closeEditMode();
                props.onSave?.(e.currentTarget.value);
            }
        }}/>
    ) : (
        <DescriptiveTypography text={props.initialText} baseProps={{
            onClick: (e) => {
                if (!e.ctrlKey) return;
                setState(prevState => ({ ...prevState, editMode: true }));
            }
        }}/>
    );
}
