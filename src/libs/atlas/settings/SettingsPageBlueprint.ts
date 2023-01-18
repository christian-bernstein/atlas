import {SettingsElementIconConfig} from "../../sql/components/base/SettingsElement";

export type SettingsPageBlueprint = {
    pageID: string,
    title: string,
    description: string,
    pageRenderer: () => JSX.Element,
    iconConfig?: SettingsElementIconConfig
}
