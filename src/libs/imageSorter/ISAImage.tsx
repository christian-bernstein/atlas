import React, {CSSProperties} from "react";
import {Image} from "./Image";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {ImageRounded} from "@mui/icons-material";

export type ISAImageProps = {
    imageID: string,
    imageRenderer?: (i: Image) => React.ReactElement,
    noImageComponent?: React.ReactElement,
    style?: CSSProperties
}

export const ISAImage: React.FC<ISAImageProps> = props => {
    const image = useLiveQuery(async () => {
        return isaDB.images
            .where("id")
            .equals(props.imageID)
            .first();
    }, [props.imageID]);

    if (image === undefined) {
        return props.noImageComponent !== undefined ? props.noImageComponent : (
            <ImageRounded/>
        );
    }

    return props.imageRenderer !== undefined ? props.imageRenderer(image) : (
        <img style={props.style} src={URL.createObjectURL(image.data)} alt={image.id}/>
    )
}
