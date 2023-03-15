import {Program} from "./Program";
import {LocatableProgram} from "./LocatableProgram";
import {AnalyticsManager} from "./AnalyticsManager";
import React from "react";
import {InDevAtlasAPI} from "../libs/atlas/api/InDevAtlasAPI";
import {AtlasMain} from "../libs/atlas/AtlasMain";
import {Screen} from "../libs/base/components/base/Page";
import {DnDTestMain} from "../libs/dnd/DnDTestMain";
import {TestScreen} from "../libs/test/TestScreen";

export class Driver {

    public static readonly programRegistry: Map<string, LocatableProgram> = new Map<string, LocatableProgram>();

    public static readonly ERROR_404_PROGRAM_ID = "err_404"

    private static singleton: Driver | undefined  = undefined;

    public readonly analyticsManager: AnalyticsManager = new AnalyticsManager();

    public static driver(): Driver {
        if (Driver.singleton === undefined) {
            Driver.singleton = new Driver();
        }
        return Driver.singleton;
    }

    public static boot(): void {

        // TODO: Add again
        // console.warn = () => {}

        /**
         * Root website, this is the portfolio website
         * <AtlasMain api={new InDevAtlasAPI()}/>
         */
        this.programRegistry.set("main", {
            path: "/",
            exact: true,
            render: () => (
                <Screen children={
                    <AtlasMain api={new InDevAtlasAPI()}/>
                }/>
            )
        });

        this.programRegistry.set("test", {
            path: "test/",
            exact: true,
            render: () => (
                <TestScreen/>
            )
        });

        this.programRegistry.set("dnd", {
            path: "dnd/",
            exact: true,
            render: () => (
                <Screen children={
                    <DnDTestMain/>
                }/>
            )
        });

        this.registerGlobal404Page({
            render: () => (
                // TODO: Add 404 page
                <Screen children={
                    <AtlasMain api={new InDevAtlasAPI()}/>
                }/>
            )
        });
    }

    public static registerGlobal404Page(program: Program): void {
        this.programRegistry.set(this.ERROR_404_PROGRAM_ID, {
            ...program,
            path: "*",
        });
    }
}

export function driver(): Driver {
    return Driver.driver();
}

export function withDriver(action: (driver: Driver) => void): Driver {
    const d = Driver.driver();
    action(d);
    return d;
}
