import React, {useContext, useState} from "react";
import {ImageSorterAPIStateContext} from "./ImageSorterApp";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import Collapse from "@mui/material/Collapse";
import {Workspace} from "./Workspace";
import {TransitionGroup} from "react-transition-group";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {ChevronRightRounded, CloseRounded} from "@mui/icons-material";
import {IconButton} from "./IconButton";
import styled from "styled-components";
import {DefaultButton} from "./DefaultButton";
import {ExportConfigDialog} from "./ExportConfigDialog";

const StyledSelectionTray = styled.span`
  display: block;
  padding-top: 8px;

  .view-opener {
    transition: all ease-in-out .1s;
    rotate: -90deg;

    &[data-opened=true] {
      rotate: 90deg;
    }
  }
`;

export const SelectionView: React.FC = props => {
    const state = useContext(ImageSorterAPIStateContext);
    const api = useContext(ImageSorterAPIContext);

    const [localState, setLocalState] = useState<{
        openSubmissionDialog: boolean
    }>({
        openSubmissionDialog: false
    });

    const images = useLiveQuery(async () => {
        return isaDB.images
            .where("id")
            .anyOfIgnoreCase(state.selectedImages)
            // .limit(16)
            .toArray();
    }, [state.selectedImages]);

    return (
        <>
            {/* DIALOGS */}
            <ExportConfigDialog open={localState.openSubmissionDialog} onClose={() => setLocalState(prevState => ({ ...prevState, openSubmissionDialog: false }))}/>

            {/* VISIBLE PART */}
            <TransitionGroup children={
                !state.selectionMode ? undefined : (
                    <Collapse key={"selection-view-tray"}>
                        <StyledSelectionTray children={
                            <Workspace config={{ mode: "desktop", name: "selection"}}>
                                {/* MAIN */}
                                <TransitionGroup children={
                                    !state.selectionPreview ? undefined : (
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
                                                            <img alt={i.id} src={URL.createObjectURL(i.data)} style={{
                                                                height: "80px",
                                                                width: "80px",
                                                                aspectRatio: "1 / 1",
                                                                borderRadius: "8px",
                                                                objectPosition: "center",
                                                                objectFit: "cover"
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
                                        <DescriptiveTypography text={`${state.selectedImages.length} selected`}/>

                                        <DefaultButton size={"small"} children={
                                            <MainTypography text={"Select action"}/>
                                        }/>

                                        <DefaultButton variant={"primary"} size={"small"} onClick={() => {
                                            setLocalState(prevState => ({
                                                ...prevState,
                                                openSubmissionDialog: true
                                            }));
                                        }} children={
                                            <MainTypography text={"Submit"}/>
                                        }/>

                                        <IconButton tooltip={"Clear & close"} size={"small"} onClick={() => {
                                            api.selectionManager.clearAndCloseSelection();
                                        }} children={
                                            <CloseRounded/>
                                        }/>

                                        <IconButton onClick={() => {
                                            api.setState(prevState => ({
                                                ...prevState,
                                                selectionPreview: !prevState.selectionPreview
                                            }));
                                        }} size={"small"} children={
                                            <ChevronRightRounded
                                                data-opened={state.selectionPreview}
                                                className={"view-opener"}
                                            />
                                        }/>
                                    </div>
                                </div>
                            </Workspace>
                        }/>
                    </Collapse>
                )
            }/>
        </>
    );
}
