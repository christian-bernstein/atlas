import React, {useContext, useState} from "react";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import Editor from "@monaco-editor/react";
import styled from "styled-components";
import {SearchLogic} from "./SearchLogic";
import {isaDB} from "./ImageSorterAppDB";
import {Image} from "./Image";
import {ISADBImageGrid} from "./ISADBImageGrid";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {IconButton} from "./IconButton";
import {CloseRounded, MoreVertRounded, SelectAllRounded} from "@mui/icons-material";
import {Screen} from "../base/components/base/Page";
import {ImageView} from "./ImageView";
import {ImagePreview} from "./ImagePreview";
import {ImageSorterAPIContext} from "./ImageSorterAPI";

export type SearchbarState = {
    intellisenseTrayOpened: boolean,
    focused: boolean,
    filteredImages?: Image[]
}

const StyledSearchbar = styled.div`
  width: 100%;
  position: relative;
  
  .searchbar-input {}
`;

export const Searchbar: React.FC = props => {
    const api = useContext(ImageSorterAPIContext);
    const [state, setState] = useState<SearchbarState>({
        intellisenseTrayOpened: false,
        focused: false
    });

    return (
        <StyledSearchbar onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
                setState(prevState => ({ ...prevState, focused: false }));
            }
        }}>
            <div style={{
                width: "100%",
                height: "60px",
                backgroundColor: "#101016",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }} onClick={event => {
                // setState(prevState => ({ ...prevState, focused: !prevState.focused }));
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
                    onChange={(value, ev) => {

                    }}
                    onMount={(editor, monaco) => {
                        editor.onKeyDown(e => {
                            if (e.code === "Enter") e.preventDefault();
                        });

                        editor.onKeyDown(async e => {
                            if (e.code === "Enter") {
                                const filtered = await new SearchLogic().parseImageQuery(editor.getValue(), api)(await isaDB.images.toArray());
                                setState(prevState => ({
                                    ...prevState,
                                    filteredImages: filtered,
                                    focused: filtered.length > 0
                                }));
                                editor.focus();
                            }
                        }, this)
                    }}
                    beforeMount={monaco => {
                        monaco.languages.register({ id: "notes-lang" });

                        monaco.languages.setMonarchTokensProvider("notes-lang", {
                            tokenizer: {
                                root: [
                                    [/:limit/, "macro"],
                                    [/!/, "symbol"],
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
                                ]
                            }
                        });

                        monaco.editor.defineTheme("ses-x-dark-tritanopia-notes", {
                            base: "vs-dark",
                            inherit: true,
                            rules: [
                                { token: "arrow-right", foreground: "#A782BB" },
                                { token: "bullet-point", foreground: "#585858" },
                                { token: "double-point", foreground: "#585858" },
                                { token: "param", foreground: "#585858" },
                                { token: "symbol", foreground: "#CA7732" },
                                { token: "keyword", foreground: "#CA7732" },
                                { token: "semicolon", foreground: "#CA7732" },
                                { token: "method", foreground: "#FFC66D" },
                                { token: "tag", foreground: "#FFC66D" },
                                { token: "macro", foreground: "#FFC66D" },
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
                top: "calc(60px + 16px - 16px - 8px)",
                // boxShadow: "0 0 50px black",
                left: "0",
                width: "100%",
                zIndex: 10
            }} children={
                !state.focused ? undefined : (
                    <Collapse children={
                        <div style={{
                            width: "100%",
                            // height: "300px",
                            borderRadius: "8px",
                            backgroundColor: "#101016",
                            // border: "1px solid #313131",
                            padding: "1rem"
                        }} children={
                            state.filteredImages === undefined ? (
                                <DescriptiveTypography text={"No filtered images"}/>
                            ) : (
                                <div style={{  }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        width: "100%",
                                        justifyContent: "space-between"
                                    }}>
                                        <MainTypography text={"Search results"}/>

                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: "4px"
                                        }}>
                                            <IconButton size={"small"} tooltip={"Select all"} onClick={() => {
                                                api.selectionManager.select(state.filteredImages?.map(i => i.id) ?? [])
                                            }} children={
                                                <SelectAllRounded/>
                                            }/>
                                            <IconButton size={"small"} children={
                                                <MoreVertRounded/>
                                            }/>
                                            <IconButton size={"small"} onClick={() => {
                                                setState(prevState => ({
                                                    ...prevState,
                                                    intellisenseTrayOpened: false,
                                                    focused: false,
                                                    filteredImages: []
                                                }))
                                            }} children={
                                                <CloseRounded/>
                                            }/>
                                        </div>
                                    </div>
                                    <ISADBImageGrid imageIDs={state.filteredImages.map(i => i.id)} imageRenderer={data => (
                                        <ImagePreview
                                            for={data}
                                            onClick={(event) => {
                                                if (event.ctrlKey) {
                                                    api.selectionManager.toggleSelection(data.id);
                                                    return;
                                                }
                                                api.selectImageByID(data.id);
                                            }}
                                            onRequestDelete={() => api.removeImageFromCurrentProject(data.id)}
                                        />
                                    )}/>
                                </div>
                            )
                        }/>
                    }/>
                )
            }/>
        </StyledSearchbar>
    );
}
