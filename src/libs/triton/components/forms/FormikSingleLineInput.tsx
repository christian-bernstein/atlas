import {FormikInput} from "./FormikInput";
import {FormikProps} from "formik";
import React from "react";

export function FormikSingleLineInput(props: {
    name: string,
    formikProps: FormikProps<any>,
    autoFocus?: boolean,
    renderError?: boolean
}): JSX.Element {
    return (
        <FormikInput className={(props.formikProps.errors[props.name] && props.formikProps.touched[props.name] && (props.renderError ?? true)) ? "error" : ""} children={
            // TODO: Remove or reactivate -> Depends on onBlur 'problem'
            // <Field class={"input"} name={props.name}/>

            <input
                autoFocus={props.autoFocus}
                className={"input"}
                name={props.name}
                onChange={props.formikProps.handleChange}
                value={props.formikProps.values[props.name]}
                onBlur={event => {
                    // TODO: Investigate double-click to submit
                    // TODO: Check importance of calling formik's handleBlur
                    // formikProps.handleBlur(event)

                    event.preventDefault();
                    event.stopPropagation();
                }}
            />
        }/>
    );
}
