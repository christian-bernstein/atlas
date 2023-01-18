import {BC} from "../../../base/BernieComponent";
import {CommandHighlightMode} from "../CommandHighlightMode";
import {Assembly} from "../../../base/logic/assembly/Assembly";
import {Themeable} from "../../../base/logic/style/Themeable";
import {Flex, FlexRow} from "../../../base/components/base/FlexBox";
import {px} from "../../../base/logic/style/DimensionalMeasured";
import {Justify} from "../../../base/logic/style/Justify";
import {FlexDirection} from "../../../base/logic/style/FlexDirection";
import {Text, TextType} from "../../../base/components/base/Text";
import {Box} from "../../../base/components/base/Box";
import {Color} from "../../../base/logic/style/Color";
import React from "react";
import {GloriaCommandDefinition} from "../GloriaCommandDefinition";
import {Gloria} from "../Gloria";
import {Align} from "../../../base/logic/style/Align";
import {Badge} from "../../../base/components/base/Badge";
import {VM} from "../../../base/logic/style/ObjectVisualMeaning";

export type CommandSelectorProps = {
    gloria: Gloria,
    command: GloriaCommandDefinition,
    highlightMode: CommandHighlightMode,
    // todo implement
    // onSelect: () => void
}

export class CommandSelector extends BC<CommandSelectorProps, any, any> {

    componentRender(p: CommandSelectorProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        if (p.highlightMode === CommandHighlightMode.SELECTED) {
            return (
                <Flex style={{ cursor: "pointer", position: "relative", backgroundColor: "#FFFFFF0D" }} fw height={px(35)} justifyContent={Justify.CENTER} elements={[
                    <Flex fw flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN} align={Align.CENTER} padding paddingX={px(19)} paddingY={px(13)} elements={[
                        <Text
                            text={p.command.title(p.gloria)}
                            type={TextType.secondaryDescription}
                            fontSize={px(12)}
                        />,
                        <FlexRow align={Align.CENTER} elements={[
                            Badge.badge("run", { visualMeaning: VM.UI_NO_HIGHLIGHT })
                        ]}/>
                    ]}/>,

                    <Box bgColor={Color.ofHex("#FFCE61")} width={px(3)} fh noPadding borderRadiiConfig={{ enableCustomBorderRadii: true, fallbackCustomBorderRadii: px() }} borderless style={{
                        position: "absolute"
                    }}/>
                ]}/>
            );
        }

        return (
            <Flex style={{ position: "relative" }} fw height={px(35)} justifyContent={Justify.CENTER} elements={[
                <Flex fw flexDir={FlexDirection.ROW} padding paddingX={px(19)} paddingY={px(13)} elements={[
                    <Text
                        text={p.command.title(p.gloria)}
                        type={TextType.secondaryDescription}
                        fontSize={px(12)}
                    />
                ]}/>,
            ]}/>
        );
    }
}
