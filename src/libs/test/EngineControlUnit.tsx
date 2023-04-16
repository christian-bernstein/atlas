import {ControlUnitBaseProps} from "./ControlUnitBaseProps";
import {ControlUnit} from "./ControlUnit";
import {EngineState} from "./EngineState";
import {EngagementState} from "./EngagementState";
import {MANUAL_AUTHORITY, sleep, thrusterEnergyStates} from "./TestScreen";

type EngineControlUnitProps = ControlUnitBaseProps & {
    engineID: string
};

export class EngineControlUnit implements ControlUnit<EngineControlUnitProps, EngineControlUnit> {

    public static readonly ENGAGEMENT_FLOATING_STATE_DURATION: number = 500;

    props: EngineControlUnitProps | undefined;

    setProps(props: EngineControlUnitProps): EngineControlUnit {
        this.props = props;
        return this;
    }

    public getEngine(): EngineState {
        return this.props?.state.engines.find(e => e.id === this.props?.engineID)!;
    }

    public getEngineEProd(): number {
        const engine = this.getEngine();
        return engine.actualEProd;
    }

    public selectEngineProgram(program: string) {
        this.updateEngine(engine => {
            engine.manualSelectedProgram = program;
            return engine;
        });
    }

    public setEngineAuthority(authority: string) {
        this.updateEngine(engine => {
            engine.authority = authority;
            return engine;
        });
    }

    private baseUpdateEngine(updater: (engine: EngineState) => EngineState) {
        updater(this.getEngine());
        this.props?.setState(prevState => ({...prevState, engines: [...prevState.engines]}));
    }

    public synchronize() {
        const engine = this.getEngine();
        if (engine.authority === MANUAL_AUTHORITY) {
            if (engine.manualSelectedProgram != null) {
                // Program is selected, sync it with the engine eProd output
                const reqEProd = thrusterEnergyStates.get(engine.manualSelectedProgram);
                if (engine.selectedEProd !== reqEProd) {
                    this.baseUpdateEngine(e => {
                        e.selectedEProd = reqEProd ?? 0;

                        // TODO: Remove
                        e.actualEProd = reqEProd ?? 0;

                        return e;
                    });
                }
            } else {
                // No program selected, sync engine eProd to 0
                if (engine.selectedEProd !== 0) {
                    this.baseUpdateEngine(e => {
                        e.selectedEProd = 0;

                        // TODO: Remove
                        e.actualEProd = 0;

                        return e;
                    });
                }
            }
        }
    }

    public updateEngine(updater: (engine: EngineState) => EngineState) {
        this.baseUpdateEngine(updater)
        // Run synchronization cycle after updating the engine's state
        this.synchronize();
    }

    public async disengage() {
        this.updateEngine(engine => {
            engine.engagementState = EngagementState.DISENGAGING;
            return engine;
        });
        await sleep(EngineControlUnit.ENGAGEMENT_FLOATING_STATE_DURATION)
        this.updateEngine(engine => {
            engine.engagementState = EngagementState.DISENGAGED;
            return engine;
        });
    }

    public async engage() {
        this.updateEngine(engine => {
            engine.engagementState = EngagementState.ENGAGING;
            return engine;
        });
        await sleep(EngineControlUnit.ENGAGEMENT_FLOATING_STATE_DURATION)
        this.updateEngine(engine => {
            engine.engagementState = EngagementState.ENGAGED;
            return engine;
        });
    }

    public async toggleEngagement() {
        const engine = this.getEngine();
        // Engine engagement state is already changing, this cannot be overwritten
        if (engine.engagementState === EngagementState.ENGAGING || engine.engagementState === EngagementState.DISENGAGING) return;
        // Call respective toggle function
        if (engine.engagementState === EngagementState.ENGAGED) return this.disengage();
        if (engine.engagementState === EngagementState.DISENGAGED) return this.engage();
    }
}
