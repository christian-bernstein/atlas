import React from "react";
import {MainTypography} from "../../triton/components/typography/MainTypography";
import {Menu} from "../Menu";
import {Tag} from "../Tag";
import {ColorableTag} from "../ColorableTag";
import {Color} from "../../base/logic/style/Color";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "../ImageSorterAppDB";
import {MixinData} from "./MixinData";
import {MenuButton} from "../MenuButton";
import {DeleteRounded} from "@mui/icons-material";

export type MixinCardProps = {
    for: MixinData,
    onSelect?: () => void,
}

export const MixinCard: React.FC<MixinCardProps> = props => {
    return (
        <div onClick={() => {
            props.onSelect?.();
        }} style={{
            padding: "1rem",
            width: "100%",
            backgroundColor: "#1e202a",
            borderRadius: "8px",
            cursor: "pointer"
        }}>
            <div style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px"
            }}>
                <MainTypography text={
                    <>@<strong style={{ color: "#ffc66d" }} children={props.for.key}/></>
                } style={{
                    fontFamily: "Consolas, Courier New, monospace"
                }}/>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    {/*}
                    <ColorableTag
                        tag={"link"}
                        c={Color.ofHex("#ffc66d")}
                    />
                    <ColorableTag
                        tag={"func"}
                        c={Color.ofHex("#d2a8ff")}
                    />
                    */}
                    <ColorableTag
                        tag={"constant"}
                        c={Color.ofHex("#79c0ff")}
                    />

                    <Menu>
                        <MenuButton text={"Delete"} icon={<DeleteRounded/>} onSelect={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            isaDB.mixins.delete(props.for.id);
                        }}/>
                    </Menu>
                </div>
            </div>
        </div>
    );
}
