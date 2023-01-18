import {SettingsElementIconConfig} from "../../base/components/base/SettingsElement";

export type SettingsPageBlueprint = {
    pageID: string,
    title: string,
    description: string,
    pageRenderer: () => JSX.Element,
    iconConfig?: SettingsElementIconConfig
}
