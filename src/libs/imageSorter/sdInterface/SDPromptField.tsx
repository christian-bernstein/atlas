import React from "react";
import Editor from "@monaco-editor/react";
import {DimensionalMeasured} from "../../base/logic/style/DimensionalMeasured";
import {Color} from "../../base/logic/style/Color";

export type SDPromptFieldProps = {
    onChange?: (value: string | undefined, ev: any) => void,
    value?: string,
    h?: string | DimensionalMeasured,
    readonly?: boolean,
    backgroundColor?: Color,
    // onSubmit?: (value: string) => void
}

export const SDPromptField: React.FC<SDPromptFieldProps> = props => {
    const bg = props.backgroundColor?.toHex() ?? "#101016";

    return (
        <div style={{
            width: "100%",
            height: props.h === undefined ? "100%" : (typeof props.h === "string" ? props.h : props.h.css()),
            backgroundColor: bg,
            paddingTop: "1rem",
            paddingBottom: "1rem",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }} children={
            <Editor
                className={"searchbar-input"}
                // height={"150px"}
                // height={"calc(100% - 0px)"}
                width={"100%"}
                saveViewState
                value={props.value ?? ""}
                options={{
                    readOnly: props.readonly ?? false,
                    fontSize: 14,
                    fontLigatures: true,
                    lineNumbers: "off",
                    autoIndent: "full",
                    codeLens: false,
                    autoClosingBrackets: "always",
                    autoClosingQuotes: "always",
                    hideCursorInOverviewRuler: true,
                    lineDecorationsWidth: 0,
                    renderValidationDecorations: "off",
                    overviewRulerBorder: false,
                    renderLineHighlight: "none",
                    cursorStyle: "underline",
                    matchBrackets: "always",
                    scrollbar: {
                        vertical: "hidden",
                        horizontal: "hidden"
                    },
                    minimap: {
                        enabled: false
                    },
                }}
                onChange={(value, ev) => {
                    props.onChange?.(value, ev);
                }}
                // onMount={(editor, monaco) => {
                //     editor.addCommand(monaco.KeyCode.F8, args => {
                //         console.log("[monaco] F8", props, props.onSubmit)
                //         props.onSubmit?.(editor.getValue());
                //     });
                // }}
                beforeMount={monaco => {
                    monaco.languages.register({ id: "sd-prompt" });

                    monaco.languages.setMonarchTokensProvider("sd-prompt", {
                        tokenizer: {
                            root: [
                                [/<lora:.+>/, "full-keyword"],
                                [/\([\w,\s@]+:(\d|(\d.\d))\)/, "full-keyword"],
                                [/!/, "symbol"],
                                [/:[\w<>=]+/, "keyword"],
                                [/#[\s\w]+/, "comment"],
                                [/\/\*.*\*\//, "comment"],
                                [/-\w+/, "param"],
                                [/\$\w+/, "variable"],
                                [/@\w+/, "annotation"],
                                [/->/, "arrow-right"],
                                [/=>/, "arrow-right"],
                                [/-/, "bullet-point"],
                                [/:/, "double-point"],
                                [/,/, "symbol"],
                                [/;/, "symbol"],
                                [/(\d*\.?\d+|\d{1,3}(,\d{3})*(\.\d+)?)/, "number"],
                                [/\w+/, "string"],
                                [/'.*'/, "string"],
                                // units
                                [/mb/, "unit"],
                                [/gb/, "unit"]
                            ]
                        }
                    });

                    monaco.editor.defineTheme("ses-x-dark-tritanopia-notes", {
                        base: "vs-dark",
                        inherit: true,
                        rules: [
                            { token: "arrow-right", foreground: "#A782BB" },
                            { token: "unit", foreground: "#A782BB" },
                            { token: "bullet-point", foreground: "#585858" },
                            { token: "double-point", foreground: "#585858" },
                            { token: "comment", foreground: "#585858" },
                            { token: "param", foreground: "#585858" },
                            { token: "full-keyword", foreground: "#CA7732" },
                            { token: "symbol", foreground: "#CA7732" },
                            { token: "keyword", foreground: "#CA7732" },
                            { token: "semicolon", foreground: "#CA7732" },
                            { token: "method", foreground: "#FFC66D" },
                            { token: "tag", foreground: "#FFC66D" },
                            { token: "macro", foreground: "#FFC66D" },
                            { token: "variable", foreground: "#FFC66D" },
                            { token: "annotation", foreground: "#FFC66D" },
                            { token: "number", foreground: "#A782BB" },
                            { token: "string", foreground: "#FFC66D" },
                        ],
                        colors: {
                            "editor.background": bg,
                            "editor.lineHighlightBackground":  bg,
                        }
                    });
                }}
                theme={"ses-x-dark-tritanopia-notes"}
                language={"sd-prompt"}
            />
        }/>
    );
}
