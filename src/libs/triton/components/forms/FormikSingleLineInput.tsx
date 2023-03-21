import {FormikInput} from "./FormikInput";
import {FormikProps} from "formik";
import React, {ButtonHTMLAttributes, InputHTMLAttributes} from "react";

export function FormikSingleLineInput(props: {
    name: string,
    formikProps: FormikProps<any>,
    autoFocus?: boolean,
    renderError?: boolean,
    placeholder?: string,
    baseProps?: InputHTMLAttributes<any>,
}): JSX.Element {
    return (
        <FormikInput className={(props.formikProps.errors[props.name] && props.formikProps.touched[props.name] && (props.renderError ?? true)) ? "error" : ""} children={
            // TODO: Remove or reactivate -> Depends on onBlur 'problem'
            // <Field class={"input"} name={props.name}/>

            <input
                {...props.baseProps}
                autoFocus={props.autoFocus}
                className={"input"}
                placeholder={props.placeholder}
                name={props.name}
                autoComplete={"off"}
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
