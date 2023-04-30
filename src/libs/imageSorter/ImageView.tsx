import React, {useContext, useEffect, useRef, useState} from "react";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {IconButton} from "./IconButton";
import {
    CloseRounded,
    DownloadRounded,
    FileOpenRounded,
    InfoRounded, LineStyleRounded,
    PreviewRounded,
    SelectAllRounded, StyleRounded, UploadRounded
} from "@mui/icons-material";
import {ButtonGroup} from "./ButtonGroup";
import {ImageViewFooter} from "./ImageViewFooter";
import {ButtonModalCompound} from "./ButtonModalCompound";
import {DefaultButton} from "./DefaultButton";
import {StyledModal} from "./StyledModal";
import {TagEditor} from "./TagEditor";
import {Formik} from "formik";
import {TagListConfigurator} from "./TagListConfigurator";
import {ControlModalCompound} from "./ControlModalCompound";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {v4} from "uuid";
import {ImageMetaData} from "./ImageMetaData";
import {getMetadata} from "meta-png";
import {ImageSourceSelectionDialog} from "./ImageSourceSelectionDialog";

export const ImageView: React.FC = props => {
    const state = useContext(ImageSorterAPIStateContext);
    const api = useContext(ImageSorterAPIContext);
    const image = useLiveQuery(async () => {
        return isaDB.images
            .where("id")
            .equals(state.selectedImageId ?? "_placeholder")
            .first();
    }, [state.selectedImageId]);

    const [localState, setLocalState] = useState<{
        openImageDetailFooter: boolean
    }>({
        openImageDetailFooter: true
    });

    const [currentImageMeta, setCurrentImageMeta] = useState<ImageMetaData | undefined>(undefined);
    const data = useRef<{ rawMetaString?: string }>({});
    useEffect(() => {
        if (image === undefined) {
            data.current.rawMetaString = undefined;
            setCurrentImageMeta(undefined);
            return;
        }
        // TODO: Remove the parsing!
        image?.data.arrayBuffer().then(r => {
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
    }, [image]);

    if (image === undefined) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: ".5rem",
                padding: "1rem",
                backgroundColor: "#101016",
                flexDirection: "column"
            }}>
                <DescriptiveTypography text={"Select an image"}/>
                {/*
                <iframe
                    title={"SD"}
                    width={"100%"}
                    height={"100%"}
                    src={"http://localhost:7860/"}
                    style={{
                        border: "none",
                        scrollbarWidth: "none"
                    }}
                />
                */}

                <ButtonModalCompound
                    button={<IconButton children={
                        <UploadRounded/>
                    }/>}
                    modalContent={ctx => (
                        <ImageSourceSelectionDialog/>
                    )}
                />

            </div>
        );
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: ".5rem",
            padding: "1rem",
            backgroundColor: "#101016",
            flexDirection: "column",
            gap: ".5rem",
            height: "100%"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: ".5rem"
            }}>
                <ButtonModalCompound button={
                    <IconButton tooltip={"Create style"} children={<StyleRounded/>}/>
                } modalContent={ctx => (
                    <StyledModal title={"Create style"} onClose={() => ctx.close()} children={
                        <>asd</>
                    } footer={
                        <div style={{ display: "grid", width: "100%" }} children={
                            <ButtonBase text={"Create"} baseProps={{
                                onClick: () => {
                                    isaDB.styles.add({
                                        id: v4(),
                                        title: "new style",
                                        description: "lul",
                                        previewID: image?.id,
                                        additionalPreviewIDs: [],
                                        meta: data.current.rawMetaString
                                    });

                                    ctx.close();
                                }
                            }}/>
                        }/>
                    }/>
                )}/>

                <IconButton variant={api.selectionManager.isSelected(image?.id) ? "primary" : "default"} tooltip={"Select"} children={<SelectAllRounded/>} onClick={() => {
                    api.selectionManager.toggleSelection(image?.id);
                }}/>

                {/* TODO Deactivate if prev of current project */}
                <IconButton tooltip={"Set as cover"} children={<PreviewRounded/>} onClick={() => {
                    api.getProjectContext().setPreviewImage(image?.id);
                }}/>

                <IconButton tooltip={"Info"} children={<InfoRounded/>} variant={localState.openImageDetailFooter ? "primary" : "default"} onClick={() => {
                    setLocalState(prevState => ({
                        ...prevState,
                        openImageDetailFooter: !prevState.openImageDetailFooter
                    }));
                }}/>

                <ButtonGroup>
                    <IconButton children={<DownloadRounded/>} onClick={() => {
                        api.downloadManager.downloadImage(image?.id).then(() => {});
                    }}/>
                    <IconButton children={<CloseRounded/>} onClick={() => {
                        api.unselectImage();
                    }}/>
                </ButtonGroup>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                position: "relative"
            }}>
                <img alt={"img"} id={"image-view-main-image"} src={URL.createObjectURL(image.data)} style={{
                    position: "absolute",
                    objectFit: "contain",
                    objectPosition: "center",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    height: "auto",
                    borderRadius: ".5rem"
                }}/>
            </div>

            <ImageViewFooter open={localState.openImageDetailFooter} image={image}/>
        </div>
    );
}
