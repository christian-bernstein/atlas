import {FormikProps} from "formik";
import {FormikInput} from "./FormikInput";
import React from "react";

export function FormikTextArea(props: { name: string, formikProps: FormikProps<any> }): JSX.Element {
    return (
        <FormikInput children={
            <textarea
                className={"input"}
                name={props.name}
                style={{
                    height: "140px",
                    padding: "12px",
                    resize: "vertical"
                }}
                onChange={props.formikProps.handleChange}
                onBlur={props.formikProps.handleBlur}
                value={props.formikProps.values[props.name]}
            />
        }/>
    );
}
