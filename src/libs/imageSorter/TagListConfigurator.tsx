import React, {useState} from "react";
import {FormikSingleLineInput} from "../triton/components/forms/FormikSingleLineInput";
import {FormikProps} from "formik";
import {IconButton} from "./IconButton";
import {AddRounded, ClearRounded, DeleteRounded} from "@mui/icons-material";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";

export type TagListConfiguratorProps = {
    formik: FormikProps<any>
}

export const TagListConfigurator: React.FC<TagListConfiguratorProps> = props => {
    const flushTagPrompt = () => {
        const newTags = [...props.formik.values.tags as string[]];
        const tagPrompt = props.formik.values.tagPrompt as string;
        newTags.push(...tagPrompt
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
        );
        props.formik.setFieldValue("tags", Array.from(new Set(newTags)));
        props.formik.setFieldValue("tagPrompt", "");
    };

    return (
        <div style={{
            display: "grid",
            rowGap: "8px",
            alignItems: "center",
            width: "100%"
        }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "auto min-content",
                alignItems: "center",
                width: "100%"
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "auto min-content",
                    columnGap: "8px",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <FormikSingleLineInput baseProps={{
                        onKeyDown: event => {
                            if (event.key === "Enter") {
                                flushTagPrompt();
                            }
                        }
                    }} placeholder={"tag1, tag2, tag3.."} formikProps={props.formik} name={"tagPrompt"}/>

                    <IconButton tooltip={"Add"} size={"small"} children={<AddRounded/>} onClick={() => {
                        flushTagPrompt();
                    }}/>
                </div>

                <TransitionGroup>
                    { ((props.formik.values.tags as Array<string>).length > 0) ? (
                        <Collapse sx={{
                            marginLeft: "8px"
                        }} orientation={"horizontal"} key={"clear-icon"}>
                            <IconButton tooltip={"Clear"} size={"small"} children={<ClearRounded/>} onClick={() => {
                                props.formik.setFieldValue("tags", []);
                            }}/>
                        </Collapse>
                    ) : (
                        <></>
                    )}
                </TransitionGroup>
            </div>


            <div style={{
                display: "grid",
                rowGap: "8px",
                width: "100%"
            }}>
                <TransitionGroup>
                    { (props.formik.values.tags as Array<string>).map(tag => (
                        <Collapse key={tag}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "auto min-content",
                                columnGap: "8px",
                                alignItems: "center",
                                width: "100%",
                                margin: "2px 0"
                            }}>
                                <DescriptiveTypography text={tag}/>
                                <IconButton size={"small"} children={<DeleteRounded/>} onClick={() => {
                                    props.formik.setFieldValue(
                                        "tags",
                                        (props.formik.values.tags as string[]).filter(lTag => lTag !== tag)
                                    );
                                }}/>
                            </div>
                        </Collapse>
                    )) }
                </TransitionGroup>

            </div>
        </div>
    );
}
