import React from "react";
import styled from "styled-components";
import {ChevronRightRounded} from "@mui/icons-material";
import {IconButton} from "./IconButton";

export const StyledCollapseIcon = styled.span`
  .view-opener {
    transition: all ease-in-out .1s;
    rotate: -90deg;

    &[data-opened=true] {
      rotate: 90deg;
    }
  }
`;

export type CollapseIconButtonProps = {
    open?: boolean,
    onToggle?: (open: boolean) => void
}

export const CollapseIconButton: React.FC<CollapseIconButtonProps> = props => {

    return (
        <IconButton onClick={() => {
            props.onToggle?.(!props.open);
        }} size={"small"} children={
            <StyledCollapseIcon children={
                <ChevronRightRounded
                    data-opened={props.open ?? false}
                    className={"view-opener"}
                />
            }/>

        }/>
    );
}
