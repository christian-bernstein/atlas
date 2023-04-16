import React, {useEffect, useState} from "react";
import {Image} from "./Image";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {ArrowLeftRounded, ArrowRightRounded} from "@mui/icons-material";

export type BaseImageGridProps = {
    images: Array<Image>,
    imageRenderer?: (data: Image) => React.ReactNode
}

export type BaseImageGridState = {
    page: number,
    itemsPerPage: number | undefined
}

export const BaseImageGrid: React.FC<BaseImageGridProps> = props => {
    const [state, setState] = useState<BaseImageGridState>({
        page: 1,
        itemsPerPage: 8
    });

    const [loadedImages, setLoadedImages] = useState<Array<Image>>([]);

    useEffect(() => {
        const itemsPerPage = state.itemsPerPage ?? 16;
        const startIndex = (state.page - 1) * itemsPerPage
        setLoadedImages(props.images.slice(startIndex, startIndex + itemsPerPage));
    }, [state]);

    return (
        <div style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px"
        }}>
            <div style={{

            }}>
                <DescriptiveTypography text={`${props.images.length} images`}/>
            </div>

            {
                (props.images.length > 0) ? (
                    <div style={{
                        display: "grid",
                        gap: "8px",
                        width: "100%",
                        gridTemplateColumns: "repeat(auto-fill, minmax(64px, auto))"
                    }}>
                        {
                            props.imageRenderer !== undefined ? (loadedImages?.map(imageData => {
                                return (
                                    props.imageRenderer?.(imageData)
                                );
                            })) : loadedImages?.map(imageData => {
                                return (
                                    <span key={imageData.id} style={{
                                        maxWidth: "100%",
                                        aspectRatio: "1 / 1",
                                        maxHeight: "100%",
                                        height: "auto",
                                        position: "relative"
                                    }} children={
                                        <img alt={"img"} src={URL.createObjectURL(imageData.data)} style={{
                                            objectFit: "cover",
                                            position: "absolute",
                                            borderRadius: "8px",
                                            objectPosition: "center",
                                            maxWidth: "100%",
                                            aspectRatio: "1 / 1",
                                            maxHeight: "100%",
                                            height: "auto",
                                        }}/>
                                    }/>
                                );
                            })
                        }
                    </div>
                ) : undefined
            }

            <div style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <ButtonBase baseProps={{
                    type: "button",
                    onClick: () => {
                        if (state.page > 1) {
                            setState(prevState => ({
                                ...prevState,
                                page: prevState.page - 1
                            }));
                        }
                    }
                }} leadingVisual={
                    <ArrowLeftRounded/>
                }/>

                <DescriptiveTypography style={{
                    textAlign: "center"
                }} text={`Page ${state.page} / ${Math.ceil(props.images.length / (state.itemsPerPage ?? 1))}`}/>

                <ButtonBase baseProps={{
                    type: "button",
                    onClick: () => {
                        if (state.page < Math.ceil(props.images.length / (state.itemsPerPage ?? 1))) {
                            setState(prevState => ({
                                ...prevState,
                                page: prevState.page + 1
                            }));
                        }
                    }
                }} leadingVisual={
                    <ArrowRightRounded/>
                }/>
            </div>
        </div>
    );
}
