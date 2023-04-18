import {Image} from "./Image";
import {evaluate} from "mathjs";
import {getMetadata} from "meta-png";
import {ImageSorterAPI} from "./ImageSorterAPI";

type FuncContext = {
    api: ImageSorterAPI,
    tags: Array<string>,
    args: Array<string>
}

type Func = (ctx: FuncContext, images: Array<Image>) => Promise<Array<Image>> | Array<Image>


export class SearchLogic {

    private readonly funcGenerators: Map<string, (param?: string) => Func> = new Map<string, (param?: string) => Func>([
        ["limit", param => {
            return (ctx, images) => {
                const limit = param === undefined ? 0 : evaluate(param, {
                    l: images.length
                }) as number;
                return images.splice(0, limit);
            }
        }],
        ["not", param => {
            return async (ctx, images) => {
                const matchingInnerExpression = await this.parseImageQuery(param ?? "", ctx.api)(images);
                return images.filter(i => {
                    return !matchingInnerExpression.includes(i)
                });
            }
        }],
        ["random", param => {
            return (ctx, images) => {
                const selectCount = param === undefined ? 1 : evaluate(param, {
                    l: images.length
                }) as number;
                return images.sort(() => .5 - Math.random()).slice(0, selectCount);
            }
        }],
        ["unreleased", param => {
            return (ctx, images) => {
                return images.filter(i => !i.tags.includes("submitted"));
            }
        }],
        ["released", param => {
            return (ctx, images) => {
                return images.filter(i => i.tags.includes("submitted"));
            }
        }],
        ["nth", param => {
            return (ctx, images) => {
                const idx = param === undefined ? 0 : evaluate(param, {
                    l: images.length
                }) as number;
                if (idx < 0 || idx >= images.length) return [];
                return [images[idx]];
            }
        }]
    ]);

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
                const fName = read(c => /^[a-zA-Z0-9_$]$/.test(c));
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
            for (let t of tags) images = images.filter(i => i.tags.includes(t));

            for (let p of predicates) {
                images = await p({
                    tags: tags,
                    args: args,
                    api: api
                }, images);
                if (images.length === 0) break;
            }

            if (args.includes("s")) api.selectionManager.select(images.map(i => i.id));
            if (args.includes("o") && images.length > 0) api.selectImageByID(images[0].id, false);
            if (args.includes("v")) images = [];

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
