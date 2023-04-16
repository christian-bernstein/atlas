import {EngagementState} from "./EngagementState";
import React from "react";
import {Color} from "../base/logic/style/Color";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {LinkRounded} from "@mui/icons-material";

export type EngageSwitchProps = {
    state: EngagementState,
    onStateChange: (to: EngagementState) => void
}

export const EngageSwitch: React.FC<EngageSwitchProps> = props => {
    const stateRenderDict = new Map<EngagementState, {
        color: Color | undefined,
        nextState: EngagementState,
        title: string
    }>([
        [EngagementState.DISENGAGED, {
            // color: Color.ofHex("#da3633"),
            color: undefined,
            nextState: EngagementState.ENGAGED,
            title: "De-C"
        }],
        [EngagementState.ENGAGED, {
            // color: undefined,
            // color: Color.ofHex("#238636"),
            color: Color.ofHex("#8957e5"),
            nextState: EngagementState.DISENGAGED,
            title: "Coup"
        }],
        [EngagementState.ENGAGING, {
            color: Color.ofHex("#D29922"),
            nextState: EngagementState.ENGAGED,
            title: "Coup"
        }],
        [EngagementState.DISENGAGING, {
            color: Color.ofHex("#D29922"),
            nextState: EngagementState.DISENGAGED,
            title: "De-C"
        }]
    ])

    const renderConfig = stateRenderDict.get(props.state)!;

    return (
        <ButtonBase children={
            <span style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center"
            }} children={
                <LinkRounded sx={{
                    width: 16,
                    height: 16,
                    color: renderConfig.color?.css()
                }}/>
            }/>
        } baseProps={{
            type: "button",
            onClick: () => props.onStateChange(renderConfig.nextState)
        }}/>
    );
}
