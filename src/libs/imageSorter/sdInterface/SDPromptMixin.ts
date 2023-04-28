import {LanguageParserContext} from "../LanguageParserContext";

export type SDPromptMixin = {
    key: string,
    func: (ctx: LanguageParserContext, parameters: Array<string>) => string
}
