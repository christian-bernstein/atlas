import {FormikInput} from "./FormikInput";
import {FormikProps} from "formik";
import React, {InputHTMLAttributes} from "react";

export type FormikSingleLineInputProps = {
    name: string,
    formikProps: FormikProps<any>,
    autoFocus?: boolean,
    renderError?: boolean,
    placeholder?: string,
    baseProps?: InputHTMLAttributes<any>,
}

export const FormikSingleLineInput: React.ForwardRefExoticComponent<React.PropsWithoutRef<FormikSingleLineInputProps> & React.RefAttributes<unknown>> = React.forwardRef((props: FormikSingleLineInputProps, ref) => {
    return (
        <FormikInput className={(props.formikProps.errors[props.name] && props.formikProps.touched[props.name] && (props.renderError ?? true)) ? "error" : ""} children={
            <input
                ref={ref as any}
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
})
