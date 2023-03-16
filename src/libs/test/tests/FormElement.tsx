import React, {PropsWithChildren} from "react";
import {InputGroup} from "./InputGroup";
import {MainTypography} from "./MainTypography";
import {DescriptiveTypography} from "./DescriptiveTypography";

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
