import {FormikProps} from "formik";
import {FormikInput} from "./FormikInput";
import React from "react";
import {DimensionalMeasured} from "../../../base/logic/style/DimensionalMeasured";

export function FormikTextArea(props: {
    name: string,
    formikProps: FormikProps<any>,
    h?: DimensionalMeasured
}): JSX.Element {
    return (
        <FormikInput children={
            <textarea
                className={"input"}
                name={props.name}
                style={{
                    height: props.h === undefined ? "140px" : props.h.css(),
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
