import React, {ButtonHTMLAttributes, DetailedHTMLProps, FC, PropsWithChildren} from "react";
import styled from "styled-components";
import {StyledMixinProps} from "../StyledMixinProps";
import {ColorMixin} from "../ColorMixin";
import {Color} from "../../../base/logic/style/Color";

const StyledButtonBase = styled.button<StyledMixinProps>`
  font-family: inherit;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  appearance: none;
  user-select: none;
  text-align: center;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  height: 32px;
  min-width: max-content;
  box-shadow: transparent 0 0;
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  text-decoration: none;
  padding: 0 12px;
  gap: 8px;
  transition: color 80ms cubic-bezier(0.65, 0, 0.35, 1) 0s, fill, color, background-color, border-color;

  color: ${props => props.colors.getColor("main-color")};
  background-color: ${props => props.colors.getColor("main-background-color")};
  border-color: ${props => props.colors.getColor("main-border-color")};
  
  &:hover:not([disabled]) {
    box-shadow: transparent 0 0;
    color: ${props => props.colors.getColor("hover-color")};
    background-color: ${props => props.colors.getColor("hover-background-color")};
    border-color: ${props => props.colors.getColor("hover-border-color")};
  }

  &:active:not([disabled]) {
    box-shadow: transparent 0 0;
    color: ${props => props.colors.getColor("active-color")};
    background-color: ${props => props.colors.getColor("active-background-color")};
    border-color: ${props => props.colors.getColor("active-border-color")};
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const ButtonContent = styled.span`
  flex: 1 0 auto;
  display: grid;
  grid-template-areas: "leadingVisual text trailingVisual";
  grid-template-columns: min-content minmax(0px, auto) min-content;
  -webkit-box-align: center;
  align-items: center;
  align-content: center;
`

export type ButtonBaseProps = {
    baseProps?: ButtonHTMLAttributes<any>,
    text?: string
    leadingVisual?: JSX.Element,
    trailingVisual?: JSX.Element,
    variant?: ButtonVariant
}

export const defaultColorMixin: ColorMixin = new ColorMixin(new Map<string, Color | string>([
    ["main-color", "rgb(201, 209, 217)"],
    ["main-background-color", "rgb(33, 38, 45)"],
    ["main-border-color", "rgba(240, 246, 252, 0.1)"],

    ["hover-color", "rgb(201, 209, 217)"],
    ["hover-background-color", "rgb(48, 54, 61)"],
    ["hover-border-color", "rgb(139, 148, 158)"],

    ["active-color", "rgb(201, 209, 217)"],
    ["active-background-color", "rgb(22, 27, 34)"],
    ["active-border-color", "rgb(139, 148, 158)"],
]));

export const primaryColorMixin: ColorMixin = new ColorMixin(new Map<string, Color | string>([
    ["main-color", "rgb(255, 255, 255)"],
    ["main-background-color", "rgb(31, 111, 235)"],
    ["main-border-color", "rgba(240, 246, 252, 0.1)"],

    ["hover-color", "rgb(255, 255, 255)"],
    ["hover-background-color", "rgb(56, 139, 253)"],
    ["hover-border-color", "rgb(139, 148, 158)"],

    ["active-color", "rgb(255, 255, 255)"],
    ["active-background-color", "rgb(31, 111, 235)"],
    ["active-border-color", "rgb(139, 148, 158)"],
]));

export const redColorMixin: ColorMixin = new ColorMixin(new Map<string, Color | string>([
    ["main-color", "rgb(248, 81, 73)"],
    ["main-background-color", "rgb(33, 38, 45)"],
    ["main-border-color", "rgba(240, 246, 252, 0.1)"],

    ["hover-color", "rgb(255, 255, 255)"],
    ["hover-background-color", "rgb(218, 54, 51)"],
    ["hover-border-color", "rgb(248, 81, 73)"],

    ["active-color", "rgb(255, 255, 255)"],
    ["active-background-color", "rgb(182, 35, 36)"],
    ["active-border-color", "rgb(255, 123, 114)"],
]));

export enum ButtonVariant {
    DEFAULT, DANGER, PRIMARY
}

const colorMixinLookup: Map<ButtonVariant, ColorMixin> = new Map<ButtonVariant, ColorMixin>([
    [ButtonVariant.DANGER, redColorMixin],
    [ButtonVariant.DEFAULT, defaultColorMixin],
    [ButtonVariant.PRIMARY, primaryColorMixin],
]);

export const ButtonBase: FC<ButtonBaseProps> = props => {
    return (
        <StyledButtonBase colors={colorMixinLookup.get(props.variant ?? ButtonVariant.DEFAULT)!} className={"button-base"} {...props.baseProps} children={
            <ButtonContent>
                { props.leadingVisual && (
                    <span children={props.leadingVisual} style={{
                        gridArea: "leadingVisual"
                    }}/>
                ) }

                { props.text && (
                    <span children={props.text} style={{
                        gridArea: "text",
                        whiteSpace: "nowrap"
                    }}/>
                ) }

                { props.trailingVisual && (
                    <span children={props.trailingVisual} style={{
                        gridArea: "trailingVisual"
                    }}/>
                ) }
            </ButtonContent>
        }/>
    );
}
