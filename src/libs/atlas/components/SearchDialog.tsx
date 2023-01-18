import {BC} from "../../base/BernieComponent";
import {Assembly} from "../../base/logic/assembly/Assembly";
import {Themeable} from "../../base/logic/style/Themeable";
import * as React from 'react';
import {Flex, FlexBox} from "../../base/components/base/FlexBox";
import {Align} from "../../base/logic/style/Align";
import {DrawerHeader} from "../../base/components/base/DrawerHeader";
import {VM} from "../../base/logic/style/ObjectVisualMeaning";
import {percent, px} from "../../base/logic/style/DimensionalMeasured";
import {Button} from "../../base/components/base/Button";
import {FormElement} from "../../base/FormElement";
import {Group} from "../../base/components/base/Group";
import {Orientation} from "../../base/logic/style/Orientation";
import {Input} from "../../base/components/base/Input";
import {Justify} from "../../base/logic/style/Justify";
import {Tooltip} from "../../base/components/base/Tooltip";
import {Icon} from "../../base/components/base/Icon";
import {ReactComponent as EditIcon} from "../../../assets/icons/ic-20/ic20-edit.svg";
import {FormDataHub} from "../../base/FormDataHub";
import {Text} from "../../base/components/base/Text";
import {Tab, Tabs} from "@mui/material";
import {Separator} from "../../base/components/base/Separator";
import {Cursor} from "../../base/logic/style/Cursor";

export interface SearchDialogActions {
    onCancel(dialog: SearchDialog): void;
}

export type SearchDialogProps = {
    actions: SearchDialogActions
}

export type SearchDialogLocalState = {
    fdh: FormDataHub
}

export class SearchDialog extends BC<SearchDialogProps, any, SearchDialogLocalState> {

    constructor(props: SearchDialogProps) {
        super(props, undefined, {
            fdh: new FormDataHub("SearchDialog").loadFromLocalStore()
        });
    }

    init() {
        super.init();
        this.easyFinderAssembly();
    }

    private easyFinderAssembly() {
        this.assembly.assembly("easy-finder", theme => {
            return (
                <Flex fw elements={[
                    <FormElement
                        id={"search"}
                        title={"Search query"}
                        description={"The search query can contain *titles*, *tags*, *descriptions*, *creators*, *dates*, *topics* etc."}
                        initialValue={""}
                        fdh={this.local.state.fdh}
                        inputGenerator={(onChange, value, valid) => (
                            <Group removeChildBorders width={percent(100)} orientation={Orientation.HORIZONTAL} elements={[
                                <Input placeholder={"Tax-bill 2022"} defaultValue={value} onChange={ev => onChange(
                                    ev.target.value.split(",").map(tag => tag.trim())
                                )}/>,

                                <Button height={percent(100)} width={px(50)} border={false} highlight={false} children={
                                    <Flex fh fw align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                        <Tooltip sx={{ height: "100%", width: "100%"}} title={"Run search"} arrow children={
                                            <Icon icon={<EditIcon/>}/>
                                        }/>
                                    ]}/>
                                } onClick={() => {

                                }}/>
                            ]}/>
                        )}
                    />
                ]}/>
            );
        })
    }

    componentRender(p: SearchDialogProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex fw elements={[
                <DrawerHeader
                    header={"Finder"}
                    enableBadge
                    badgeVM={VM.UI_NO_HIGHLIGHT}
                    badgeText={"Atlas Finder"}
                    description={"Search for documents, categories, folders, creators & more"}
                />,

                <Flex fw padding paddingX={px(25)} gap={t.gaps.smallGab} elements={[
                    <Button width={percent(100)} text={"Cancel"} onClick={() => {
                        p.actions.onCancel(this);
                    }}/>,
                ]}/>,

                this.component((local) => (
                    <FlexBox width={percent(100)} gap={px()}>
                        <Tabs sx={{maxWidth: "100%"}} value={local.state.fdh.get("search-provider", 0)} textColor={"inherit"} centered variant={"scrollable"} scrollButtons allowScrollButtonsMobile onChange={(ev, value) => {
                            local.state.fdh.set("search-provider", value as number, true);
                            this.rerender("search-provider");
                        }}>
                            <Tab label={<Text cursor={Cursor.pointer} text={"Easy-Finder™"}/>}/>
                            <Tab label={<Text cursor={Cursor.pointer} text={"Advanced finder"}/>}/>
                            <Tab label={<Text cursor={Cursor.pointer} text={"Creator finder"}/>}/>
                        </Tabs>
                        <Separator orientation={Orientation.HORIZONTAL}/>
                    </FlexBox>
                ), "search-provider"),

                this.component(local => {
                    // const provider = local.state.fdh.getOrSave("search-provider", "1");
                    return this.a("easy-finder");
                }, "search-provider")

            ]}/>
        );
    }
}
