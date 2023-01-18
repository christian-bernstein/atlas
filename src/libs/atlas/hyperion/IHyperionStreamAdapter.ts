import {HyperionStorableEntry} from "./HyperionStorableEntry";
import {HyperionUpstreamTransaction} from "./HyperionUpstreamTransaction";
import {Consumer} from "../../base/Consumer";
import {UpstreamCacheStreamCompletedResult} from "./UpstreamCacheStreamCompletedResult";

export interface IHyperionStreamAdapter {
    upstreamTransaction(transaction: HyperionUpstreamTransaction): IHyperionStreamAdapter;
    beginUpstreamTransactionCacheMode(): IHyperionStreamAdapter;
    executeCachedUpstreamTransactions(onStreamCompleted: Consumer<UpstreamCacheStreamCompletedResult>): IHyperionStreamAdapter;
    get(id: string): Promise<HyperionStorableEntry | undefined>;
}
