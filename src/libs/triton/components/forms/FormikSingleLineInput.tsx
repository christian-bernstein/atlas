import {FormikInput} from "./FormikInput";
import {Field} from "formik";
import React from "react";

export function FormikSingleLineInput(props: { name: string }): JSX.Element {
    return (
        <FormikInput children={
            <Field class={"input"} name={props.name}/>
        }/>
    );
}
