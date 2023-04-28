import React from "react";
import {Workspace} from "../Workspace";
import {MixinCard} from "./MixinCard";
import {DefaultButton} from "../DefaultButton";
import {MainTypography} from "../../triton/components/typography/MainTypography";
import {Menu} from "../Menu";
import {ButtonModalCompound} from "../ButtonModalCompound";
import {MixinCreationDialog} from "./MixinCreationDialog";

export const MixinTab: React.FC = props => {

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
                        <Menu/>
                    </div>
                }/>
                <Workspace config={{
                    mode: "desktop",
                    name: "mixin-selector",
                    resizable: true
                }} children={
                    <MixinCard/>
                }/>
            </div>



            <Workspace config={{
                mode: "desktop",
                name: "mixin-view"
            }}/>
        </div>
    );
}
