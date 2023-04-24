import React from "react";
import {Formik} from "formik";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {StyleDataCardPreview} from "./StyleDataCardPreview";
import {useLiveQuery} from "dexie-react-hooks";
import {isaDB} from "./ImageSorterAppDB";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";

export const StyleLibraryView: React.FC = props => {
    const styles = useLiveQuery(() => {
        return isaDB.styles.toArray()
    });

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

            { styles !== undefined && (
                <TransitionGroup children={
                    styles.map(style => (
                        <Collapse key={style.id} children={
                            <StyleDataCardPreview data={style}/>
                        }/>
                    ))
                }/>
            ) }

            { (styles === undefined || styles.length === 0) && (
                <DescriptiveTypography text={"No styles"}/>
            ) }
        </div>
    );
}
