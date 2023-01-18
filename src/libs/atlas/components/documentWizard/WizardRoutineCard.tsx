import {BC} from "../../../base/BernieComponent";
import {Button} from "../../../base/components/base/Button";
import {percent, px} from "../../../base/logic/style/DimensionalMeasured";
import {Flex} from "../../../base/components/base/FlexBox";
import {Align} from "../../../base/logic/style/Align";
import {Icon} from "../../../base/components/base/Icon";
import {ReactComponent as FileIcon} from "../../../../assets/icons/ic-20/ic20-file.svg";
import {Text, TextType} from "../../../base/components/base/Text";
import {Tooltip} from "../../../base/components/base/Tooltip";
import React from "react";
import {Themeable} from "../../../base/logic/style/Themeable";
import {Assembly} from "../../../base/logic/assembly/Assembly";

export type WizardRoutineCardProps = {
    tooltip: string,
    title: string,
    description: string,
    onSelect: () => void,
    icon?: JSX.Element
}

export class WizardRoutineCard extends BC<WizardRoutineCardProps, any, any> {

    componentRender(p: WizardRoutineCardProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Tooltip arrow title={p.tooltip} children={
                <Button
                    shrinkOnClick
                    width={percent(100)}
                    onClick={() => p.onSelect()}
                    children={
                        <Flex gap={px(3)} align={Align.CENTER} fw elements={[
                            <Icon icon={p.icon ?? <FileIcon/>} size={px(25)}/>,
                            <Text
                                bold
                                text={p.title}
                            />,
                            <Text
                                align={Align.CENTER}
                                text={p.description}
                                type={TextType.secondaryDescription}
                                fontSize={px(11)}
                            />,
                        ]}/>
                    }
                />
            }/>
        );
    }
}
