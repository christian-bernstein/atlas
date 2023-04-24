import React, {useContext, useState} from "react";
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
import {ImageSorterAPI, ImageSorterAPIContext} from "./ImageSorterAPI";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";

export const StyleDataDisplay: React.FC = props => {

    const api = useContext(ImageSorterAPIContext);

    const style = useLiveQuery(() => {
        return isaDB.styles.get(api.state.selectedStyleId ?? "");
    }, [api.state.selectedStyleId]);


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

                            { style && (
                                <>
                                    <span style={{ height: "300px", width: "100%" }} children={
                                        <ISAImage imageID={style.previewID ?? ""} style={{
                                            height: "300px",
                                            objectFit: "cover",
                                            objectPosition: "top",
                                            width: "100%"
                                        }}/>
                                    }/>

                                    <div style={{
                                        width: "100%",
                                        // overflow: "hidden",
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
                                            <MainTypography text={style.title}/>

                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                flexDirection: "row"
                                            }}>
                                                { /* TODO: Add something here... */ }
                                            </div>
                                        </div>


                                        { style.description && (
                                            <DescriptiveTypography text={style.description}/>
                                        ) }
                                    </div>
                                </>
                            ) }
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
                { style ? (
                    <MainTypography text={style.title}/>
                ) : (
                    <DescriptiveTypography text={"select a style"}/>
                )}


                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "4px"
                }}>

                    { style && (
                        <Menu opener={<IconButton size={"small"} children={<MoreHorizOutlined/>}/>} menuProps={{ direction: "top" }}>
                            <MenuButton icon={<EditRounded/>} text={"Edit"} appendix={"Ctrl+E"}/>
                            <MenuButton icon={<DeleteRounded/>} text={"Delete style"} />
                            <MenuDivider/>
                            <MenuButton text={"Open preview image"}/>
                        </Menu>
                    ) }



                    <IconButton deactivated={style === undefined} onClick={() => {
                        if (style !== undefined) {
                            setViewState(prevState => ({
                                expanded: !prevState.expanded
                            }));
                        }
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
