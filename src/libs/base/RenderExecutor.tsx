import React from "react";
import {getOr} from "./Utils";
import {RenderExecutorProps} from "./RenderExecutorProps";

export class RenderExecutor extends React.Component<RenderExecutorProps> {

    componentDidMount() {
        this.props.componentDidMountRelay({
            rerenderHook: () => {
                this.forceUpdate();
            },
            channels: getOr(this.props.channels, []),
            id: this.props.id
        })
    }

    componentWillUnmount() {
        this.props.upstreamOnComponentUnmountHandler?.(this.props.id);
    }

    render() {
        return (
            <>
                {this.props.componentFactory()}
                {this.props.children}
            </>
        );
    }
}
