import {ShipComponent} from "./ShipComponent";
import {CycleContext} from "./CycleContext";

export class EngineAPI extends ShipComponent {

    private readonly engineID: string;

    constructor(engineID: string) {
        super(engineID);
        this.engineID = engineID;
    }

    public selectEProd(requestedEProd: number) {
        this.getShipAPI().useStateDispatcher().call(this, s => {
            const engine = s.engineCluster.find(e => e.id === this.engineID)!;
            engine.selectedEProd = requestedEProd;

            const cs = engine.cores;
            cs.forEach(core => core.selectedLoad.autoValue = requestedEProd);
            engine.cores = [...cs];

            return {
                ...s,
                engineCluster: [...s.engineCluster]
            };
        });
    }

    public async dtt(cycle: CycleContext) {
        await super.dtt(cycle);
        // Calculate commutative core eProd
        let eProd = 0;
        const s = cycle.initialState;
        const e = s.engineCluster.find(e => e.id === this.engineID)!;
        e.cores.forEach(core => {
            eProd += core.actualLoad
        });
        // TODO: This breaks the code -> core ttd()
        // Update next cycle
        const ns = cycle.state;
        e.actualEProd = eProd;

        // TODO: Remove test
        // e.selectedEProd += 1;


        ns.engineCluster = [...s.engineCluster];


        return cycle;
    }
}
