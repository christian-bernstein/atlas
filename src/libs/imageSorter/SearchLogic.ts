import {Image} from "./Image";
import {evaluate} from "mathjs";
import {ImageSorterAPI} from "./ImageSorterAPI";
import {isaDB} from "./ImageSorterAppDB";

type FuncContext = {
    api: ImageSorterAPI,
    tags: Array<string>,
    args: Array<string>
}

type Func = (ctx: FuncContext, images: Array<Image>) => Promise<Array<Image>> | Array<Image>

export class SearchLogic {

    private evalNumber(ctx: FuncContext, images: Image[], param: any, def: number = 0) {
        return param === undefined ? def : evaluate(param, {
            l: images.length,
            gb: 1e+9,
            mb: 1e+6
        }) as number;
    }

    private readonly baseFuncGenerators: Map<string, (param?: string) => Func> = new Map<string, (param?: string) => Func>([
        ["limit", param => (ctx, images) => images.splice(0, this.evalNumber(ctx, images, param, 1))],
        ["random", param => (ctx, images) => images.sort(() => .5 - Math.random()).slice(0, this.evalNumber(ctx, images, param, 1))],
        ["r18", param => (ctx, images) => images.filter(i => i.tags.includes("r18"))],
        ["unreleased", param => (ctx, images) => images.filter(i => !i.tags.includes("submitted"))],
        ["released", param => (ctx, images) => images.filter(i => i.tags.includes("submitted"))],
        ["flt", param => (ctx, images) => images.filter(i => i.data.size >= this.evalNumber(ctx, images, param))],
        ["fst", param => (ctx, images) => images.filter(i => i.data.size <= this.evalNumber(ctx, images, param))],
        ["not", param => {
            return async (ctx, images) => {
                const matchingInnerExpression = await this.parseImageQuery(param ?? "", ctx.api)(images);
                return images.filter(i => {
                    return !matchingInnerExpression.includes(i)
                });
            }
        }],
        ["nth", param => (ctx, images) => {
            const idx = this.evalNumber(ctx, images, param);
            if (idx < 0 || idx >= images.length) return [];
            return [images[idx]];
        }],
    ]);

    private readonly funcGenerators: Map<string, (param?: string) => Func> = new Map<string, (param?: string) => Func>([
        ...Array.from(this.baseFuncGenerators.entries()),
        this.alias("rnd", "random")
    ]);

    public alias(alias: string, original: string): [string, (param?: string) => Func] {
        return [alias, this.baseFuncGenerators.get(original)!];
    }

    /**
     * Primary tokens:
     *  - :x => generator function -> sub parsing
     *  - #x => required tag search
     *  - -x => adds a parameter information to the cmdlet context
     *  - x => adds to the main search info (title, description)
     *
     * @param cmdlet command input, will be parsed according to the
     * parse-method rules specified above.
     * @param api API
     */
    public parseImageQuery(cmdlet: string, api: ImageSorterAPI): (images: Array<Image>) => Promise<Array<Image>> {
        let main: string = "",
            tags: Array<string> = [],
            args: Array<string> = [],
            predicates: Array<Func> = []
        ;

        cmdlet.split(/\s+/).forEach(s => {
            const next = (n: number = 1) => s = s.substring(n);
            const read = (accept: (c: string) => boolean): string => {
                let buf = "";
                for (const c of s) {
                    if (accept(c)) {
                        buf += c;
                    } else {
                        break;
                    }
                }
                s = s.replace(buf, "");
                return buf;
            }

            if (s.startsWith("!")) {
                next();
                let param: string = s;
                if (s.startsWith("(")) param = this.enclosing(s, ['(', ')']);
                predicates.push(this.funcGenerators.get("not")!.call(this, param))
            }

            else if (s.startsWith(":")) {
                next();
                const fName = read(c => /^[a-zA-Z0-9_$>=<]$/.test(c));
                let param: string | undefined = undefined;
                if (s.startsWith("(")) param = this.enclosing(s, ['(', ')']);
                predicates.push(this.funcGenerators.get(fName)!.call(this, param))
            }

            else if (s.startsWith("#")) {
                next();
                tags.push(s);
            }

            else if (s.startsWith("-")) {
                next();
                args.push(s);
            }

            console.log("main", main, "tags", tags, "predicates", predicates);

        });

        return images => new Promise<Array<Image>>(async (resolve, reject) => {
            for (const t of tags) images = images.filter(i => i.tags.includes(t));

            for (const p of predicates) {
                images = await p({ tags: tags, args: args, api: api }, images);
                if (images.length === 0) break;
            }

            // select images
            if (args.includes("s")) api.selectionManager.select(images.map(i => i.id));
            // open images
            if (args.includes("o") && images.length > 0) api.selectImageByID(images[0].id, false);
            // clear the searchbar image selection
            if (args.includes("v")) images = [];

            // TODO: move to function dict
            // delete all images from the current selection
            if (args.includes("db_purge")) {
                if (window.confirm(`Do you want to delete ${images.length} images?`)) {
                    isaDB.images.bulkDelete(images.map(i => i.id));
                }
                images = [];
            }

            return resolve(images);
        })
    }

    /**
     * ":not(:var("Hello world"))generic appendix" ==> :var("Hello world")
     */
    public enclosing(s: string, pair: string[]): string {
        let depth = 0, hooked = false, opener = pair[0], closer = pair[1], buf = "";
        for (const c of s) {
            if (c === opener) {
                depth++;
                hooked = true;
            } else if (c === closer) {
                depth--;
            } else if (hooked) {
                buf += c;
            }
            if (depth === 0 && hooked) {
                return buf
            }
        }
        return buf;
    }

}
