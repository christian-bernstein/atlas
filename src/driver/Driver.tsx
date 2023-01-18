import {Program} from "./Program";
import {LocatableProgram} from "./LocatableProgram";
import {AnalyticsManager} from "./AnalyticsManager";
import {InDevAtlasAPI} from "../libs/atlas/api/InDevAtlasAPI";
import {AtlasMain} from "../libs/atlas/AtlasMain";
import React from "react";
import {Dot} from "../libs/sql/components/lo/Dot";

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

        /**
         * Root website, this is the portfolio website
         * <AtlasMain api={new InDevAtlasAPI()}/>
         */
        this.programRegistry.set("main", {
            path: "/",
            exact: true,
            render: () => (
                <Dot/>
            )
        });

        this.registerGlobal404Page({
            render: () => (
                // TODO: Add 404 page
                <></>
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
