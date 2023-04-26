import {LanguagePipelineSegmentFunc} from "./LanguagePipelineSegmentFunc";
import {LanguageParserContext} from "./LanguageParserContext";

export type LanguagePipelineSegment = {
    func: LanguagePipelineSegmentFunc,
    skip?: (ctx: LanguageParserContext) => boolean
}
