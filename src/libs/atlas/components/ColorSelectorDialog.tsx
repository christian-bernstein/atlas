import {BC} from "../../base/BernieComponent";
import {Themeable} from "../../base/logic/style/Themeable";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Flex} from "../../base/components/base/FlexBox";
import {DrawerHeader} from "../../base/components/base/DrawerHeader";
import {VM} from "../../base/logic/style/ObjectVisualMeaning";
import {createMargin} from "../../base/logic/style/Margin";
import React from "react";
import {Color} from "../../base/logic/style/Color";
import {ColorSelector} from "../../base/components/base/colorSelector/ColorSelector";
import {percent} from "../../base/logic/style/DimensionalMeasured";
import {appleSystem} from "../../base/components/base/colorSelector/ColorSelectorDefaultPalettes";

export type ColorSelectorDialogProps = {
    onSubmit: (hex: string) => void,
    hex: string
}

export type ColorSelectorDialogLocalState = {
    hex?: string
}

export class ColorSelectorDialog extends BC<ColorSelectorDialogProps, any, ColorSelectorDialogLocalState> {

    constructor(props: ColorSelectorDialogProps) {
        super(props, undefined, {
            hex: props.hex
        });
    }

    componentRender(p: ColorSelectorDialogProps, s: any, l: ColorSelectorDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex fw elements={[
                <DrawerHeader
                    header={"Select a color"}
                    enableBadge
                    badgeVM={VM.UI_NO_HIGHLIGHT}
                    badgeText={"Color"}
                    description={"Choose a color with the color-picker. If you are satisfied with the color, press '**Select color**' to confirm."}
                    margin={createMargin(0, 0, 40, 0)}
                />,

                <ColorSelector initialColor={Color.ofHex(p.hex)} submittable width={percent(100)} actions={{
                    onSubmit: (hex: string) => {
                        this.props.onSubmit(hex);
                    }
                }} toplevelWidgetsConfig={{
                    hex: {
                        enable: false
                    },
                    rgb: {
                        enable: false
                    }
                }} palettes={new Map<string, Array<Color>>([
                    ["main", appleSystem]
                ])}/>
            ]}/>
        );
    }
}
