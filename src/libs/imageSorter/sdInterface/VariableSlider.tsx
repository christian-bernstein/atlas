import React from "react";
import {FormElement} from "../../triton/components/forms/FormElement";
import {Slider} from "@mui/material";
import {IconButton} from "../IconButton";
import {InfoRounded, RefreshRounded} from "@mui/icons-material";
import {Formik} from "formik";
import styled from "styled-components";
import {Menu} from "../Menu";
import {MenuButton} from "../MenuButton";

export const StyledVariableSlider = styled.div`  
  .number-input {
    border: none;
    border-radius: 8px;
    background-color: #101016;
    height: 32px;
    outline: none;
    text-align: center;
    font-family: Consolas, "Courier New", monospace;
    color: white;
  }
`;

export type VariableSliderProps = {
    title?: string,
    shortInfoText?: string,
    minVal?: number,
    maxVal?: number,
    value?: number,
    defaultValue?: number
}

export const VariableSlider: React.FC<VariableSliderProps> = props => {
    return (
        <StyledVariableSlider>
            <Formik initialValues={{
                samplingSteps: 50
            }} onSubmit={values => {}}>
                {
                    fp => (
                        <FormElement title={"Sampling steps"}>
                            <div style={{
                                flexDirection: "row",
                                alignItems: "center",
                                display: "flex",
                                width: "100%",
                                gap: "8px",
                            }}>
                                <div style={{
                                    backgroundColor: "#101016",
                                    flexDirection: "row",
                                    borderRadius: "8px",
                                    alignItems: "center",
                                    display: "flex",
                                    padding: "8px",
                                    height: "32px",
                                    width: "100%"
                                }}>
                                    <Slider
                                        onChange={(event, value) => fp.setFieldValue("samplingSteps", value)}
                                        value={fp.values.samplingSteps}
                                        valueLabelDisplay={"auto"}
                                        sx={{ color: "#5028c8" }}
                                        size={"small"}
                                        // marks={[
                                        //     { value: 50, label: <DescriptiveTypography text={"default"}/> },
                                        //     { value: 0, label: <DescriptiveTypography text={"0"}/> },
                                        //     { value: 100, label: <DescriptiveTypography text={"100"}/> }
                                        // ]}
                                    />
                                </div>


                                <input className={"number-input"} value={fp.values.samplingSteps} inputMode={"numeric"} min={0} max={100} type={"number"} step={1} onChange={event => {
                                    fp.setFieldValue("samplingSteps", event.currentTarget.value)
                                }}/>
                                <IconButton tooltip={"Reset"} size={"small"} onClick={() => fp.setFieldValue("samplingSteps", 50)} children={
                                    <RefreshRounded/>
                                }/>
                                <IconButton size={"small"} onClick={() => fp.setFieldValue("samplingSteps", 50)} children={
                                    <InfoRounded/>
                                }/>
                                <Menu>
                                    <MenuButton text={"Full documentation"} icon={<InfoRounded/>}/>
                                </Menu>
                            </div>
                        </FormElement>
                    )
                }
            </Formik>
        </StyledVariableSlider>

    );
}
