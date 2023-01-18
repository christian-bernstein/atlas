import {BernieComponent} from "../../../base/BernieComponent";
import {Themeable} from "../../../sql/logic/style/Themeable";
import {Assembly} from "../../../sql/logic/assembly/Assembly";
import {StaticDrawerMenu} from "../../../sql/components/base/StaticDrawerMenu";
import {percent, px, vh} from "../../../sql/logic/style/DimensionalMeasured";
import {Flex, FlexBox} from "../../../sql/components/base/FlexBox";
import {FlexDirection} from "../../../sql/logic/style/FlexDirection";
import {OverflowBehaviour} from "../../../sql/logic/style/OverflowBehaviour";
import React from "react";
import {Text} from "../../../sql/components/base/Text";
import {SettingsGroup} from "../../../sql/components/base/SettingsGroup";
import {SettingsElement} from "../../../sql/components/base/SettingsElement";
import {Description} from "../../../sql/components/base/Description";
import {Separator} from "../../../sql/components/base/Separator";
import {Orientation} from "../../../sql/logic/style/Orientation";
import {OverflowWithHeader} from "../../../sql/components/base/OverflowWithHeader";

export class SettingsDisplayRoot extends BernieComponent<any, any, any> {

    init() {
        super.init();
        this.sidebarAssembly();
        this.mainAssembly();
    }

    private sidebarAssembly() {
        this.assembly.assembly("sidebar", theme => {
            return (
                <Flex fh width={px(250)} elements={[
                    <OverflowWithHeader
                        height={percent(100)}
                        dir={FlexDirection.COLUMN_REVERSE}
                        gap={theme.gaps.defaultGab}
                        staticContainer={{
                            elements: [
                                <Text text={"Settings"} bold/>
                            ]
                        }}
                        overflowContainer={{
                            elements: [
                                <SettingsGroup title={"Appearance"} elements={[
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"1"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"2"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"3"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"4"}/>,
                                ]}/>,

                                <SettingsGroup title={"Developer settings"} elements={[
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"A"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"B"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"C"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"D"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"E"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"F"}/>,
                                ]}/>,

                                <SettingsGroup title={"Another group"} elements={[
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"~"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"~"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"~"}/>,
                                    <SettingsElement groupDisplayMode forceRenderSubpageIcon title={"~"}/>,
                                ]}/>
                            ]
                        }}
                    />
                ]}/>
            );
        });
    }

    private mainAssembly() {
        this.assembly.assembly("main", theme => {
            return (
                <OverflowWithHeader
                    height={percent(100)}
                    dir={FlexDirection.COLUMN_REVERSE}
                    gap={theme.gaps.defaultGab}
                    staticContainer={{
                        elements: [
                            <Flex fw gap={theme.gaps.smallGab} elements={[
                                <Text text={"Appearance"} bold/>,
                                <Description text={"Jo dw20 ist ganz nice werd ich die Tage machen, soll ich den server generell auch aufsetzten."}/>,
                                <Separator orientation={Orientation.HORIZONTAL}/>
                            ]}/>
                        ]
                    }}
                    overflowContainer={{
                        elements: []
                    }}
                />
            );
        });
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu width={percent(50)} body={props => {
                return (
                    <FlexBox
                        flexDir={FlexDirection.ROW}
                        fw
                        height={vh(50)}
                        elements={[
                            <FlexBox
                                fh
                                padding={false}
                                style={{ flex: "0 1 auto" }}
                                elements={[
                                    this.a("sidebar")
                                ]}
                            />,

                            <FlexBox
                                fh
                                style={{ flex: "1 1 auto" }}
                                overflowYBehaviour={OverflowBehaviour.SCROLL}
                                elements={[
                                    this.a("main")
                                ]}
                            />
                        ]}
                    />
                );
            }}/>
        );
    }
}
