import React, {useContext} from "react";
import {v4} from "uuid";
import {Modal} from "../triton/components/dialogs/Modal";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {ErrorMessage} from "../triton/components/forms/ErrorMessage";
import {FormikTextArea} from "../triton/components/forms/FormikTextArea";
import {ButtonBase, ButtonVariant} from "../triton/components/buttons/ButtonBase";
import {BooleanContext} from "../test/BooleanContext";
import {Formik} from "formik";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {TagListConfigurator} from "./TagListConfigurator";
import {px} from "../base/logic/style/DimensionalMeasured";

export const ProjectCreationDialog: React.FC = props => {
    const api = useContext(ImageSorterAPIContext);

    return (
        <Formik
            initialValues={{
                title: "",
                prompt: "",
                negativePrompt: "",
                tags: new Array<string>(),
                tagPrompt: "",
                description: ""
            }}
            validate={values => {
                const errors: Partial<typeof values> = {};
                if (values.title.trim().length === 0) errors.title = "Project title is required";
                return errors;
            }}
            onSubmit={(values, formikHelpers) => {
                setTimeout(async () => {
                    await api.createProject({
                        title: values.title,
                        meta: "{}",
                        resources: [],
                        tags: values.tags ?? [],
                        id: v4(),
                        description: values.description
                    });
                    formikHelpers.setSubmitting(false);
                    api.toggleProjectCreationDialog(false);
                }, 1e3);
            }}
            children={formikProps => {
                return (
                    <Modal
                        title={"Create project"}
                        preventClosingMasterSwitch
                        open={api.state.isProjectCreationDialogOpened}
                        onClose={() => api.toggleProjectCreationDialog(false)}
                        onSubmit={(e) => {
                            formikProps.handleSubmit(e);
                        }}
                        children={
                            <div style={{
                                display: "grid",
                                gap: "8px"
                            }}>
                                {/* TITLE */}
                                <FormElement title={"Project title"} children={
                                    <>
                                        <FormikSingleLineInput autoFocus formikProps={formikProps} name={"title"}/>
                                        <ErrorMessage formikProps={formikProps} name={"title"}/>
                                    </>
                                }/>

                                <TagListConfigurator formik={formikProps}/>

                                {/* DESCRIPTION */}
                                <FormElement title={"Description"} children={
                                    <>
                                        <FormikTextArea h={px(80)} formikProps={formikProps} name={"description"}/>
                                        <ErrorMessage formikProps={formikProps} name={"description"}/>
                                    </>
                                }/>

                                {/* PROMPT */}
                                <FormElement title={"Prompt"} children={
                                    <>
                                        <FormikTextArea formikProps={formikProps} name={"prompt"}/>
                                        <ErrorMessage formikProps={formikProps} name={"prompt"}/>
                                    </>
                                }/>

                                {/* NEGATIVE PROMPT */}
                                <FormElement title={"Negative prompt"} children={
                                    <>
                                        <FormikTextArea formikProps={formikProps} name={"negativePrompt"} h={px(70)}/>
                                        <ErrorMessage formikProps={formikProps} name={"negativePrompt"}/>
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
                                                        api.toggleProjectCreationDialog(false);
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
                                                    api.setState(prevState => ({
                                                        ...prevState,
                                                        isProjectCreationDialogOpened: false
                                                    }));
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
