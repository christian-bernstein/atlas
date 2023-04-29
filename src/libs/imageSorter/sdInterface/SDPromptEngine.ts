import {LanguageParserPipeline} from "../LanguageParserPipeline";
import {SDPromptMixin} from "./SDPromptMixin";
import {isaDB} from "../ImageSorterAppDB";

export class SDPromptEngine extends LanguageParserPipeline {

    private readonly mixins: Array<SDPromptMixin> = [];

    constructor() {
        super();
        this.initInternalMixins();
        this.initPipeline();
    }

    private initInternalMixins() {
        this.mixin({
            key: "void",
            func: () => "HELLO_WORLD"
        })
    }

    public async initUserMixins(): Promise<SDPromptEngine> {
        await isaDB.mixins.each((data, cursor) => {
            this.mixin({
                key: data.key,
                // TODO: Add support for LINK & FUNC mixins
                func: () => data.target
            });
        });
        return this;
    }

    private initPipeline() {
        this
            // Delete inline comments / multiline comments
            .segmentFunc(ctx => ctx.cmd = ctx.cmd.replaceAll(/\/\*.*\*\//g, ""))
            // Delete empty lines,
            .segmentFunc(ctx => ctx.cmd = ctx.cmd.split("\n").filter(s => s.trim().length > 0).join("\n"))
            // Delete comment lines
            .segmentFunc(ctx => ctx.cmd = ctx.cmd.split("\n").filter(s => !s.trim().startsWith("#")).join("\n"))
            .segmentFunc(ctx => {
                const simplexParam = /:[\w_:]+/g, multiParam = /\([\w_:\s,.]*\)/g;
                const mixinRegex = /@\w+((:[\w_:]+)|(\([\w_:\s,.]*\)))?/g;
                Array.from(ctx.cmd.matchAll(mixinRegex)).forEach(value => {
                    const fullTerm = value["0"];
                    const term = fullTerm.substring(1);
                    const key = Array.from(term.matchAll(/\w+/g))[0]["0"]
                    let param = term.replace(key, "");
                    const isSimplex = simplexParam.test(param);
                    const isMulti = multiParam.test(param);
                    if (isMulti) param = param.slice(1, -1).trim();
                    if (isSimplex) param = param.substring(1);
                    const paramArray = param.split(",").map(s => s.trim());
                    const mixin = this.mixins.find(m => m.key === key);
                    if (mixin === undefined) {
                        ctx.cmd = ctx.cmd.replace(fullTerm, "");
                        return;
                    }

                    // TODO: Make recursive call if 'generated'-value contains mixins itself
                    const generated = mixin.func(ctx, paramArray);

                    ctx.cmd = ctx.cmd.replace(fullTerm, generated);

                    console.log("key", key, "param", paramArray);
                })
            })
            // Clear empty prompt shards (, , , ,) & remove line breaks
            .segmentFunc(ctx => ctx.cmd = ctx.cmd.split(",").map(s => s.trim()).filter(s => s.length > 0).join(", "))
            // Replace invoke-ai styled shard weights
            .segmentFunc(ctx => ctx.cmd = this.mapShads(ctx.cmd, s => {
                if (!/\w+(-+|\++)/g.test(s)) return s;
                if (s.endsWith("+")) {
                    const mag = /\++/g.exec(s)?.["0"]?.length ?? 0;
                    const factorizedMag = 1 + mag * .1;
                    return `(${s.replaceAll("+", "")}:${
                        Math.floor(factorizedMag * 10) / 10
                    })`;
                } else {
                    const mag = /-+/g.exec(s)?.["0"]?.length ?? 0;
                    const factorizedMag = 1 - mag * .1;
                    return `(${s.replaceAll("-", "")}:${
                        Math.ceil(factorizedMag * 10) / 10
                    })`;
                }
            }))
    }

    public mixin(mixin: SDPromptMixin): SDPromptEngine {
        this.mixins.push(mixin);
        return this;
    }

    private mapShads(s: string, mapper: (s: string) => string): string {
        return s
            .split(",")
            .map(s => s.trim())
            .map(s => mapper(s))
            .join(", ")
    }
}
