import React, {useEffect, useState} from "react";
import {Image} from "./Image";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {Utils} from "../base/Utils";
import {Tag} from "./Tag";
import {StarRounded, TagRounded} from "@mui/icons-material";
import {TagEditor} from "./TagEditor";
import {isaDB} from "./ImageSorterAppDB";
import {IconButton} from "./IconButton";

export type ImageViewFooterProps = {
    open: boolean,
    image: Image | undefined
}

export const ImageViewFooter: React.FC<ImageViewFooterProps> = props => {
    const image = props.image;

    const [localState, setLocalState] = useState<{
        estFileSizeInBytes?: number,
        openTagEditor: boolean
    }>({
        openTagEditor: false
    });

    useEffect(() => {
        if (image === undefined) return;

        image.data.arrayBuffer().then(r => {
            // TODO: Add timing analysis
            // console.debug("Image meta", ExifReader.load(r))

            setLocalState(prevState => ({
                ...prevState,
                estFileSizeInBytes: r.byteLength
            }));
        })
    }, [image]);

    return (
        <TransitionGroup style={{ width: "100%" }} children={
            !props.open ? undefined : (
                <Collapse key={"image-view-footer-tray"} children={
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        width: "100%"
                    }}>
                        {/* LEFT SECTION :: TAGS */}
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "8px",
                            alignItems: "center",
                        }}>
                            <IconButton size={"small"} children={<StarRounded sx={{ transition: "color 50ms", color: image?.favourite ? "gold" : "inherit" }}/>} onClick={() => {
                                isaDB.images.update(image?.id!, {
                                    "favourite": !image?.favourite ?? true
                                });
                            }}/>
                            <IconButton size={"small"} tooltip={"Edit tags"} children={<TagRounded/>} onClick={() => {
                                setLocalState(prevState => ({
                                    ...prevState,
                                    openTagEditor: true
                                }));
                            }}/>

                            { image?.tags?.map(tag => (
                                <Tag key={tag} tag={tag}/>
                            )) }

                            { image?.tags === undefined || image.tags.length === 0 ? (
                                <DescriptiveTypography text={"No tags"}/>
                            ) : undefined}

                            <TagEditor initialTags={image?.tags ?? []} open={localState.openTagEditor} onClose={() => {
                                setLocalState(prevState => ({
                                    ...prevState,
                                    openTagEditor: false
                                }));
                            }} onSave={tags => {
                                isaDB.images.update(image?.id!, {
                                    "tags": tags
                                });
                                setLocalState(prevState => ({
                                    ...prevState,
                                    openTagEditor: false
                                }));
                            }}/>
                        </div>

                        {/* RIGHT SECTION :: PNG  META */}
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "8px",
                            alignItems: "center",
                        }}>
                            <DescriptiveTypography text={
                                `${Utils.humanFileSize(localState.estFileSizeInBytes ?? -1)}, ${props.image?.id}`
                            }/>
                        </div>
                    </div>
                }/>
            )
        }/>
    );
}
