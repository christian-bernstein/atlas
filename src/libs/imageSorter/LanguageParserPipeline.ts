import {LanguageParserContext} from "./LanguageParserContext";
import {LanguagePipelineSegment} from "./LanguagePipelineSegment";
import {LanguagePipelineSegmentFunc} from "./LanguagePipelineSegmentFunc";

export class LanguageParserPipeline {

    private readonly segments: Array<LanguagePipelineSegment> = [];

    public segment(...segments: Array<LanguagePipelineSegment>): LanguageParserPipeline {
        this.segments.push(...segments);
        return this;
    }

    public segmentFunc(...segments: Array<LanguagePipelineSegmentFunc>): LanguageParserPipeline {
        this.segments.push(...(segments.map(func => ({
            func: func
        }))));
        return this;
    }

    public parse(code: string): LanguageParserContext {
        let ctx: LanguageParserContext = {
            cmd: code,
            data: undefined,
            params: new Map<string, any>(),
            pragmaParams: new Map<string, any>()
        };
        this.segments.forEach((segment, index) => {
            try {
                if (segment.skip && segment.skip(ctx)) return;
                segment.func(ctx);
            } catch (e) {
                console.error("Language parser pipeline error:", e);
            }
        });
        return ctx;
    }
}
