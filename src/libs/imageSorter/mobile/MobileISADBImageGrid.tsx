import React, {useState} from "react";
import {Image} from "../Image";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "../ImageSorterAppDB";
import {ImageGridState} from "../ISADBImageGrid";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {Menu} from "../Menu";
import {MenuButton} from "../MenuButton";
import {ArrowLeftRounded, ArrowRightRounded, Circle, RefreshRounded} from "@mui/icons-material";
import {Formik} from "formik";
import {FormikSingleSelectInput} from "../../triton/components/forms/FormikSingleSelectInput";
import {IconButton} from "../IconButton";
import {Dot} from "../../base/components/base/Dot";

export type MobileImageGridProps = {
    imageIDs: Array<string>,
    imageRenderer?: (data: Image) => React.ReactNode
}

export type MobileImageGridState = {
    page: number,
    itemsPerPage: number | undefined
}

export const MobileISADBImageGrid: React.FC<MobileImageGridProps> = props => {
    const [state, setState] = useState<ImageGridState>({
        page: 1,
        itemsPerPage: 16
    });

    const images = useLiveQuery(async () => {
        return isaDB.images
            .where("id")
            .anyOfIgnoreCase(props.imageIDs)
            .offset(state.itemsPerPage === undefined ? 0 : ((state.page - 1) * state.itemsPerPage))
            .limit( state.itemsPerPage === -1 ? props.imageIDs.length : (state.itemsPerPage ?? props.imageIDs.length))
            .toArray();
    }, [props, state]);

    return (
        <div style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            gap: "8px"
        }}>
            <div style={{
                flexShrink: 2,
                flexGrow: 1,
                overflowY: "scroll"
            }} children={
                (images !== undefined && images.length > 0) ? (
                    <div style={{
                        display: "grid",
                        gap: "8px",
                        // gridTemplateColumns: "repeat(auto-fill, minmax(64px, auto))",
                        gridTemplateColumns: "repeat(5, 1fr)",
                    }}>
                        {
                            props.imageRenderer !== undefined ? (images?.map(imageData => {
                                return (
                                    props.imageRenderer?.(imageData)
                                );
                            })) : images?.map(imageData => {
                                return (
                                    <img alt={"img"} src={URL.createObjectURL(imageData.data)} style={{
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        aspectRatio: "1 / 1",
                                        objectPosition: "center",
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        height: "auto",
                                    }}/>
                                );
                            })
                        }
                    </div>
                ) : undefined
            }/>

            <div style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                flexShrink: 0,
                justifyContent: "space-between"
            }}>
                <IconButton size={"small"} children={<ArrowLeftRounded/>} deactivated={state.page < 2} onClick={() => {
                    if (state.page > 1) {
                        setState(prevState => ({
                            ...prevState,
                            page: prevState.page - 1
                        }));
                    }
                }}/>

                <div style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center"
                }}>
                    <DescriptiveTypography style={{
                        textAlign: "center"
                    }} text={`Page ${state.page} / ${Math.ceil(props.imageIDs.length / (state.itemsPerPage ?? 1))}`}/>

                    <Circle sx={{ color: "#444444", width: "5px" }}/>

                    <DescriptiveTypography style={{
                        textAlign: "center"
                    }} text={`${props.imageIDs.length} images / ${images?.length ?? "0"} loaded`}/>
                </div>



                <IconButton size={"small"} children={<ArrowRightRounded/>} deactivated={state.page >= Math.ceil(props.imageIDs.length / (state.itemsPerPage ?? 1))} onClick={() => {
                    if (state.page < Math.ceil(props.imageIDs.length / (state.itemsPerPage ?? 1))) {
                        setState(prevState => ({
                            ...prevState,
                            page: prevState.page + 1
                        }));
                    }
                }}/>
            </div>
        </div>
    );
}
