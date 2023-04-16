import React, {useContext} from "react";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {Modal} from "../triton/components/dialogs/Modal";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {ErrorMessage} from "../triton/components/forms/ErrorMessage";
import {ButtonBase, ButtonVariant} from "../triton/components/buttons/ButtonBase";
import {BooleanContext} from "../test/BooleanContext";
import {Formik} from "formik";

export const FolderSetupDialog: React.FC = props => {
    const api = useContext(ImageSorterAPIContext);

    return (
        <Formik
            initialValues={{
                title: "",
            }}
            validate={values => {
                const errors: Partial<typeof values> = {};
                if (values.title.trim().length === 0) errors.title = "Folder name is required";
                return errors;
            }}
            onSubmit={(values, formikHelpers) => {
                api.createFolder(values.title);
                formikHelpers.setSubmitting(false);
                api.toggleFolderCreationDialog(false);
            }}
            children={formikProps => {
                return (
                    <Modal
                        title={"Create folder"}
                        preventClosingMasterSwitch
                        open={api.state.isFolderCreationDialogOpened}
                        onClose={() => api.toggleFolderCreationDialog(false)}
                        onSubmit={(e) => {
                            formikProps.handleSubmit(e);
                        }}
                        children={
                            <div style={{
                                display: "grid",
                                gap: "8px"
                            }}>
                                <FormElement title={"Folder name"} children={
                                    <>
                                        <FormikSingleLineInput autoFocus formikProps={formikProps} name={"title"}/>
                                        <ErrorMessage formikProps={formikProps} name={"title"}/>
                                    </>
                                }/>
                            </div>
                        }
                        footer={
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "8px",
                                width: "100%"
                            }}>

                                <ButtonBase text={formikProps.isSubmitting ? "Processing.." : "Create"} baseProps={{
                                    type: "button",
                                    onClick: (e) => {
                                        formikProps.handleSubmit(e)
                                    }
                                }}/>

                                <BooleanContext children={(bool, setBool) => (
                                    <>
                                        <Modal open={bool} preventClosingOnBackdropClick onClose={() => { setBool(false) }} title={"Abort"}>
                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(2, 1fr)",
                                                gap: "8px"
                                            }}>
                                                <ButtonBase text={"Cancel"} baseProps={{
                                                    type: "button",
                                                    onClick: () => {
                                                        setBool(false);
                                                    }
                                                }}/>
                                                <ButtonBase text={"Abort"} variant={ButtonVariant.DANGER} baseProps={{
                                                    type: "button",
                                                    onClick: () => {
                                                        setBool(false);
                                                        api.toggleFolderCreationDialog(false);
                                                    }
                                                }}/>
                                            </div>
                                        </Modal>

                                        <ButtonBase text={"Cancel"} baseProps={{
                                            type: "button",
                                            onClick: () => {
                                                if (formikProps.dirty) {
                                                    setBool(true);
                                                } else {
                                                    api.toggleFolderCreationDialog(false);
                                                }
                                            }
                                        }}/>
                                    </>
                                )}/>
                            </div>
                        }
                    />
                );
            }
            }/>
    );
}
