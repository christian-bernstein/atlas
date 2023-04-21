import React, {useContext, useState} from "react";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {IconButton} from "./IconButton";
import {CloseRounded, DownloadRounded, FileOpenRounded, InfoRounded, PreviewRounded} from "@mui/icons-material";
import {ButtonGroup} from "./ButtonGroup";
import {ImageViewFooter} from "./ImageViewFooter";
import {ButtonModalCompound} from "./ButtonModalCompound";
import {DefaultButton} from "./DefaultButton";

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

                <ButtonModalCompound
                    button={<IconButton children={<FileOpenRounded/>}/>}
                    preventClosingOnBackdropClick
                    preventClosingMasterSwitch
                    modalContent={(ctx) => (
                        <DefaultButton onClick={() => ctx.close()}/>
                    )}
                />

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
