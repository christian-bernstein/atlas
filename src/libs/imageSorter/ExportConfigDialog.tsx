import React, {useContext} from "react";
import {Modal} from "../triton/components/dialogs/Modal";
import {TagListConfigurator} from "./TagListConfigurator";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {Formik} from "formik";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {ErrorMessage} from "../triton/components/forms/ErrorMessage";
import {FormikTextArea} from "../triton/components/forms/FormikTextArea";
import {px} from "../base/logic/style/DimensionalMeasured";
import {Checkbox} from "@mui/material";
import {FormikFormCheckbox} from "./FormikFormCheckbox";
import {ImageSorterAPIContext} from "./ImageSorterAPI";

export type ExportConfigDialogProps = {
    open: boolean,
    onClose: () => void
}

export const ExportConfigDialog: React.FC<ExportConfigDialogProps> = props => {
    const api = useContext(ImageSorterAPIContext);

    return (
        <Formik
            initialValues={{
                fileName: "",
                removeMeta: true,
                applySubmittedTag: true
            }}
            onSubmit={(values) => {
                api.exportManager.exportImages({
                    applySubmittedTag: values.applySubmittedTag,
                    fileTitle: values.fileName,
                    removeMetadata: values.removeMeta,
                    selectedImages: api.state.selectedImages
                });
            }}
            children={formikProps => {
                return (
                    <Modal
                        title={"Prepare submission"}
                        open={props.open}
                        onClose={() => props.onClose()}
                        onSubmit={(e) => formikProps.handleSubmit(e)}
                        children={
                            <div style={{
                                display: "grid",
                                gap: "8px"
                            }}>
                                <FormElement title={"Filename"} children={
                                    <>
                                        <FormikSingleLineInput autoFocus formikProps={formikProps} name={"fileName"}/>
                                        <ErrorMessage formikProps={formikProps} name={"fileName"}/>
                                    </>
                                }/>

                                <FormikFormCheckbox
                                    formik={formikProps}
                                    name={"removeMeta"}
                                    title={"Remove metadata"}
                                    helpText={"Removes the exif metadata from all png files"}
                                />

                                <FormikFormCheckbox
                                    formik={formikProps}
                                    name={"applySubmittedTag"}
                                    title={"Apply submitted tag"}
                                    helpText={"Applies the 'submitted'-tag to all submitted images"}
                                />
                            </div>
                        }
                        footer={
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "8px",
                                width: "100%"
                            }}>
                                <ButtonBase text={"Submit"} baseProps={{
                                    type: "button",
                                    onClick: (e) => formikProps.handleSubmit(e)
                                }}/>
                                <ButtonBase text={"Cancel"} baseProps={{
                                    type: "button",
                                    onClick: () => props.onClose()
                                }}/>
                            </div>
                        }
                    />
                );
            }
        }/>
    );
}
