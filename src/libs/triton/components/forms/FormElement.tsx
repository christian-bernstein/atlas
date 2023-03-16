import React, {PropsWithChildren} from "react";
import {InputGroup} from "./InputGroup";
import {MainTypography} from "../typography/MainTypography";
import {DescriptiveTypography} from "../typography/DescriptiveTypography";

export function FormElement(props: PropsWithChildren<{
    title?: string,
    caption?: string
}>): JSX.Element {
    return (
        <InputGroup>
            {props.title && (
                <MainTypography text={props.title}/>
            )}

            {props.children}

            {props.caption && (
                <DescriptiveTypography text={props.caption}/>
            )}
        </InputGroup>
    );
}
