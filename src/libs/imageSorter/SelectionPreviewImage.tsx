import React from "react";
import {Image} from "./Image";

export type SelectionPreviewImage = {
    for: Image,
    onClick?: (event: React.MouseEvent<HTMLImageElement>) => void
}

export const SelectionPreviewImage: React.FC<SelectionPreviewImage> = props => {

    return (
        <img onClick={e => props.onClick?.(e)} alt={props.for.id} src={URL.createObjectURL(props.for.data)} style={{
            height: "80px",
            width: "80px",
            aspectRatio: "1 / 1",
            borderRadius: "8px",
            objectPosition: "center",
            objectFit: "cover",
            cursor: "pointer"
        }}/>
    );
}
