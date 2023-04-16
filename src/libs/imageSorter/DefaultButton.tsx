import React, {PropsWithChildren, useRef} from "react";
import styled from "styled-components";
import {v4} from "uuid";
import {Tooltip} from "react-tooltip";

export const sizeToCssDict: Map<string, string> = new Map<string, string>([
    ["small", "2rem"],
    ["medium", "2.5rem"]
]);

export const variantToCssDict: Map<string, string> = new Map<string, string>([
    ["default", "#1e202a"],
    ["primary", "#5028c8"]
]);

export const variantToHoverCssDict: Map<string, string> = new Map<string, string>([
    ["default", "#2e3044"],
    ["primary", "#683ce6"]
]);

const StyledButton = styled.button<IconProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
  transition: all 200ms;
  background-color: ${p => variantToCssDict.get(p.variant ?? "default")};
  cursor: ${p => p.deactivated ? "not-allowed" : "pointer"};
  border: none;
  border-radius: .4rem;
  color: ${p => p.deactivated ? "rgb(139,148,158)" : "white"};;
  height: ${p => sizeToCssDict.get(p.size ?? "medium")};
  max-height: ${p => sizeToCssDict.get(p.size ?? "medium")};
  padding: 0 .8rem;
  min-width: ${p => sizeToCssDict.get(p.size ?? "medium")};
  width: ${p => p.fullwidth ? "100%" : "auto"};
  
  &:hover {
    background-color: ${p => p.deactivated ? "#1e202a" : variantToHoverCssDict.get(p.variant ?? "default")};
  }

  &:active {
    filter: brightness(1.2);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export type IconProps = PropsWithChildren<{
    tooltip?: React.ReactNode,
    clickableTooltip?: boolean,
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    deactivated?: boolean,
    size?: "small" | "medium",
    fullwidth?: boolean,
    variant?: "default" | "primary"
}>

export const DefaultButton: React.FC<IconProps> = props => {
    const internalID = useRef(v4());
    return (
        <>
            <StyledButton {...props} type={"button"} onClick={(e) => {
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
