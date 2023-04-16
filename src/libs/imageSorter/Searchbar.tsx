import React, {useState} from "react";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import Editor from "@monaco-editor/react";
import styled from "styled-components";

export type SearchbarState = {
    focused: boolean
}

const StyledSearchbar = styled.div`
  width: 100%;
  position: relative;
  
  .searchbar-input {
  }
`;

export const Searchbar: React.FC = props => {

    const [state, setState] = useState<SearchbarState>({
        focused: false
    });

    return (
        <StyledSearchbar>
            <div style={{
                width: "100%",
                height: "60px",
                backgroundColor: "#101016",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }} onClick={event => {
                setState(prevState => ({ ...prevState, focused: !prevState.focused }));
            }} children={
                <Editor
                    className={"searchbar-input"}
                    height={"22px"}
                    width={"100%"}
                    saveViewState
                    options={{
                        fontSize: 16,
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
                    beforeMount={monaco => {
                        monaco.languages.register({ id: "notes-lang" })

                        monaco.languages.setMonarchTokensProvider("notes-lang", {
                            tokenizer: {
                                root: [
                                    [/:\w+/, "keyword"],
                                    [/#\w+/, "tag"],
                                    [/-\w+/, "param"],
                                    [/->/, "arrow-right"],
                                    [/=>/, "arrow-right"],
                                    [/-/, "bullet-point"],
                                    [/:/, "double-point"],
                                    [/;/, "semicolon"],
                                    [/".*"/, "string"],
                                    [/'.*'/, "string"],




                                    [/'.*'/, "string"],
                                ]
                            }
                        })

                        monaco.editor.defineTheme("ses-x-dark-tritanopia-notes", {
                            base: "vs-dark",
                            inherit: true,
                            rules: [
                                // { token: "", background: "#FFFFFF" },
                                { token: "arrow-right", foreground: "#A782BB" },
                                { token: "bullet-point", foreground: "#585858" },
                                { token: "double-point", foreground: "#585858" },
                                { token: "param", foreground: "#585858" },
                                { token: "keyword", foreground: "#CA7732" },
                                { token: "semicolon", foreground: "#CA7732" },
                                { token: "method", foreground: "#FFC66D" },
                                { token: "tag", foreground: "#FFC66D" },
                                { token: "number", foreground: "#5028c8" },
                                { token: "string", foreground: "#5028c8" },
                            ],
                            colors: {
                                "editor.background": "#101016",
                                "editor.lineHighlightBackground":  "#101016",
                            }
                        });
                    }}
                    theme={"ses-x-dark-tritanopia-notes"}
                    language={"notes-lang"}
                />
            }/>

            <TransitionGroup style={{
                position: "absolute",
                top: "calc(60px + 16px)",
                left: "0",
                width: "100%",
                zIndex: 10
            }} children={
                !state.focused ? undefined : (
                    <Collapse children={
                        <div style={{
                            width: "100%",
                            height: "300px",
                            borderRadius: "8px",
                            // backgroundColor: "#101016"
                            backgroundColor: "darkorange"
                        }}/>
                    }/>
                )
            }/>
        </StyledSearchbar>
    );
}
