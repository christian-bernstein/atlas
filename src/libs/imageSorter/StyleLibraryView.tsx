import React from "react";
import {Formik} from "formik";
import {BasicSingleSelect} from "../triton/components/forms/BasicSingleSelect";
import {FormikInput} from "../triton/components/forms/FormikInput";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {StyleDataCardPreview} from "./StyleDataCardPreview";

export const StyleLibraryView: React.FC = props => {

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflowY: "scroll",
            overflowX: "hidden",
            width: "100%"
        }}>
            <Formik initialValues={{}} onSubmit={values => {}} children={fp => (
                <FormikSingleLineInput name={"search"} formikProps={fp}/>
            )}/>

            <StyleDataCardPreview/>
            <StyleDataCardPreview/>
        </div>
    );
}
