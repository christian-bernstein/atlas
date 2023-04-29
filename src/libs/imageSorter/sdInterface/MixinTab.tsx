import React, {useState} from "react";
import {Workspace} from "../Workspace";
import {MixinCard} from "./MixinCard";
import {DefaultButton} from "../DefaultButton";
import {MainTypography} from "../../triton/components/typography/MainTypography";
import {Menu} from "../Menu";
import {ButtonModalCompound} from "../ButtonModalCompound";
import {MixinCreationDialog} from "./MixinCreationDialog";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "../ImageSorterAppDB";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {MenuButton} from "../MenuButton";
import {DeleteRounded} from "@mui/icons-material";
import {StyledModal} from "../StyledModal";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {ButtonBase, ButtonVariant} from "../../triton/components/buttons/ButtonBase";
import {stat} from "fs";

export type MixinTabState = {
    selectedMixinID?: string
}

export const MixinTab: React.FC = props => {
    const [state, setState] = useState<MixinTabState>({});

    const selectedMixin = useLiveQuery(() => {
        return isaDB.mixins.get(state.selectedMixinID ?? "");
    })

    const mixins = useLiveQuery(() => {
        return isaDB.mixins.toArray();
    });

    return (
        <div style={{
            width: "100%",
            height :"100%",
            display: "grid",
            gap: "8px",
            gridTemplateColumns: "min-content auto"
            // backgroundColor: "crimson",
        }}>
            <div style={{
                width: "100%",
                height :"100%",
                display: "grid",
                gap: "8px",
                gridTemplateRows: "min-content auto"
            }}>
                <Workspace config={{
                    mode: "desktop",
                    name: "mixin-selector-toolbar",
                }} children={
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: "8px"
                    }}>
                        <span style={{ width: "100%" }} children={
                            <ButtonModalCompound
                                button={
                                    <DefaultButton size={"small"} fullwidth variant={"primary"} children={
                                        <MainTypography text={"Create mixin"}/>
                                    }/>
                                }
                                modalContent={ctx => (
                                    <MixinCreationDialog onClose={() => ctx.close()}/>
                                )}
                            />
                        }/>

                        <Menu>
                            <ButtonModalCompound
                                button={
                                    <MenuButton text={"Delete all"} icon={<DeleteRounded/>} disabled={mixins === undefined || mixins?.length === 0}/>
                                }
                                modalContent={ctx => (
                                    <StyledModal showHeader={false} onClose={() => ctx.close()} title={"Delete all mixins?"} footer={
                                        <div style={{
                                            gridTemplateColumns: "repeat(2, 1fr)",
                                            display: "grid",
                                            width: "100%",
                                            gap: "8px"
                                        }}>
                                            <ButtonBase variant={ButtonVariant.DANGER} text={"Yes, delete all"} baseProps={{
                                                onClick: () => {
                                                    isaDB.mixins.clear();
                                                    ctx.close();
                                                }
                                            }}/>
                                            <ButtonBase text={"No, cancel"} baseProps={{
                                                onClick: () => ctx.close()
                                            }}/>
                                        </div>
                                    }>
                                        <MainTypography text={"Do you really want to clear all mixins?"}/>
                                        <DescriptiveTypography text={<><strong children={"Important: "}/>This action cannot be undone.</>}/>
                                    </StyledModal>
                                )}
                            />
                        </Menu>
                    </div>
                }/>
                <Workspace config={{
                    mode: "desktop",
                    name: "mixin-selector",
                    resizable: true
                }} children={
                    <TransitionGroup children={
                        mixins?.map(md => (
                            <Collapse key={md.id} children={
                                <span style={{
                                    display: "block",
                                    width: "100%",
                                    overflow: "scroll",
                                    paddingBottom: "8px"
                                }} children={
                                    <MixinCard for={md} onSelect={() => {
                                        setState(prevState => ({ ...prevState, selectedMixinID: md.id }))
                                    }}/>
                                }/>
                            }/>
                        ))
                    }/>
                }/>
            </div>



            <Workspace config={{
                mode: "desktop",
                name: "mixin-view"
            }} children={
                state.selectedMixinID === undefined ? (
                    <span style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }} children={
                        <DescriptiveTypography text={"Select a mixin"}/>
                    }/>
                ) : (
                    <div>
                        <div>
                            <MainTypography text={
                                <>@<strong style={{ color: "#ffc66d" }} children={selectedMixin?.key}/></>
                            } style={{
                                fontFamily: "Consolas, Courier New, monospace"
                            }}/>
                        </div>
                    </div>
                )
            }/>
        </div>
    );
}
