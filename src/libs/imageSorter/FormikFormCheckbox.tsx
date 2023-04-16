import React from "react";
import {Checkbox} from "@mui/material";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {ErrorMessage} from "../triton/components/forms/ErrorMessage";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikProps} from "formik";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {HelpRounded} from "@mui/icons-material";
import {HelpHint} from "./HelpHint";

export type FormCheckboxProps = {
    formik: FormikProps<any>,
    helpText?: string,
    title: string,
    name: string
}

export const FormikFormCheckbox: React.FC<FormCheckboxProps> = props => {

    return (
        <div style={{
            display: "flex",
            gap: "4px"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px"
            }}>
                <Checkbox sx={{
                    padding: "4px",
                    color: "rgb(139, 148, 158)",
                    '&.Mui-checked': {
                        color: "#5028c8",
                    },
                }} defaultChecked={props.formik.values[props.name] ?? false} onChange={(event, checked) => {
                    props.formik.setFieldValue(props.name, checked);
                }}/>
                <MainTypography style={{ userSelect: "none" }} text={props.title}/>
                <HelpHint text={props.helpText}/>
            </div>
            <ErrorMessage formikProps={props.formik} name={props.name}/>
        </div>

    );
}
