import {FC} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Driver} from "../Driver";
import {LocatableProgram} from "../LocatableProgram";

export const DriverReactBridge: FC = (props, context) => {
    return (
        <BrowserRouter children={
            <Routes children={
                Array.from(Driver.programRegistry.entries()).map(([id, program]: [string, LocatableProgram]) => (
                    <Route
                        key={id}
                        // TODO: Equivalent available?
                        // exact={program.exact ?? true}
                        // TODO: path can be []... why tho..
                        path={program.path as string}
                        element={program.render()}
                    />
                ))
            }/>
        }/>
    );
}
