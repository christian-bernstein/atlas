import React, {CSSProperties, PropsWithChildren, useEffect, useRef, useState} from "react";

export type DynamicContainerProps = PropsWithChildren<{
    className?: string,
    style?: CSSProperties,

}>

export function DynamicVerticalContainer(props: DynamicContainerProps) {
    const content = useRef<HTMLDivElement>(null);
    const [rect, setRect] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setRect(content.current!.getBoundingClientRect());
    }, [props.children]); // Only update dimension when children change

    return (
        <div
            className={props.className}
            style={{
                transition: "0.3s",
                height: `${rect.height}px`,
                width: "100%",
                // width: `${rect.width}px`,
                overflow: "hidden",
                ...props.style
            }}
        >
            {/* The inter container for calculating the content dimension*/}
            <div
                ref={content}
                style={{
                    width: "100%",
                    // width: "fit-content",
                    height: "fit-content"
                }}
            >
                {props.children}
            </div>
        </div>
    );
}
