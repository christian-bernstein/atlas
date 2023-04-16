import React, {useMemo, useRef} from "react";
import {Orientation} from "../base/logic/style/Orientation";
import {DimensionalMeasured} from "../base/logic/style/DimensionalMeasured";
import {TimeMeasured} from "../base/logic/misc/TimeMeasured";
import {v4} from "uuid";
import {MainTypography} from "../triton/components/typography/MainTypography";

export const Speedometer: React.FC<{
    val?: number,
    orientation?: Orientation,
    width?: DimensionalMeasured,
    cap?: number,
    transitionDelay?: TimeMeasured,
    transition?: TimeMeasured,
    ease?: boolean
}> = props => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const id = useMemo(() => `id-${v4()}`, []);
    const barId = useMemo(() => `id-${v4()}`, []);
    const wrapperId = useMemo(() => `id-${v4()}`, []);
    const orientation = props.orientation ?? Orientation.HORIZONTAL;
    const vertica = orientation === Orientation.VERTICAL;
    const fracDigits = 0;

    const data = useRef<{
        interval?: NodeJS.Timer,
        val: number
    }>({
        val: props.val ?? 0
    });


    React.useEffect(() => {
        barRef.current?.addEventListener("transitionstart", () => {

            data.current.interval = setInterval(() => {
                const byId = document.getElementById(id);
                const byBarId = document.getElementById(barId);
                const byWrapperId = document.getElementById(wrapperId);
                if (!byId || !byBarId || !byWrapperId) return;

                const num = byBarId.getBoundingClientRect()[vertica ? "height" : "width"];
                const wrapperNum = byWrapperId.getBoundingClientRect()[vertica ? "height" : "width"];

                data.current.val = num / wrapperNum * 100;
                byId.innerText = String((data.current.val).toFixed(fracDigits));
            }, 100);
        });

        barRef.current?.addEventListener("transitionend", () => {
            clearInterval(data.current.interval)
        });
    }, [barRef, id, barId, wrapperId, vertica]);


    return (
        <div id={wrapperId} ref={wrapperRef} style={{
            height: vertica ? "100%" : (props.width === undefined ? "32px" : props.width.css()),
            width: vertica ? (props.width === undefined ? "32px" : props.width.css()) : "100%",
            backgroundColor: "rgb(1, 4, 9)",
            position: "relative",
            boxShadow: "0 0 0 1px rgb(33, 38, 45)",
            borderRadius: "8px",
            overflow: "hidden"
        }}>
            <span id={barId} ref={barRef} style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: vertica ? "100%" : `${props.val}%`,
                height: vertica ? `${props.val}%` : "100%",
                transition: `${props.transition?.css() ?? "2s"} ${props.ease ?? true ? "ease-in-out" : ""}`,
                transitionDelay: props.transitionDelay?.css() ?? ".5s",
                backgroundColor: "rgba(31, 111, 235, 0.08)",
                boxShadow: "0 0 0 1px #1f6feb",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#58a6ff"
            }}/>
            <span style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }} children={
                // (data.current.val / cap * 100)
                // data.current.val
                <MainTypography id={id} text={String((data.current.val).toFixed(fracDigits))} style={{
                    color: "#58a6ff"
                }}/>
            }/>
        </div>
    );
}
