import {Program} from "./Program";
import {LocatableProgram} from "./LocatableProgram";
import {Screen} from "../libs/sql/components/lo/Page";
import {AppPageMode} from "../libs/sql/pages/app/AppPageMode";
import {getOr} from "../libs/sql/logic/Utils";
import {AppPage} from "../libs/sql/pages/app/AppPage";
import {AnalyticsManager} from "./AnalyticsManager";

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
         */
        this.programRegistry.set("main", {
            path: "/",
            exact: true,
            render: () => (
                // TODO: Add main page
                <></>
            )
        });

        /**
         * Unit test website
         */
        this.programRegistry.set("unit", {
            path: "/unit",
            render: () => (
                <AppPage
                    mode={AppPageMode.UNIT_TEST}
                />
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
