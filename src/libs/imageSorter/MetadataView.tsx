import React, {useContext, useEffect, useRef, useState} from "react";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {Project} from "./Project";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import styled from "styled-components";
import {TransitionGroup} from "react-transition-group";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {IconButton} from "./IconButton";
import {ChevronRightRounded, InfoRounded, OpenInFull} from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import {MetaBasicEntry} from "./MetaBasicEntry";
import userEvent from "@testing-library/user-event";
import {Image} from "../base/components/base/Image";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {getMetadata} from "meta-png";
import {ImageMetaData} from "./ImageMetaData";

export const StyledMetadataView = styled.section`
  width: 100%;
  // height: available;
  height: fit-content;
  
  // overflow: scroll;
  display: grid;
  grid-template-rows: auto min-content;
  
  .view-opener {
    transition: all ease-in-out .1s;
    rotate: -90deg;
    
    &[data-opened=true] {
      rotate: 90deg;
    }
  }
`;

export type MetadataViewState = {
    expanded: boolean
}

export const MetadataView: React.FC = props => {
    const api = useContext(ImageSorterAPIContext);
    const state = useContext(ImageSorterAPIStateContext);
    const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
    useEffect(() => {
        api.getCurrentProject().then(cp => setCurrentProject(cp));
    }, [api, state]);

    const currentImage = useLiveQuery(async () => {
        return isaDB.images
            .where("id")
            .equals(state.selectedImageId ?? "_placeholder")
            .first();
    }, [state.selectedImageId]);

    const [currentImageMeta, setCurrentImageMeta] = useState<ImageMetaData | undefined>(undefined);

    const data = useRef<{
        rawMetaString?: string
    }>({})

    useEffect(() => {
        if (currentImage === undefined) {
            data.current.rawMetaString = undefined;
            setCurrentImageMeta(undefined);
            return;
        }

        currentImage?.data.arrayBuffer().then(r => {
            const meta = getMetadata(new Uint8Array(r), "parameters")!;
            data.current.rawMetaString = meta;
            let [prompt, rest] = meta.split("Negative prompt:").map(s => s.trim());
            let promptShards = prompt.split(",").map(s => s.trim());
            let [negPrompt, negRest] = rest.split("Steps:").map(s => s.trim());
            let negPromptShards = negPrompt.split(",").map(s => s.trim());
            const mrBase = negRest.split(",").map(s => s.trim()).map(s => s.split(": "));
            mrBase[0] = ["Steps", mrBase[0][0]]
            let metaRest = new Map(mrBase as [string, string][]);
            setCurrentImageMeta({
                meta: metaRest,
                negativePromptShards: negPromptShards,
                negativePrompt: negPrompt,
                promptShards: promptShards,
                prompt: prompt
            });
        })
    }, [currentImage]);

    const [viewState, setViewState] = useState<MetadataViewState>({
        expanded: false
    });

    if (currentProject === undefined) {
        return (
            <div style={{
                display: "inline-flex",
                width: "100%",
                justifyContent: "center"
            }}>
                <DescriptiveTypography text={"Select project to view metadata"}/>
            </div>
        );
    }

    return (
        <StyledMetadataView>
            {/* META DATA CONTENT */}
            <TransitionGroup>
                { !viewState.expanded ? undefined : (
                    <Collapse key={"metadata-view-tray"}>
                        <div style={{
                            display: "flex",
                            height: "min-content",
                            maxHeight: "400px",
                            overflow: "scroll",
                            flexDirection: "column",
                            marginBottom: "1rem"
                        }}>
                            <div style={{
                                display: "flex",
                                height: "min-content",
                                gap: "8px",
                                flexDirection: "column",
                            }}>
                                <MainTypography text={"Prompt"}/>
                                {/*
                                <div children={currentImageMeta?.promptShards.map(pS => <Tag tag={pS}/>)} style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "4px",
                                    flexWrap: "wrap"
                                }}/>
                                */}
                                <DescriptiveTypography text={currentImageMeta?.prompt ?? "No prompt available"}/>

                                <MainTypography text={"Negative prompt"}/>
                                {/*
                                <div children={currentImageMeta?.negativePromptShards.map(pS => <Tag tag={pS}/>)} style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "4px",
                                    flexWrap: "wrap"
                                }}/>
                                */}
                                <DescriptiveTypography text={currentImageMeta?.negativePrompt ?? "No negative prompt available"}/>

                                <div style={{
                                    display: "grid",
                                    gap: "8px"
                                }}>
                                    {
                                        Array.from(currentImageMeta?.meta?.entries() ?? []).map(e => ({ k: e[0], v: e[1] })).map(kv => (
                                            <MetaBasicEntry key={kv.k} title={kv.k} value={kv.v}/>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </Collapse>
                ) }
            </TransitionGroup>


            {/* CONTROLS */}
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%"
            }}>
                <MainTypography text={"Metadata"}/>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "4px"
                }}>
                    <IconButton onClick={() => {
                        setViewState(prevState => ({
                            expanded: !prevState.expanded
                        }));
                    }} size={"small"} children={
                        <ChevronRightRounded
                            data-opened={viewState.expanded}
                            className={"view-opener"}
                        />
                    }/>
                    <IconButton onClick={() => {
                        currentImage?.data.arrayBuffer().then(r => {
                            const meta = getMetadata(new Uint8Array(r), "parameters")!;
                            alert(meta);
                        });

                    }} size={"small"} children={
                        <InfoRounded/>
                    }/>
                </div>
            </div>
        </StyledMetadataView>
    );
}
