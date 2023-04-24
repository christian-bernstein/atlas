import React, {useContext, useEffect, useRef, useState} from "react";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {MetaBasicEntry} from "./MetaBasicEntry";
import {IconButton} from "./IconButton";
import {
    ChevronRightRounded, DeleteRounded, EditRounded,
    FileOpenRounded,
    InfoRounded,
    MoreHorizOutlined,
    SelectAllRounded
} from "@mui/icons-material";
import {getMetadata} from "meta-png";
import {MetadataViewState, StyledMetadataView} from "./MetadataView";
import {StyleData} from "./StyleData";
import {ISAImage} from "./ISAImage";
import {Menu} from "./Menu";
import {MenuButton} from "./MenuButton";
import {MenuDivider} from "@szhsin/react-menu";
import {ImageSorterAPI, ImageSorterAPIContext} from "./ImageSorterAPI";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {ImageMetaData} from "./ImageMetaData";

export const StyleDataDisplay: React.FC = props => {

    const api = useContext(ImageSorterAPIContext);

    const style = useLiveQuery(() => {
        return isaDB.styles.get(api.state.selectedStyleId ?? "");
    }, [api.state.selectedStyleId]);


    const [viewState, setViewState] = useState<MetadataViewState>({
        expanded: false
    });

    const [currentImageMeta, setCurrentImageMeta] = useState<ImageMetaData | undefined>(undefined);
    const data = useRef<{ rawMetaString?: string }>({});
    useEffect(() => {
        if (style?.meta === undefined) {
            data.current.rawMetaString = undefined;
            setCurrentImageMeta(undefined);
            return;
        }

        const meta = style?.meta!;
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
    }, [style]);

    return (
        <StyledMetadataView>
            {/* META DATA CONTENT */}
            <TransitionGroup>
                { !viewState.expanded ? undefined : (
                    <Collapse key={"metadata-view-tray"}>
                        <div style={{
                            maxHeight: "400px",
                            width: "100%",
                            overflow: "scroll",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: "8px",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "8px"
                        }}>
                            { style && (
                                <>
                                    <span style={{ height: "300px", width: "100%" }} children={
                                        <ISAImage noImageComponent={<></>} onClick={() => api.selectImageByID(style.previewID!, false)} imageID={style.previewID ?? ""} style={{
                                            height: "300px",
                                            cursor: "pointer",
                                            objectFit: "cover",
                                            objectPosition: "top",
                                            width: "100%"
                                        }}/>
                                    }/>

                                    <div style={{
                                        width: "100%",
                                        // overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "100%",
                                            justifyContent: "space-between"
                                        }}>
                                            <MainTypography text={style.title}/>

                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                flexDirection: "row"
                                            }}>
                                                { /* TODO: Add something here... */ }
                                            </div>
                                        </div>


                                        { style.description && (
                                            <DescriptiveTypography text={style.description}/>
                                        ) }

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
                                </>
                            ) }
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
                { style ? (
                    <MainTypography text={style.title}/>
                ) : (
                    <DescriptiveTypography text={"select a style"}/>
                )}


                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "4px"
                }}>

                    { style && (
                        <Menu opener={<IconButton size={"small"} children={<MoreHorizOutlined/>}/>} menuProps={{ direction: "top" }}>
                            <MenuButton icon={<EditRounded/>} text={"Edit"} appendix={"Ctrl+E"}/>
                            <MenuButton icon={<DeleteRounded/>} text={"Delete style"} />
                            <MenuDivider/>
                            <MenuButton text={"Open preview image"}/>
                            <MenuButton disabled={style.previewID === undefined} text={"Remove preview image"} onSelect={() => {
                                isaDB.styles.update(style?.id, {
                                    previewID: undefined
                                });
                            }}/>
                            <MenuButton disabled={style.previewID !== undefined || api.state.selectedImageId === undefined} text={"Set opened image as preview"} onSelect={() => {
                                if (api.state.selectedImageId !== undefined) {
                                    isaDB.styles.update(style?.id, {
                                        previewID: api.state.selectedImageId
                                    });
                                }
                            }}/>
                        </Menu>
                    ) }



                    <IconButton deactivated={style === undefined} onClick={() => {
                        if (style !== undefined) {
                            setViewState(prevState => ({
                                expanded: !prevState.expanded
                            }));
                        }
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
