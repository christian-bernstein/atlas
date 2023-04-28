import React, {useContext, useEffect, useRef, useState} from "react";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {Project} from "./Project";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import styled from "styled-components";
import {TransitionGroup} from "react-transition-group";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {IconButton} from "./IconButton";
import {ChevronRightRounded, InfoRounded, OpenInFull, PlayArrowRounded} from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import {MetaBasicEntry} from "./MetaBasicEntry";
import userEvent from "@testing-library/user-event";
import {Image} from "../base/components/base/Image";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {getMetadata} from "meta-png";
import {ImageMetaData} from "./ImageMetaData";
import axios from "axios";
import {ControlModalCompound, ModalCompoundContext, ModalPolicy} from "./ControlModalCompound";
import {SDRequestDialog} from "./sdInterface/SDRequestDialog";
import {DuplexEventRelay} from "./DuplexEventRelay";
import {Menu} from "./Menu";
import {MenuButton} from "./MenuButton";

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
                                <DescriptiveTypography text={currentImageMeta?.prompt ?? "No prompt available"}/>
                                <MainTypography text={"Negative prompt"}/>
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
                    <Menu menuProps={{ direction: "top" }}>
                        <ControlModalCompound controller={ctx => (
                            <MenuButton disabled={currentImageMeta === undefined} icon={<PlayArrowRounded style={{ color: "mediumseagreen" }}/>} text={"Recreate"} onSelect={async () => {
                                const conf = {
                                    prompt: currentImageMeta?.prompt ?? "",
                                    negative_prompt: currentImageMeta?.negativePrompt ?? "",
                                    seed: currentImageMeta?.meta.get("Seed") ?? -1,
                                    steps: currentImageMeta?.meta.get("Steps") ?? 50,
                                    sampler_index: currentImageMeta?.meta.get("Sampler") ?? "Euler",
                                    cfg_scale: currentImageMeta?.meta.get("CFG scale") ?? 7,
                                    width: currentImageMeta?.meta?.get("Size")?.split("x")[0] ?? 512,
                                    height: currentImageMeta?.meta?.get("Size")?.split("x")[1] ?? 512,
                                    denoising_strength: currentImageMeta?.meta.get("Denoising strength") ?? 0,
                                    enable_hr: currentImageMeta?.meta.get("Hires upscaler") !== undefined,
                                    hr_scale: currentImageMeta?.meta.get("Hires upscale") ?? 1.5,
                                    hr_upscaler: currentImageMeta?.meta.get("Hires upscaler") ?? "R-ESRGAN 4x+ Anime6B",
                                    hr_second_pass_steps: currentImageMeta?.meta.get("Hires steps") ?? 0,
                                };

                                axios.post("http://127.0.0.1:7860/sdapi/v1/txt2img", conf).then(res => {
                                    ctx.open("img-res", res.data.images);
                                });
                            }}/>
                        )} modals={new Map<string, (ctx: ModalCompoundContext, param: any) => (React.ReactNode | [React.ReactNode, ModalPolicy])>([
                            ["img-res", (ctx, param) => (
                                <img
                                    alt={"stable diffusion result"}
                                    src={`data:image/png;base64,${param}`}
                                />
                            )]
                        ])}/>
                        <MenuButton disabled={currentImageMeta === undefined} text={"Get raw metadata"} onSelect={() => {
                            currentImage?.data.arrayBuffer().then(r => {
                                const meta = getMetadata(new Uint8Array(r), "parameters")!;
                                alert(meta);
                            });
                        }}/>
                    </Menu>





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
                </div>
            </div>
        </StyledMetadataView>
    );
}
