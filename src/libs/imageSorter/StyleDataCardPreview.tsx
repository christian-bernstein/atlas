import React from "react";
import {StyleData} from "./StyleData";
import {ISAImage} from "./ISAImage";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {IconButton} from "./IconButton";
import {DeleteRounded, EditRounded, FileOpenRounded, MoreHorizOutlined, SelectAllRounded} from "@mui/icons-material";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {Menu} from "./Menu";
import {MenuButton} from "./MenuButton";
import {MenuDivider} from "@szhsin/react-menu";

export const StyleDataCardPreview: React.FC = props => {
    const data: StyleData = {
        title: "Sample title",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        id: "d2996bb6-5247-48b7-b3ef-28af0183dd91",
        meta: "",
        previewID: "",
        additionalPreviewIDs: []
    };

    return (
        <div style={{
            width: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            borderRadius: "8px",
            backgroundColor: "#1e202a",
            // backgroundColor: "crimson",
            alignItems: "center"
        }}>
            <ISAImage imageID={data.id} style={{
                height: "80px",
                objectFit: "cover",
                objectPosition: "top",
                aspectRatio: "1 / 1"
            }}/>

            <div style={{
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "1rem"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between"
                }}>
                    <MainTypography text={data.title} style={{
                        cursor: "pointer"
                    }}/>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexDirection: "row"
                    }}>
                        <IconButton size={"small"} children={<SelectAllRounded/>}/>


                        <Menu opener={<IconButton size={"small"} children={<MoreHorizOutlined/>}/>} menuProps={{ direction: "top" }}>
                            <MenuButton icon={<FileOpenRounded/>} text={"Open"} appendix={"Ctrl+O"}/>
                            <MenuButton icon={<EditRounded/>} text={"Edit"} appendix={"Ctrl+E"}/>
                            <MenuButton icon={<DeleteRounded/>} text={"Delete"}/>
                            <MenuDivider/>
                            <MenuButton text={"Open preview image"}/>
                        </Menu>

                    </div>
                </div>


                { data.description && (
                    <DescriptiveTypography text={data.description} style={{
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
