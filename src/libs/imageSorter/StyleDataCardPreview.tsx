import React from "react";
import {StyleData} from "./StyleData";
import {ISAImage} from "./ISAImage";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {IconButton} from "./IconButton";
import {MoreHorizOutlined, SelectAllRounded} from "@mui/icons-material";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {Menu} from "./Menu";
import {MenuButton} from "./MenuButton";

export const StyleDataCardPreview: React.FC = props => {
    const data: StyleData = {
        title: "Sample title",
        description: "Sample description",
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
            flexDirection: "column",
            borderRadius: "8px",
            backgroundColor: "crimson",
            alignItems: "center"
        }}>
            <ISAImage imageID={data.id} style={{
                maxHeight: "250px",
                objectFit: "cover",
                objectPosition: "top",
                width: "100%"
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
                    <MainTypography text={data.title}/>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexDirection: "row"
                    }}>
                        <IconButton size={"small"} children={<SelectAllRounded/>}/>


                        <Menu opener={<IconButton size={"small"} children={<MoreHorizOutlined/>}/>} menuProps={{ direction: "top" }}>
                            <MenuButton text={"Edit"} appendix={"Ctrl+E"}/>
                            <MenuButton text={"Delete"}/>
                        </Menu>

                    </div>
                </div>


                { data.description && (
                    <DescriptiveTypography text={data.description}/>
                ) }
            </div>


        </div>
    );
}
