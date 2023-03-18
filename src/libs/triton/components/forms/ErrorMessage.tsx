import React from "react";
import Collapse from "@mui/material/Collapse";
import {WarningRounded} from "@mui/icons-material";
import {DescriptiveTypography} from "../typography/DescriptiveTypography";
import {TransitionGroup} from "react-transition-group";
import {FormikProps} from "formik";

export type ErrorMessageProps = {
    formikProps: FormikProps<any>,
    name: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = props => {
    return (
        <TransitionGroup>
            { props.formikProps.errors[props.name] && props.formikProps.touched[props.name] && (
                <Collapse key={"title-error-message-collapse"} children={
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "4px"
                    }}>
                        <WarningRounded sx={{
                            width: "14px",
                            height: "14px",
                            color: "rgb(248, 81, 73)"
                        }}/>
                        <DescriptiveTypography text={props.formikProps.errors[props.name] as string} style={{
                            color: "rgb(248, 81, 73)",
                            fontSize: "12px",
                            fontWeight: 600
                        }}/>
                    </div>
                }/>
            ) }
        </TransitionGroup>
    );
}
