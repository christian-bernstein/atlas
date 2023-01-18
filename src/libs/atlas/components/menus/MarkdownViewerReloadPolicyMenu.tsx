import {BC} from "../../../base/BernieComponent";
import {Assembly} from "../../../base/logic/assembly/Assembly";
import {Themeable} from "../../../base/logic/style/Themeable";
import {ConfigProps} from "../../config/ConfigProps";
import {MarkdownViewerReloadPolicyConfig} from "../../config/configurations/MarkdownViewerReloadPolicyConfig";
import {Box} from "../../../base/components/base/Box";
import {Flex} from "../../../base/components/base/FlexBox";
import {DrawerHeader} from "../../../base/components/base/DrawerHeader";
import {Justify} from "../../../base/logic/style/Justify";
import {Align} from "../../../base/logic/style/Align";
import {Text, TextType} from "../../../base/components/base/Text";
import {px} from "../../../base/logic/style/DimensionalMeasured";
import {Button} from "../../../base/components/base/Button";
import {FlexDirection} from "../../../base/logic/style/FlexDirection";
import {createMargin} from "../../../base/logic/style/Margin";
import {NumberSelector} from "../../../base/components/base/NumberSelector";
import {ObjectVisualMeaning, VM} from "../../../base/logic/style/ObjectVisualMeaning";
import {ParentComponentProps} from "../../utils/ParentComponentProps";

export type MarkdownViewerReloadPolicyMenuProps = ConfigProps<MarkdownViewerReloadPolicyConfig> & ParentComponentProps

export class MarkdownViewerReloadPolicyMenu extends BC<MarkdownViewerReloadPolicyMenuProps, any, any> {

    private toggleDebounce() {
        this.props.updater.update(data => {
            data.enableDebounce = !data.enableDebounce;
            return data;
        });
    }

    componentRender(p: MarkdownViewerReloadPolicyMenuProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return p.parent.component(() => {
            const config: MarkdownViewerReloadPolicyConfig = p.getConfig();

            return (
                <Box borderless width={px(400)} elements={[
                    <Flex fh fw elements={[
                        <DrawerHeader
                            badgeVM={ObjectVisualMeaning.BETA}
                            enableBadge
                            badgeText={"Beta"}
                            header={"Markdown viewer reload policy"}
                            margin={createMargin(0, 0, 20, 0)}
                        />,

                        <Flex fw flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} elements={[
                            <Flex gap={px(2)} elements={[
                                <Text bold fontSize={px(14)} text={"Lazy reload"}/>,
                                <Text fontSize={px(11)} type={TextType.secondaryDescription} text={"Debounce reloads to save a lot of performance. If activated, the markdown viewer will only reload once after you finished editing the file"}/>,
                            ]}/>,

                            <Flex elements={[
                                config.enableDebounce ? (
                                    <Button text={"Enabled"} opaque visualMeaning={VM.INFO} onClick={() => this.toggleDebounce()}/>
                                ) : (
                                    <Button text={"Disabled"} onClick={() => this.toggleDebounce()}/>
                                )
                            ]}/>
                        ]}/>,

                        <Flex fw flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} elements={[
                            <Flex gap={px(2)} elements={[
                                <Text bold fontSize={px(14)} text={"Lazy reload timeout"}/>,
                                <Text fontSize={px(11)} type={TextType.secondaryDescription} text={"Debounce reloads to save a lot of performance. If activated, the markdown viewer will only reload once after you finished editing the file"}/>,
                            ]}/>,
                            <Flex elements={[
                                <NumberSelector
                                    onChange={newValue => {}}
                                    deltaCalculator={(current, op) => 1}
                                    initialValue={1000}
                                    minValue={1}
                                    maxValue={3e4}
                                    format={"{current}s"}
                                    specialNumberDisplayRenderers={new Map<{min: number; max: number}, (current: number) => JSX.Element>()}
                                />
                            ]}/>
                        ]}/>

                    ]}/>
                ]}/>
            );
        }, "MarkdownViewerReloadPolicyConfig-change");
    }
}
