import {BC} from "../../base/BernieComponent";
import {Folder} from "../data/Folder";
import {Flex, FlexBox} from "../../sql/components/base/FlexBox";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import {Screen} from "../../sql/components/base/Page";
import {DrawerHeader} from "../../sql/components/base/DrawerHeader";
import {VM} from "../../sql/logic/style/ObjectVisualMeaning";
import {FormDataHub} from "../../base/FormDataHub";
import React from "react";
import {DimensionalMeasured, percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Button} from "../../sql/components/base/Button";
import {v4} from "uuid";
import {Dimension} from "../../sql/logic/style/Dimension";
import {AF} from "../../sql/components/logic/ArrayFragment";
import {BaseEntitySetupComponent} from "./BaseEntitySetupComponent";

interface FolderSetupDialogActions {
    onSubmit(folder: Folder): boolean;
}

export type FolderSetupDialogProps = {
    actions: FolderSetupDialogActions
}

export type FolderSetupDialogLocalState = {
    fdh: FormDataHub
}

export class FolderSetupDialog extends BC<FolderSetupDialogProps, any, FolderSetupDialogLocalState> {

    constructor(props: FolderSetupDialogProps) {
        super(props, undefined, {
            fdh: new FormDataHub("FolderSetupDialog").loadFromLocalStore()
        });
    }

    private createFolder() {
        // TODO: Only call action, if valid entries (unique title)
        this.props.actions.onSubmit({
            id: v4(),
            creationDate: new Date().toString(),
            note: this.local.state.fdh.get("note"),
            tags: this.local.state.fdh.get("tags"),
            title: this.local.state.fdh.get("title"),
            creator: this.local.state.fdh.get("creator"),
            description: this.local.state.fdh.get("description"),
            iconColorHEX: this.local.state.fdh.get("iconColorHEX"),
            categories: []
        });
    }

    componentRender(p: FolderSetupDialogProps, s: any, l: FolderSetupDialogLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen deactivatePadding children={
                <FlexBox padding id={"folder-setup-dialog"} gap={t.gaps.defaultGab} height={DimensionalMeasured.of(100, Dimension.vh)} fw children={
                    <AF elements={[
                        <FlexBox id={"folder-setup-dialog-header"} padding={false} fw style={{flex: "0 1 auto"}} children={
                            <Flex fw elements={[
                                <DrawerHeader
                                    header={"Create folder"}
                                    enableBadge
                                    badgeVM={VM.UI_NO_HIGHLIGHT}
                                    badgeText={"Virtual folder system"}
                                    description={"Create a new folder"}
                                />,

                                <Flex fw padding paddingX={px(25)} elements={[
                                    <Button width={percent(100)} text={"Create folder"} opaque visualMeaning={VM.INFO} onClick={() => {
                                        this.createFolder();
                                    }}/>
                                ]}/>
                            ]}/>
                        }/>,

                        <BaseEntitySetupComponent fdh={this.local.state.fdh}/>
                    ]}/>
                }/>
            }/>
        );
    }
}
