import React, {PropsWithChildren, useRef} from "react";
import styled from "styled-components";
import {Tooltip} from "react-tooltip";
import {v4} from "uuid";
import {sizeToCssDict, variantToCssDict, variantToHoverCssDict} from "./DefaultButton";

const StyledIconButton = styled.button<IconButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
  transition: all 200ms;
  background-color: ${p => variantToCssDict.get(p.variant ?? "default")};
  cursor: ${p => p.deactivated ? "not-allowed" : "pointer"};
  aspect-ratio: 1 / 1;
  border: none;
  border-radius: .4rem;
  color: ${p => p.deactivated ? "rgb(139,148,158)" : "white"};;
  height: ${p => sizeToCssDict.get(p.size ?? "medium")};
  min-width: ${p => sizeToCssDict.get(p.size ?? "medium")};
  width: ${p => p.fullwidth ? "100%" : "auto"};
  
  &:hover {
    background-color: ${p => p.deactivated ? "#1e202a" : variantToHoverCssDict.get(p.variant ?? "default")};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export type IconButtonProps = PropsWithChildren<{
    tooltip?: React.ReactNode,
    clickableTooltip?: boolean,
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    deactivated?: boolean,
    size?: "small" | "medium",
    fullwidth?: boolean,
    variant?: "default" | "primary"
}>

export const IconButton: React.FC<IconButtonProps> = props => {
    const internalID = useRef(v4());
    return (
        <>
            <StyledIconButton {...props} type={"button"} onClick={(e) => {
                if (!props.deactivated) props.onClick?.(e);
            }} data-tooltip-id={internalID.current} children={
                props.children
            }/>
            {
                props.tooltip && (
                    <Tooltip className={"tooltip"} clickable={props.clickableTooltip ?? false} style={{
                        fontSize: "12px",
                        fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Noto Sans,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
                        lineHeight: 1.5,
                        backgroundColor: "#1a1a20"
                    }} id={internalID.current}>
                        { props.tooltip }
                    </Tooltip>
                )
            }
        </>
    );
}
