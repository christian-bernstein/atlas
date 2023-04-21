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
import {
    ChevronRightRounded,
    CloseRounded,
    CreateNewFolderRounded,
    CreateRounded, DeleteForeverRounded, DeleteRounded, FileOpenRounded, FilterRounded, ManageSearchRounded,
    MoreVertRounded, StarRounded, TagRounded, UploadRounded
} from "@mui/icons-material";
import {IconButton} from "./IconButton";
import styled from "styled-components";
import {DefaultButton} from "./DefaultButton";
import {ExportConfigDialog} from "./ExportConfigDialog";
import {SelectionPreviewImage} from "./SelectionPreviewImage";
import {CheckMenuButton, MenuButton} from "./MenuButton";
import {BooleanContext} from "../test/BooleanContext";
import {FileStructureImportModal} from "./FileStructureImportModal";
import {MenuDivider} from "@szhsin/react-menu";
import {VFSViewSettings} from "./VFSViewSettings";
import {Menu} from "./Menu";
import {StyledModal} from "./StyledModal";
import {Formik} from "formik";
import {TagListConfigurator} from "./TagListConfigurator";
import {ButtonModalCompound} from "./ButtonModalCompound";
import {Image} from "./Image";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {ControlModalCompound, ModalCompoundContext, ModalPolicy} from "./ControlModalCompound";
import {ButtonGroup} from "./ButtonGroup";

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

            // TODO: remove limit
            .limit(16)

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
                                                            <SelectionPreviewImage for={i} onClick={() => api.selectImageByID(i.id)}/>
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

                                        <DefaultButton variant={"primary"} size={"small"} onClick={() => {
                                            setLocalState(prevState => ({
                                                ...prevState,
                                                openSubmissionDialog: true
                                            }));
                                        }} children={
                                            <MainTypography text={"Submit"}/>
                                        }/>

                                        <Menu menuProps={{ direction: "top" }} opener={<IconButton size={"small"} children={<MoreVertRounded/>}/>}>
                                            <MenuButton disabled text={"Filter"} icon={<ManageSearchRounded/>} onSelect={() => {}}/>

                                            <ButtonModalCompound
                                                preventClosingMasterSwitch
                                                preventClosingOnBackdropClick
                                                button={<MenuButton text={"Add tags"} icon={<TagRounded/>}/>}
                                                modalContent={(ctx) => (
                                                    <Formik initialValues={{ tags: [], tagPrompt: "" }} onSubmit={(values, formikHelpers) => {
                                                        isaDB.images.where("id").anyOfIgnoreCase(state.selectedImages).toArray().then(images => {
                                                            images.forEach((i, n, arr) => {
                                                                const newTags = Array.from<string>(new Set<string>([...i.tags, ...values.tags]))
                                                                isaDB.images.update(i.id, {
                                                                    tags: newTags
                                                                }).then(() => {
                                                                    if (n === arr.length - 1) {
                                                                        // Update finished
                                                                        formikHelpers.setSubmitting(false);
                                                                        ctx.close();
                                                                    }
                                                                }).catch(reason => {
                                                                    formikHelpers.setSubmitting(false);
                                                                    alert(reason);
                                                                    ctx.close();
                                                                });
                                                            });
                                                        }).catch(reason => {
                                                            formikHelpers.setSubmitting(false);
                                                            alert(reason);
                                                            ctx.close();
                                                        });
                                                    }} children={fp => (
                                                        <StyledModal icon={<TagRounded/>} title={"Add tags"} onClose={() => ctx.close()} children={
                                                            <TagListConfigurator formik={fp}/>
                                                        } footer={
                                                            <div style={{
                                                                display: "grid",
                                                                gap: "8px",
                                                                width: "100%",
                                                                gridTemplateColumns: "repeat(2, 1fr)"
                                                            }}>
                                                                <ButtonBase text={"Add tags"} baseProps={{
                                                                    onClick: (e) => fp.handleSubmit(e)
                                                                }}/>
                                                                <ButtonBase text={"Cancel"} baseProps={{
                                                                    onClick: () => ctx.close()
                                                                }}/>
                                                            </div>
                                                        }/>
                                                    )}/>
                                                )}
                                            />

                                            <ControlModalCompound
                                                controller={ctx => (
                                                    <MenuButton text={"Mark as favourites"} icon={<StarRounded/>} onSelect={() => {
                                                        ctx.open("process", undefined);
                                                        state.selectedImages.forEach((iID, i, arr) => {
                                                            isaDB.images.update(iID, {
                                                                favourite: true
                                                            }).then(() => {
                                                                if (i === arr.length - 1) {
                                                                    // Update finished
                                                                    ctx.open("success", arr.length);
                                                                }
                                                            }).catch(reason => {
                                                                alert(reason);
                                                                ctx.close();
                                                            });
                                                        });
                                                    }}/>
                                                )}
                                                modals={new Map<string, (ctx: ModalCompoundContext, param: any) => React.ReactNode | [React.ReactNode, ModalPolicy]>([
                                                    ["success", (ctx, param) => {
                                                        const isNum = typeof param === "number";
                                                        const pNum = param as number;
                                                        const text = !isNum ? "" : (pNum === 1 ? "One image marked as favourite" : `${pNum} images marked as favourites`);
                                                        return (
                                                            <StyledModal closeDisplayMode={"hidden"} icon={<StarRounded/>} title={text} onClose={() => ctx.close()} children={
                                                                <div style={{
                                                                    display: "grid",
                                                                    width: "100%",
                                                                    gridTemplateColumns: "repeat(1, 1fr)"
                                                                }}>
                                                                    <ButtonBase text={"OK"} baseProps={{
                                                                        onClick: () => ctx.close()
                                                                    }}/>
                                                                </div>
                                                            }/>
                                                        );

                                                    }],
                                                    ["process", ctx => (
                                                        <StyledModal closeDisplayMode={"hidden"} loading title={"Marking as favourites"} onClose={() => ctx.close()}/>
                                                    )]
                                                ])}
                                            />

                                            <MenuButton disabled text={"Delete selection"} icon={<DeleteRounded/>} onSelect={() => {}}/>
                                        </Menu>


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
