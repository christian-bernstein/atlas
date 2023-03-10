import {BC} from "../../base/BernieComponent";
import {Themeable} from "../../base/logic/style/Themeable";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Color} from "../../base/logic/style/Color";
import {FormDataHub} from "../../base/FormDataHub";
import {FormElement} from "../../base/FormElement";
import {Group} from "../../base/components/base/Group";
import {percent, px} from "../../base/logic/style/DimensionalMeasured";
import {Orientation} from "../../base/logic/style/Orientation";
import {Button} from "../../base/components/base/Button";
import {Flex} from "../../base/components/base/FlexBox";
import {Align} from "../../base/logic/style/Align";
import {Justify} from "../../base/logic/style/Justify";
import {Tooltip} from "../../base/components/base/Tooltip";
import {Icon} from "../../base/components/base/Icon";
import {ReactComponent as ResetIcon} from "../../../assets/icons/ic-20/ic20-refresh.svg";
import {Box} from "../../base/components/base/Box";
import {Text} from "../../base/components/base/Text";
import {ReactComponent as EditIcon} from "../../../assets/icons/ic-20/ic20-edit.svg";
import {StaticDrawerMenu} from "../../base/components/base/StaticDrawerMenu";
import {ColorSelectorDialog} from "./ColorSelectorDialog";
import React from "react";
import {getOr} from "../../base/Utils";
import {v4} from "uuid";

export type ColorInputProps = {
    id: string
    title: string
    description: string
    initialValue?: Color
    fdh: FormDataHub,
    controller: BC<any, any, any>,
    channels?: Array<string>,
    rerenderOnChange?: boolean
}

export class ColorInput extends BC<ColorInputProps, any, any> {

    private localID: string = v4();

    constructor(props: ColorInputProps) {
        super(props, undefined, undefined);
    }

    private onChangeRerender() {
        if (getOr(this.props.rerenderOnChange, true)) {
            this.props.controller.rerender(this.localID, ...getOr(this.props.channels, []));
        }
    }

    componentRender(p: ColorInputProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return p.controller.component(local => (
            <FormElement
                id={p.id}
                title={p.title}
                description={p.description}
                initialValue={p.initialValue}
                fdh={p.fdh}
                inputGenerator={(onChange, value, valid) => (
                    <Group removeChildBorders width={percent(100)} orientation={Orientation.HORIZONTAL} elements={[
                        <Button height={percent(100)} width={px(50)} border={false} highlight={false} children={
                            <Flex fh fw align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                <Tooltip sx={{ height: "100%", width: "100%"}} title={"Reset color"} arrow children={
                                    <Icon icon={<ResetIcon/>}/>
                                }/>
                            ]}/>
                        } onClick={() => {
                            onChange(undefined);
                            this.onChangeRerender();
                        }}/>,

                        <Box width={percent(100)} style={{ position: "relative" }} height={percent(100)} bgColor={value === undefined ? undefined : Color.ofHex(value)} children={
                            <Flex style={{ position: "absolute", top: 0, left: 0}} fh fw align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                value === undefined ? <Text text={"none"} uppercase/> : <></>
                            ]}/>
                        }/>,

                        <Button height={percent(100)} width={px(50)} border={false} highlight={false} children={
                            <Flex fh fw align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                <Tooltip sx={{ height: "100%", width: "100%"}} title={"Open editor"} arrow children={
                                    <Icon icon={<EditIcon/>}/>
                                }/>
                            ]}/>
                        } onClick={() => {
                            this.dialog(
                                <StaticDrawerMenu body={() => (
                                    <ColorSelectorDialog hex={value === undefined ? "000000" : value} onSubmit={hex => {
                                        onChange(hex);
                                        this.closeLocalDialog();
                                        this.onChangeRerender();
                                    }}/>
                                )}/>
                            );
                        }}/>,
                    ]}/>
                )}
            />
        ), this.localID, ...getOr(p.channels, []));
    }
}
