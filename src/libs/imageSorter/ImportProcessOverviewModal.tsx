import React, {useEffect, useRef, useState} from "react";
import {DuplexEventRelay} from "./DuplexEventRelay";
import {Modal} from "../triton/components/dialogs/Modal";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";
import {LinearProgress, linearProgressClasses } from "@mui/material";
import {ButtonBase} from "../triton/components/buttons/ButtonBase";
import {DynamicVerticalContainer} from "./DynamicVerticalContainer";

export const ImportProcessOverviewModal: React.FC<{
    der: DuplexEventRelay,
    open: boolean,
    onClose: () => void,
    expectedImageCount: number
}> = props => {
    const [state, setState] = useState<{
        eventCount: number,
        imagesSuccessfullyImportedCount: number,
        startTimeStamp: number,
        finishTimeStamp: number | undefined,
        finished: boolean,
        imagesImportedPerSecond: number,
        imagesImportedPerSecondDelta: number,
        stateString: string,
        finishEventData: any
    }>({
        eventCount: 0,
        imagesSuccessfullyImportedCount: 0,
        startTimeStamp: Date.now(),
        finishTimeStamp: undefined,
        finished: false,
        imagesImportedPerSecond: 0,
        imagesImportedPerSecondDelta: 0,
        stateString: "Waiting",
        finishEventData: undefined
    });

    const percentage = state.imagesSuccessfullyImportedCount / props.expectedImageCount * 100;
    const date = new Date(0);
    date.setSeconds(0, Date.now() - state.startTimeStamp);
    const elapsedTimeString = date.toISOString().substring(11, 19);

    const data = useRef<{
        timer: NodeJS.Timer | undefined
    }>({
        timer: undefined
    });

    useEffect(() => {
        if (!state.finished) {
            data.current.timer = setInterval(() => {
                setState(prevState => ({
                    ...prevState,
                    imagesImportedPerSecond: prevState.imagesImportedPerSecondDelta,
                    imagesImportedPerSecondDelta: 0
                }));
            }, 1e3);
        }
    }, [state.finished]);

    useEffect(() => {
        props.der.registerEventHandler("image", event => {
            setState(prevState => ({
                ...prevState,
                imagesSuccessfullyImportedCount: prevState.imagesSuccessfullyImportedCount + 1,
                imagesImportedPerSecondDelta: prevState.imagesImportedPerSecondDelta + 1
            }));
        });

        props.der.registerEventHandler("update-state-title", event => {
            setState(prevState => ({
                ...prevState,
                stateString: event.data
            }));
        });

        props.der.registerEventHandler("finish", event => {
            console.log("Clearing interval")
            clearInterval(data.current.timer);
            setState(prevState => ({
                ...prevState,
                finished: true,
                finishEventData: event.data
            }));
        });
    }, [props.der]);

    const errorCount = state.finishEventData?.errorCount ?? 0;

    return (
        <Modal title={state.finished ? "Import finished" : `${state.stateString}`} preventClosingMasterSwitch={!state.finished} open={props.open} footer={
            state.finished ? (
                <DynamicVerticalContainer>
                    <div style={{
                        display: "grid",
                        width: "100%"
                    }}>
                        <ButtonBase text={"Close"} baseProps={{
                            type: "button",
                            onClick: () => {
                                props.onClose();
                            }
                        }}/>
                    </div>
                </DynamicVerticalContainer>
            ) : undefined
        } onClose={props.onClose}>
            {
                state.finished ? (
                    <div style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        gap: "8px"
                    }}>
                        { errorCount === 0 ? (
                            <DescriptiveTypography text={`Finished without errors`}/>
                        ) : (
                            <DescriptiveTypography text={`Finished with ${errorCount} error(s)`}/>
                        ) }

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "min-content auto",
                            gap: "4px"
                        }}>
                            <DescriptiveTypography text={"Processing time:"} style={{
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                            }}/>
                            <DescriptiveTypography text={elapsedTimeString} style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                width: "calc(100% - 0px)"
                            }}/>
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "min-content auto",
                            gap: "4px"
                        }}>
                            <DescriptiveTypography text={"Images imported:"} style={{
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                            }}/>
                            <DescriptiveTypography text={String(state.imagesSuccessfullyImportedCount)} style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                width: "calc(100% - 0px)"
                            }}/>
                        </div>

                        {/*
                        <DescriptiveTypography text={JSON.stringify(state.finishEventData, null, 4)}/>
                        */}

                    </div>
                ) : (
                    <div style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        gap: "8px"
                    }}>
                        <LinearProgress sx={{
                            borderRadius: "10px",
                            backgroundColor: "#101016",
                            [`& .${linearProgressClasses.bar}`]: {
                                backgroundColor: "#5028c8",
                                borderRadius: "10px"
                            }
                        }} variant={"determinate"} value={percentage}/>
                        <div style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexDirection: "row"
                        }}>
                            <DescriptiveTypography text={
                                `${state.imagesSuccessfullyImportedCount} / ${props.expectedImageCount} (${Math.floor(percentage)}%) (${elapsedTimeString})`
                            }/>
                            <DescriptiveTypography text={
                                `Processing (${state.imagesImportedPerSecond} images/sec)`
                            }/>
                        </div>
                    </div>
                )
            }
        </Modal>
    );
}
