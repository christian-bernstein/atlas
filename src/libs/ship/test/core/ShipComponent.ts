import {CycleContext} from "./CycleContext";
import {ShipAPI} from "./ShipAPI";

// noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
export abstract class ShipComponent {

    public readonly id: string

    public displayName: string;

    private shipAPI: ShipAPI | undefined;

    protected subComponents: Array<ShipComponent> = [];

    constructor(id: string) {
        this.id = id;
        this.displayName = id;
    }

    public updateDisplayName(newDisplayName: string): ShipComponent {
        this.displayName = newDisplayName;
        return this;
    }

    public component<T extends ShipComponent>(id: string): T {
        return this.subComponents.find(sC => sC.id === id)! as T;
    }

    public setShipAPI(shipAPI: ShipAPI) {
        this.shipAPI = shipAPI;
    }

    public getShipAPI(): ShipAPI {
        return this.shipAPI as ShipAPI;
    }

    public registerSubComponent(component: ShipComponent) {
        component.setShipAPI(this.getShipAPI());
        this.subComponents.push(component);
    }

    public async prepareUpdate(cycle: CycleContext): Promise<CycleContext> {
        for (const sC of this.subComponents) {
            try {
                cycle = await sC.prepareUpdate(cycle);
            } catch (e) {
                console.error(e);
            }
        }
        return cycle;
    }

    /**
     * DOWN-TO-TOP
     */
    public async dtt(cycle: CycleContext): Promise<CycleContext> {
        console.debug(`handling dtt() in component '${this.displayName} ~ ${this.id}'`, cycle)

        for (const sC of this.subComponents) {
            try {
                cycle = await sC.dtt(cycle);
            } catch (e) {
                console.error(e);
            }
        }

        return cycle;
    }

    /**
     * TOP-TO-DOWN
     */
    public async ttd(cycle: CycleContext): Promise<CycleContext> {
        console.debug(`handling ttd() in component '${this.displayName} ~ ${this.id}'`, cycle)

        for (const sC of this.subComponents) {
            try {
                cycle = await sC.ttd(cycle);
            } catch (e) {
                console.error(e);
            }
        }

        return cycle;
    }
}
