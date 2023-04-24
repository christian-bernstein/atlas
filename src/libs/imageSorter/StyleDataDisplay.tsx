import React, {useState} from "react";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {MetaBasicEntry} from "./MetaBasicEntry";
import {IconButton} from "./IconButton";
import {
    ChevronRightRounded, DeleteRounded, EditRounded,
    FileOpenRounded,
    InfoRounded,
    MoreHorizOutlined,
    SelectAllRounded
} from "@mui/icons-material";
import {getMetadata} from "meta-png";
import {MetadataViewState, StyledMetadataView} from "./MetadataView";
import {StyleData} from "./StyleData";
import {ISAImage} from "./ISAImage";
import {Menu} from "./Menu";
import {MenuButton} from "./MenuButton";
import {MenuDivider} from "@szhsin/react-menu";

export const StyleDataDisplay: React.FC = props => {

    const data: StyleData = {
        title: "Sample title",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        id: "d2996bb6-5247-48b7-b3ef-28af0183dd91",
        meta: "",
        previewID: "",
        additionalPreviewIDs: []
    };

    const [viewState, setViewState] = useState<MetadataViewState>({
        expanded: false
    });

    return (
        <StyledMetadataView>
            {/* META DATA CONTENT */}
            <TransitionGroup>
                { !viewState.expanded ? undefined : (
                    <Collapse key={"metadata-view-tray"}>
                        <div style={{
                            width: "100%",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: "8px",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "8px"
                        }}>
                            <span style={{ height: "300px", width: "100%" }} children={
                                <ISAImage imageID={data.id} style={{
                                    height: "300px",
                                    objectFit: "cover",
                                    objectPosition: "top",
                                    width: "100%"
                                }}/>
                            }/>

                            <div style={{
                                width: "100%",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px"
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
                                            <MenuButton icon={<FileOpenRounded/>} text={"Open"} appendix={"Ctrl+O"}/>
                                            <MenuButton icon={<EditRounded/>} text={"Edit"} appendix={"Ctrl+E"}/>
                                            <MenuButton icon={<DeleteRounded/>} text={"Delete"}/>
                                            <MenuDivider/>
                                            <MenuButton text={"Open preview image"}/>
                                        </Menu>

                                    </div>
                                </div>


                                { data.description && (
                                    <DescriptiveTypography text={data.description}/>
                                ) }
                            </div>


                        </div>
                    </Collapse>
                ) }
            </TransitionGroup>


            {/* CONTROLS */}
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%"
            }}>
                <MainTypography text={data.title}/>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "4px"
                }}>
                    <IconButton onClick={() => {
                        setViewState(prevState => ({
                            expanded: !prevState.expanded
                        }));
                    }} size={"small"} children={
                        <ChevronRightRounded
                            data-opened={viewState.expanded}
                            className={"view-opener"}
                        />
                    }/>
                </div>
            </div>
        </StyledMetadataView>
    );
}
