import React, {useState} from "react";
import {MainTypography} from "../../triton/components/typography/MainTypography";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "../ImageSorterAppDB";
import {Menu} from "../Menu";
import {IconButton} from "../IconButton";
import {
    AbcRounded,
    AdbRounded,
    CheckRounded,
    CloseRounded,
    DeleteRounded,
    HourglassTopRounded
} from "@mui/icons-material";
import {SDPromptField} from "./SDPromptField";
import {percent} from "../../base/logic/style/DimensionalMeasured";
import {FormElement} from "../../triton/components/forms/FormElement";
import {MenuButton} from "../MenuButton";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {HelpHint} from "../HelpHint";
import _ from "lodash";
import {Color} from "../../base/logic/style/Color";

export type MixinDisplayProps = {
    mixinID: string,
    onClose?: () => void,
    onDeleteRequest?: () => void
}

export type MixinDisplayState = {
    containsUnsavedChanges: boolean,
    debouncedTargetUpdater: (mixinID: string, target: string) => void
}

export const MixinDisplay: React.FC<MixinDisplayProps> = props => {
    const selectedMixin = useLiveQuery(() => {
        return isaDB.mixins.where("id").equals(props.mixinID).first();
    }, [props.mixinID]);

    const [state, setState] = useState<MixinDisplayState>({
        containsUnsavedChanges: false,
        debouncedTargetUpdater: _.debounce((mixinID: string, target: string) => {
            isaDB.mixins.update(mixinID, {
                target: target
            }).then(() => {
                setState(prevState => ({ ...prevState, containsUnsavedChanges: false }));
            });
        }, 1e3)
    });

    return (
        <div style={{
            display: "grid",
            gridTemplateRows: "min-content auto",
            gap: "8px",
            width: "100%",
            minHeight: "100%",

        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <MainTypography text={
                    <>@<strong style={{ color: "#ffc66d" }} children={selectedMixin?.key}/></>
                } style={{
                    fontFamily: "Consolas, Courier New, monospace"
                }}/>

                <div style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center"
                }}>
                    <Menu>
                        <MenuButton text={"Delete mixin"} icon={<DeleteRounded/>} onSelect={() => props.onDeleteRequest?.()}/>
                    </Menu>
                    <IconButton size={"small"} onClick={() => props.onClose?.()} children={
                        <CloseRounded/>
                    }/>
                </div>
            </div>

            <div style={{
                display: "grid",
                gap: "8px",
                gridTemplateRows: "min-content auto min-content",
                height: "100%"
            }}>


                <div style={{
                    display: "flex",
                    gap: "8px",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between"
                }}>
                    <div style={{
                        display: "flex",
                        gap: "8px",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <AbcRounded/>
                        <MainTypography text={"Constant substitution value"}/>
                    </div>

                    <IconButton tooltip={ state.containsUnsavedChanges ?
                        "Await saving..." : "Everything is saved"
                     } size={"small"} children={ state.containsUnsavedChanges ? (
                            <HourglassTopRounded style={{
                                width: "18px",
                                height: "18px",
                                color: "#ffc66d"
                            }}/>
                        ) : (
                            <CheckRounded style={{
                                width: "18px",
                                height: "18px"
                            }}/>
                        ) }/>
                </div>

                <SDPromptField backgroundColor={Color.ofHex("#1e202a")} value={selectedMixin?.target ?? ""} onChange={value => {
                    setState(prevState => ({ ...prevState, containsUnsavedChanges: true }));
                    state.debouncedTargetUpdater(props.mixinID, value ?? "");
                }}/>

                <div style={{
                    display: "flex",
                    gap: "8px",
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <DescriptiveTypography text={"Constant substitution replaces the mixin key (E.g. @moonlight) with the exact value provided above."}/>
                    <HelpHint text={
                        "Constant substitution allows everything the SD Prompt allows. Meaning you can call mixins withing mixins. Beware of recursive mixin substitutions!"
                    }/>
                </div>
            </div>

        </div>
    );
}
