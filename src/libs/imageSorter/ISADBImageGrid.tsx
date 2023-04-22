import React, {useState} from "react";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {Image} from "./Image";
import {ArrowLeftRounded, ArrowRightRounded, RefreshRounded} from "@mui/icons-material";
import {IconButton} from "./IconButton";
import {Menu} from "./Menu";
import {MenuButton} from "./MenuButton";
import {FormikSingleSelectInput} from "../triton/components/forms/FormikSingleSelectInput";
import {Formik} from "formik";
import {MenuDivider} from "@szhsin/react-menu";

export type ImageGridProps = {
    imageIDs: Array<string>,
    imageRenderer?: (data: Image) => React.ReactNode
}

export type ImageGridState = {
    page: number,
    itemsPerPage: number | undefined
}

export const ISADBImageGrid: React.FC<ImageGridProps> = props => {
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

    console.log("rendering image grid..");

    return (
        <div style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px"
        }}>
            <div style={{
                width: "100%",
                display: "grid",
                alignItems: "center",
                gridTemplateColumns: "32px auto min-content"
            }}>
                <span/>
                <DescriptiveTypography style={{ textAlign: "center" }} text={`${props.imageIDs.length} images / ${images?.length ?? "0"} loaded`}/>
                <Menu>
                    <MenuButton text={"Refresh"} appendix={"Ctrl+F5"} disabled icon={<RefreshRounded/>}/>

                    <Formik initialValues={{ itemsPerPage: state.itemsPerPage }} onSubmit={values => {
                        setState(prevState => ({ ...prevState, itemsPerPage: Number(values.itemsPerPage) ?? 16 }))
                    }} children={fp => (
                        <FormikSingleSelectInput centerSelectedElementBadge placeholder={"Items per page"} disableSearchbar onPreSubmit={val => {
                            fp.setFieldValue("itemsPerPage", val);
                            fp.handleSubmit();
                        }} formikProps={fp} name={"itemsPerPage"} options={[
                            { id: "8", text: "8" },
                            { id: "16", text: "16" },
                            { id: "32", text: "32" },
                            { id: "48", text: "48" },
                            { id: "64", text: "64" },
                            { id: "-1", text: "All" },
                        ]}/>
                    )}/>
                </Menu>
            </div>

            {
                (images !== undefined && images.length > 0) ? (
                    <div style={{
                        display: "grid",
                        gap: "8px",
                        gridTemplateColumns: "repeat(auto-fill, minmax(64px, auto))"
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
            }

            <div style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
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

                <DescriptiveTypography style={{
                    textAlign: "center"
                }} text={`Page ${state.page} / ${Math.ceil(props.imageIDs.length / (state.itemsPerPage ?? 1))}`}/>

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
