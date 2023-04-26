import React from "react";
import {FormElement} from "../../triton/components/forms/FormElement";
import {Slider} from "@mui/material";
import {DescriptiveTypography} from "../../triton/components/typography/DescriptiveTypography";
import {IconButton} from "../IconButton";
import {RefreshRounded} from "@mui/icons-material";
import {Formik} from "formik";

export const GenerationConfigTab: React.FC = props => {

    return (
        <>
            <Formik initialValues={{
                samplingSteps: 50
            }} onSubmit={values => {}}>
                {
                    fp => (
                        <FormElement title={"Sampling steps"}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "8px",
                                width: "100%",
                            }}>
                                <Slider
                                    size={"small"}
                                    valueLabelDisplay={"auto"}
                                    value={fp.values.samplingSteps}
                                    onChange={(event, value) => fp.setFieldValue("samplingSteps", value)}
                                    color={"secondary"}
                                    marks={[
                                        { value: 50, label: <DescriptiveTypography text={"default"}/> },
                                        { value: 0, label: <DescriptiveTypography text={"0"}/> },
                                        { value: 100, label: <DescriptiveTypography text={"100"}/> }
                                    ]}
                                />
                                <input value={fp.values.samplingSteps} inputMode={"numeric"} min={0} max={100} type={"number"} step={1} onChange={event => {
                                    fp.setFieldValue("samplingSteps", event.currentTarget.value)
                                }}/>
                                <IconButton size={"small"} onClick={() => fp.setFieldValue("samplingSteps", 50)} children={
                                    <RefreshRounded/>
                                }/>
                            </div>
                        </FormElement>
                    )
                }
            </Formik>
        </>
    );
}
