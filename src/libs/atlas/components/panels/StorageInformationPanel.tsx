import React from "react";
import ReactApexChart from "react-apexcharts";
import {utilizeGlobalTheme} from "../../../base/logic/app/App";

export type StorageInformationPanelEntry = {
    occurrences: number,
    title: string,
}

export type StorageInformationPanelProps = {
    series: Array<StorageInformationPanelEntry>
}

export const StorageInformationPanel: React.FC<StorageInformationPanelProps> = props => {
    return (
        <ReactApexChart type={"donut"} series={props.series.map(i => i.occurrences)} options={{
            chart: {
                type: 'donut',
            },
            labels: props.series.map(i => i.title),
            dataLabels: {
                enabled: false
            },
            legend: {
                position: "bottom"
            },
            plotOptions: {
                pie: {
                    startAngle: -90,
                    endAngle: 90,
                    offsetY: 10
                }
            },
            stroke: {
                width: 5,
                colors: [utilizeGlobalTheme().colors.backgroundColor.css()]
            },
            grid: {
                padding: {
                    bottom: -120
                }
            }
        }}/>
    );
}
