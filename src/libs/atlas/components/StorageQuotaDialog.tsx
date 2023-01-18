import {BC} from "../../base/BernieComponent";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Themeable} from "../../base/logic/style/Themeable";
import {Flex} from "../../base/components/base/FlexBox";
import {px} from "../../base/logic/style/DimensionalMeasured";
import {Align} from "../../base/logic/style/Align";
import {Justify} from "../../base/logic/style/Justify";
import React from "react";
import {Text, TextType} from "../../base/components/base/Text";
import {SingleLinearProgress} from "../../base/components/base/SingleLinearProgress";
import {VM} from "../../base/logic/style/ObjectVisualMeaning";
import {Utils} from "../../base/Utils";
import {StaticDrawerMenu} from "../../base/components/base/StaticDrawerMenu";
import {DrawerHeader} from "../../base/components/base/DrawerHeader";

export type StorageQuotaDialogLocalState = {
    se?: StorageEstimate
}

export class StorageQuotaDialog extends BC<any, any, StorageQuotaDialogLocalState> {

    constructor() {
        super(undefined, undefined, {});
    }

    componentDidMount() {
        super.componentDidMount();
        navigator.storage.estimate().then((data: StorageEstimate) => {
           this.local.setStateWithChannels({
               se: data
           }, ["data"])
        });
    }

    componentRender(p: any, s: any, l: StorageQuotaDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <StaticDrawerMenu body={props => (
                <Flex fw fh align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                    <DrawerHeader
                        header={"Storage quota"}
                        enableBadge
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        badgeText={"persistent Storage"}
                        description={"Get information about the storage quota for **indexeddb**. indexeddb is used to store large amounts of data persistently. Your folder-structure & documents are stored in this database. *Images are included*"}
                    />,

                    this.component(local => {
                        if (local.state.se === undefined) {
                            return (
                                <Flex fw fh align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                    <Text
                                        text={`Loading indexeddb storage estimates`}
                                        coloredText
                                        visualMeaning={VM.WARNING}
                                        type={TextType.secondaryDescription}
                                        fontSize={px(11)}
                                    />
                                ]}/>
                            );
                        } else {
                            const use = Number(local.state.se?.usage);
                            const quota = Number(local.state.se?.quota);
                            const p = use * 100 / quota;

                            return (
                                <Flex fw fh align={Align.CENTER} gap={t.gaps.smallGab} justifyContent={Justify.CENTER} elements={[
                                    <Text text={`${p.toFixed(3)}%`}/>,
                                    <SingleLinearProgress visualMeaning={VM.INFO} max={100} value={p}/>,
                                    <Text
                                        text={`**${Utils.humanFileSize(use)}** of **${Utils.humanFileSize(quota)}** used`}
                                        type={TextType.secondaryDescription}
                                        fontSize={px(11)}
                                    />
                                ]}/>
                            );
                        }
                    }, "data")
                ]}/>
            )}/>
        );
    }
}
