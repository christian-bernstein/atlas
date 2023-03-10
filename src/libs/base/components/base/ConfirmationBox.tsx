import {BernieComponent} from "../../BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {Box} from "./Box";
import {FlexBox} from "./FlexBox";
import {Text, TextType} from "./Text";
import {LiteGrid} from "./LiteGrid";
import {Button} from "./Button";
import {percent} from "../../logic/style/DimensionalMeasured";
import {VM} from "../../logic/style/ObjectVisualMeaning";
import {getOr} from "../../Utils";

export type ConfirmationBoxProps = {
    title: string,
    description: string,
    onSubmit: (checked: boolean) => void,
    fullSize?: boolean,
    confirmationVM?: VM
}

export class ConfirmationBox extends BernieComponent<ConfirmationBoxProps, any, any> {

    private submit(checked: boolean) {
        this.props.onSubmit(checked);
    }

    componentRender(p: ConfirmationBoxProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box width={p.fullSize ? percent(100) : undefined} height={p.fullSize ? percent(100) : undefined} children={
                <FlexBox>
                    <FlexBox gap={t.gaps.smallGab}>
                        <Text text={p.title} type={TextType.smallHeader}/>
                        <Text text={p.description} type={TextType.secondaryDescription}/>
                    </FlexBox>
                    <LiteGrid columns={2} gap={t.gaps.smallGab}>
                    <Button onClick={() => this.submit(true)} visualMeaning={getOr(p.confirmationVM, VM.INFO)} opaque width={percent(100)} height={percent(100)} children={
                        <Text text={"yes"} uppercase bold/>
                    }/>
                    <Button onClick={() => this.submit(false)} width={percent(100)} height={percent(100)} children={
                        <Text text={"no"} uppercase bold/>
                    }/>
                </LiteGrid>
                </FlexBox>

            }/>
        );
    }

}
