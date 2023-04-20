import React, {useContext, useEffect, useState} from "react";
import {ImageSorterAPIContext} from "./ImageSorterAPI";
import {Formik} from "formik";
import {v4} from "uuid";
import {Modal} from "../triton/components/dialogs/Modal";
import {FormElement} from "../triton/components/forms/FormElement";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {ErrorMessage} from "../triton/components/forms/ErrorMessage";
import {TagListConfigurator} from "./TagListConfigurator";
import {FormikTextArea} from "../triton/components/forms/FormikTextArea";
import {px} from "../base/logic/style/DimensionalMeasured";
import {ButtonBase, ButtonVariant} from "../triton/components/buttons/ButtonBase";
import {BooleanContext} from "../test/BooleanContext";
import {Project} from "./Project";
import {CircleLoader} from "react-spinners";
import {CircularProgress} from "@mui/material";
import {IconButton} from "./IconButton";
import {MainTypography} from "../triton/components/typography/MainTypography";
import {DefaultButton} from "./DefaultButton";
import {EditRounded} from "@mui/icons-material";
import {isaDB} from "./ImageSorterAppDB";
import {ImagePreview} from "./ImagePreview";
import {ISAImage} from "./ISAImage";
import {AdvancedISAImage} from "./AdvancedISAImage";

export type ProjectEditDialogProps = {
    onSave: (project: Project) => void,
    onCancel: () => void,
    for: string,
    open: boolean
}

export const ProjectEditDialog: React.FC<ProjectEditDialogProps> = props => {
    const api = useContext(ImageSorterAPIContext);
    const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
    useEffect(() => {
        console.log("Trying to load project...")
        api.getCurrentProject().then(cp => {
            console.log("Project loaded")
            setCurrentProject(cp);
        });
    }, [api]);

    if (currentProject === undefined) {
        return (
            <Modal
                onClose={() => props.onCancel()}
                preventClosingOnBackdropClick
                title={"Loading..."}
                loading
                open
            />
        );
    }

    return (
        <Formik
            initialValues={{
                // TODO: set currentProject directly...
                title: currentProject.title,
                tags: currentProject.tags,
                description: currentProject.description ?? "",
                previewImageID: currentProject.previewImageID
            }}
            validate={values => {
                const errors: Partial<typeof values> = {};
                if (values.title.trim().length === 0) errors.title = "Project title is required";
                return errors;
            }}
            onSubmit={(values, formikHelpers) => {



                isaDB.projects.update(currentProject?.id!, values)
                formikHelpers.setSubmitting(false);

                // TODO: Actually call save method
                props.onCancel();
            }}
            children={formikProps => {
                return (
                    <Modal
                        title={"Edit project"}
                        preventClosingMasterSwitch
                        open
                        onClose={() => props.onCancel()}
                        onSubmit={(e) => {
                            formikProps.handleSubmit(e);
                        }}
                        children={
                            <div style={{
                                display: "grid",
                                gap: "8px"
                            }}>


                                { formikProps.values.previewImageID && (
                                    <ISAImage imageID={formikProps.values.previewImageID} imageRenderer={i => (
                                        <AdvancedISAImage image={i}/>
                                    )} />
                                ) }


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
                            </div>
                        }
                        footer={
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "8px",
                                width: "100%"
                            }}>

                                <ButtonBase text={"Save"} baseProps={{
                                    type: "button",
                                    onClick: (e) => {
                                        formikProps.handleSubmit(e)
                                    }
                                }}/>

                                <ButtonBase text={"Cancel"} baseProps={{
                                    type: "button",
                                    onClick: () => props.onCancel()
                                }}/>
                            </div>
                        }
                    />
                );
            }
            }/>
    );
}
