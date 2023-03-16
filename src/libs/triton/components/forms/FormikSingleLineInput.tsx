import {FormikInput} from "./FormikInput";
import {FormikProps} from "formik";
import React from "react";

export function FormikSingleLineInput(props: {
    name: string,
    formikProps: FormikProps<any>
}): JSX.Element {
    return (
        <FormikInput children={
            // TODO: Remove or reactivate -> Depends on onBlur 'problem'
            // <Field class={"input"} name={props.name}/>

            <input
                className={"input"}
                name="title"
                onChange={props.formikProps.handleChange}
                value={props.formikProps.values.title}
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
