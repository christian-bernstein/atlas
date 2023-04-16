import React from "react";
import {DescriptiveTypography} from "../triton/components/typography/DescriptiveTypography";

export type MetaDisplayProps = {
    metadata: string
}

export const MetaDisplay: React.FC<MetaDisplayProps> = props => {
    let meta = undefined;

    const entries: Array<{ key: string, value: string }> = [];

    try {
        meta = JSON.parse(props.metadata);
        Object.entries(meta).forEach(entry => {
            entries.push({
                key: entry[0],
                value: entry[1] as string
            })
        })
    } catch (e) {
        console.error(e);
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: ".5rem"
        }}>
            {
                entries.map(entry => (
                    <div key={entry.key} style={{
                        display: "grid",
                        gridTemplateColumns: "min-content auto",
                        gap: "4px"
                    }}>
                        <DescriptiveTypography text={`${entry.key}:`} style={{
                            fontWeight: "bold"
                        }}/>
                        <DescriptiveTypography text={String(entry.value)} style={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            width: "calc(100% - 0px)"
                        }}/>
                    </div>
                ))
            }
        </div>
    );
}
