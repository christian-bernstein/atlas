import React, {useContext} from "react";
import {StyleData} from "./StyleData";
import {ISAImage} from "./ISAImage";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {IconButton} from "./IconButton";
import {DeleteRounded, EditRounded, FileOpenRounded, MoreHorizOutlined, SelectAllRounded} from "@mui/icons-material";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {Menu} from "./Menu";
import {MenuButton} from "./MenuButton";
import {isaDB} from "./ImageSorterAppDB";
import {ImageSorterAPIContext} from "./ImageSorterAPI";

export type StyleDataCardPreviewProps = {
    data: StyleData
}

export const StyleDataCardPreview: React.FC<StyleDataCardPreviewProps> = props => {
    const api = useContext(ImageSorterAPIContext);

    return (
        <div style={{
            width: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px",
            backgroundColor: "#1e202a",
            alignItems: "center"
        }}>
            { props.data.previewID && (
                <span style={{ height: "150px", width: "100%" }} children={
                    <ISAImage imageID={props.data.previewID} onClick={() => api.selectStyleByID(props.data.id)} style={{
                        // height: "80px",
                        cursor: "pointer",
                        height: "150px",
                        width: "100%",
                        objectFit: "cover",
                        objectPosition: "top",
                        aspectRatio: "1 / 1"
                    }}/>
                }/>
            ) }

            <div style={{
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "1rem",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between"
                }}>
                    <MainTypography text={props.data.title} onClick={() => api.selectStyleByID(props.data.id)} style={{
                        cursor: "pointer"
                    }}/>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexDirection: "row"
                    }}>
                        <Menu opener={<IconButton size={"small"} children={<MoreHorizOutlined/>}/>} menuProps={{ direction: "top" }}>
                            <MenuButton icon={<FileOpenRounded/>} text={"Open"} appendix={"Ctrl+O"} onSelect={() => {
                                api.selectStyleByID(props.data.id);
                            }}/>
                            <MenuButton icon={<EditRounded/>} text={"Edit"} appendix={"Ctrl+E"}/>
                            <MenuButton icon={<DeleteRounded/>} text={"Delete"} onSelect={() => {
                                isaDB.styles.delete(props.data.id);
                            }}/>
                            { props.data.previewID && (
                                <MenuButton text={"Open preview image"} onSelect={() => {
                                    api.selectImageByID(props.data.previewID!, false)
                                }}/>
                            ) }
                        </Menu>
                    </div>
                </div>


                { props.data.description && (
                    <DescriptiveTypography text={props.data.description} style={{
                        width: "calc(100% - 0px)",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis"
                    }}/>
                ) }
            </div>


        </div>
    );
}
