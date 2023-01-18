import {BC} from "../../base/BernieComponent";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {FormDataHub} from "../../base/FormDataHub";
import {IconConfig} from "../data/IconConfig";
import {getOr} from "../../base/Utils";
import {v4} from "uuid";
import {FormElement} from "../../base/FormElement";
import {Group} from "../../sql/components/base/Group";
import {percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Orientation} from "../../sql/logic/style/Orientation";
import {Button} from "../../sql/components/base/Button";
import {Flex} from "../../sql/components/base/FlexBox";
import {Align} from "../../sql/logic/style/Align";
import {Justify} from "../../sql/logic/style/Justify";
import {Tooltip} from "../../sql/components/base/Tooltip";
import {Icon} from "../../sql/components/base/Icon";
import {ReactComponent as EditIcon} from "../../../assets/icons/ic-20/ic20-edit.svg";
import {StaticDrawerMenu} from "../../sql/components/base/StaticDrawerMenu";
import React from "react";
import {DrawerHeader} from "../../sql/components/base/DrawerHeader";

export type IconInputProps = {
    id: string
    title: string
    description: string
    initialValue?: IconConfig
    fdh: FormDataHub,
    controller: BC<any, any, any>,
    channels?: Array<string>,
    rerenderOnChange?: boolean
}

export class IconInput extends BC<IconInputProps, any, any> {

    private localID: string = v4();

    private onChangeRerender() {
        if (getOr(this.props.rerenderOnChange, true)) {
            this.props.controller.rerender(this.localID, ...getOr(this.props.channels, []));
        }
    }

    componentRender(p: IconInputProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
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
                                <Tooltip sx={{ height: "100%", width: "100%"}} title={"Open editor"} arrow children={
                                    <Icon icon={<EditIcon/>}/>
                                }/>
                            ]}/>
                        } onClick={() => {
                            this.dialog(
                                <StaticDrawerMenu body={props => (


                                    <Flex fw elements={[
                                        <DrawerHeader
                                            header={"Icon editor"}
                                            description={"Configure the icon as you like. Change the icon & choose the background color"}
                                        />,

                                        <Button onClick={() => {

                                            // todo implement
                                            onChange( "" );


                                            this.closeLocalDialog();
                                            this.onChangeRerender();
                                        }}/>
                                    ]}/>



                                    // <ColorSelectorDialog hex={value === undefined ? "000000" : value} onSubmit={hex => {
                                    //     onChange(hex);
                                    //     this.closeLocalDialog();
                                    //     this.onChangeRerender();
                                    // }}/>
                                )}/>
                            );
                        }}/>,
                    ]}/>
                )}
            />
        ), this.localID, ...getOr(p.channels, []));
    }
}
