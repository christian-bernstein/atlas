import React from "react";
import Collapse from "@mui/material/Collapse";
import {Workspace} from "../Workspace";
import {TransitionGroup} from "react-transition-group";
import {SelectionPreviewImage} from "../SelectionPreviewImage";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {MainTypography} from "../../triton/components/typography/MainTypography";
import {DefaultButton} from "../DefaultButton";
import {isaDB} from "../ImageSorterAppDB";
import styled from "styled-components";
import {useLiveQuery} from "dexie-react-hooks";
import {IconButton} from "../IconButton";
import {CloseRounded} from "@mui/icons-material";
import {CollapseIconButton} from "../CollapseIconButton";

const StyledSelectionTray = styled.span`
  display: block;
  padding-top: 8px;
`;

export type HistoryTabSelectionViewProps = {
    selectedImages?: Array<string>,
    clearSelection?: () => void,
    detailedImageView?: boolean,
    toggleDetailedImageView?: () => void,
    removeImageFromSelection?: (imageID: string) => void
}

export const HistoryTabSelectionView: React.FC<HistoryTabSelectionViewProps> = props => {
    const images = useLiveQuery(async () => isaDB.sdInterfaceResults
            .where("id")
            .anyOfIgnoreCase(props.selectedImages ?? [])
            // TODO: remove limit
            .limit(16)
            .toArray(),
        [props.selectedImages]
    );

    return (
        <TransitionGroup children={
            !props.selectedImages ? undefined : (
                <Collapse key={"selection-view-tray"}>
                    <StyledSelectionTray children={
                        <Workspace config={{ mode: "desktop", name: "selection"}}>
                            {/* MAIN */}
                            <TransitionGroup children={
                                !props.detailedImageView ? undefined : (
                                    <Collapse key={"selection-view-preview-tray"} children={
                                        (images?.length ?? 0) > 0 ? (
                                            <TransitionGroup style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: "8px",
                                                overflowX: "scroll",
                                                width: "100%",
                                                maxWidth: "100%",
                                                alignItems: "center",
                                                marginBottom: "8px",
                                                height: "80px"
                                            }} children={
                                                images?.map(i => (
                                                    <Collapse orientation={"horizontal"} key={i.id} children={
                                                        <SelectionPreviewImage for={i} onClick={() => {
                                                            props.removeImageFromSelection?.(i.id);
                                                        }}/>
                                                    }/>
                                                ))
                                            }/>
                                        ) : (
                                            <div style={{
                                                display: "flex",
                                                width: "100%",
                                                height: "80px",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginBottom: "8px"
                                            }} children={
                                                <DescriptiveTypography text={"Nothing selected"}/>
                                            }/>
                                        )
                                    }/>
                                )
                            }/>

                            {/* FOOTER */}
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%"
                            }}>
                                <MainTypography text={"Selection"}/>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    <DescriptiveTypography text={`${props.selectedImages.length} selected`}/>

                                    <DefaultButton variant={"primary"} size={"small"} onClick={() => {
                                        // TODO Add
                                    }} children={
                                        <MainTypography text={"Export"}/>
                                    }/>

                                    <IconButton tooltip={"Clear & close"} size={"small"} onClick={() => {
                                        props.clearSelection?.();
                                    }} children={
                                        <CloseRounded/>
                                    }/>

                                    <CollapseIconButton
                                        open={props.detailedImageView ?? false}
                                        onToggle={() => props.toggleDetailedImageView?.()}
                                    />
                                </div>
                            </div>
                        </Workspace>
                    }/>
                </Collapse>
            )
        }/>
    );
}
