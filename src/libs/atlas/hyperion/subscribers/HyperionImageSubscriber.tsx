import {BC} from "../../../base/BernieComponent";
import {HyperionSubscriberProps} from "../HyperionSubscriberProps";
import {Box} from "../../../base/components/base/Box";
import {Color} from "../../../base/logic/style/Color";
import {OverflowBehaviour} from "../../../base/logic/style/OverflowBehaviour";
import {px} from "../../../base/logic/style/DimensionalMeasured";
import {QueryDisplay} from "../../../base/components/logic/QueryDisplay";
import {Optional} from "../../../base/Optional";
import {HyperionStorableEntry} from "../HyperionStorableEntry";
import {Centered} from "../../../base/components/base/PosInCenter";
import {Flex} from "../../../base/components/base/FlexBox";
import {Align} from "../../../base/logic/style/Align";
import {Description} from "../../../base/components/base/Description";
import {Tooltip} from "../../../base/components/base/Tooltip";
import {FileInput} from "../../../base/components/base/fileInput/FileInput";
import {FormTransactionType} from "../../../base/components/FormTransactionType";
import {Q, Queryable} from "../../../base/logic/query/Queryable";
import {AF} from "../../../base/components/logic/ArrayFragment";
import {VM} from "../../../base/logic/style/ObjectVisualMeaning";
import {QueryError} from "../../../base/logic/query/QueryError";
import {Themeable} from "../../../base/logic/style/Themeable";
import {Assembly} from "../../../base/logic/assembly/Assembly";
import {HyperionImage} from "../datatypes/HyperionImage";
import {InformationBox} from "../../../base/components/base/InformationBox";
import {HyperionAPI} from "../HyperionAPI";
import {HyperionImageProducerProps} from "../producers/HyperionImageProducer";

export type HyperionImageSubscriberProps = HyperionSubscriberProps & {
    openFullscreenContextOnClick?: boolean,
    preventUserSelection?: boolean
};

export type HyperionImageSubscriberLocalState = {
    hyperionStorableEntryQueryable: Q<Optional<HyperionStorableEntry>>
}

/**
 * TODO add global reload dependency -> Hot update after entry changed somewhere on the infrastructure
 */
export class HyperionImageSubscriber extends BC<HyperionImageSubscriberProps, any, HyperionImageSubscriberLocalState> {

    constructor(props: HyperionImageSubscriberProps) {
        super(props, undefined, {
            hyperionStorableEntryQueryable: new Q<Optional<HyperionStorableEntry>>({
                component: () => this,
                fallback: undefined,
                listeners: ["hyperion-entry"],
                process: (resolve, reject) => HyperionAPI.hyperion().get(props.hyperionEntryID).then(value => resolve(value))
            })
        });
    }

    // TODO Merge with hyperionEntryToImageData() in producer
    private hyperionEntryToImageData(entry: Optional<HyperionStorableEntry>): HyperionImage | undefined {
        if (entry === undefined) return undefined;
        const raw = entry.value;
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this.ls().hyperionStorableEntryQueryable.query();
    }

    componentRender(p: HyperionImageSubscriberProps, s: any, l: HyperionImageSubscriberLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const openFullscreenContextOnClick = p.openFullscreenContextOnClick ?? false;
        const preventUserSelection = p.preventUserSelection ?? false;

        return this.component(() => {
            return (
                <QueryDisplay<Optional<HyperionStorableEntry>>
                    q={this.ls().hyperionStorableEntryQueryable}
                    renderer={{
                        success: (q, data) => {
                            const imageData = this.hyperionEntryToImageData(data);
                            if (imageData === undefined) {
                                return <></>;
                            }

                            // TODO: Convert to base component ( ImageData -> JSX )
                            return (
                                <img
                                    alt={"hyperion-file"}
                                    // height={"100%"}
                                    src={imageData.src}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        userSelect: preventUserSelection ? "none" : "auto",
                                        cursor: openFullscreenContextOnClick ? "zoom-in" : "default",
                                        objectFit: imageData.imageFit,
                                        objectPosition: imageData.position,
                                        imageRendering: imageData.renderingMode,
                                        opacity: imageData.opacity
                                        // TODO: Add rotation, fit
                                    }}
                                    onClick={() => {
                                        // TODO: Make more compact version
                                        if (openFullscreenContextOnClick) {
                                            this.dialog(
                                                <img
                                                    alt={"hyperion-file"}
                                                    src={imageData.src}
                                                    style={{
                                                        height: "100vh",
                                                        backgroundColor: "black",
                                                        objectFit: imageData.imageFit,
                                                        objectPosition: imageData.position,
                                                        imageRendering: imageData.renderingMode,
                                                        opacity: imageData.opacity
                                                        // TODO: Add rotation, fit
                                                    }}
                                                />
                                            );
                                        }
                                    }}
                                />
                            );
                        },
                        processing(q: Queryable<HyperionStorableEntry | undefined>): JSX.Element {
                            return (
                                <Centered fullHeight children={
                                    <AF elements={[
                                        <Description text={"Loading"} coloredText visualMeaning={VM.UI_NO_HIGHLIGHT}/>
                                    ]}/>
                                }/>
                            );
                        },
                        error(q: Queryable<HyperionStorableEntry | undefined>, error?: QueryError): JSX.Element {
                            return (
                                <InformationBox visualMeaning={VM.ERROR} children={
                                    <Description text={`Error while loading hyperion image data for '${p.hyperionEntryID}'`}/>
                                }/>
                            );
                        }
                    }}
                />
            );
        }, ...Q.allChannels("hyperion-entry"))
    }
}
