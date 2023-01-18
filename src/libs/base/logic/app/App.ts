import {Shard} from "../misc/Shard";
import {AppConfig} from "./AppConfig";
import {UserData} from "../data/UserData";
import {Themeable} from "../style/Themeable";
import {ProgressTrackerManager} from "../misc/ProgressTrackerManager";
import {Assembly} from "../assembly/Assembly";
import {LogEntry} from "../data/LogEntry";
import {UserProfileData} from "../data/UserProfileData";
import {fromLocalStorage} from "../../Utils";
import {Cache} from "../cache/Cache";
import {ModalDisplay} from "../modal/ModalDisplay";
import darkTritanopiaTheme = Themeable.darkTritanopiaTheme;

export let defaultGlobalFallbackTheme: Themeable.Theme = Themeable.darkTritanopiaTheme;

export let globalFallbackTheme: Themeable.Theme = Array.from(Themeable.getAllThemes().values()).filter(theme =>
    theme.displayName === fromLocalStorage("globalFallbackTheme", defaultGlobalFallbackTheme.displayName)
)[0] ?? defaultGlobalFallbackTheme;

export function setGlobalFallbackTheme(theme: Themeable.Theme) {
    globalFallbackTheme = theme;
    window.localStorage.setItem("globalFallbackTheme", theme.displayName)
}

export function utilizeGlobalTheme(defTheme: Themeable.Theme | undefined = undefined): Themeable.Theme {

    return darkTritanopiaTheme;

    // if (App.isInitiated()) {
    //     return App.app().getGlobalTheme();
    // } else {
    //     if (defTheme === undefined) {
    //         return globalFallbackTheme
    //     }
    //     return defTheme;
    // }
}

export class App {
    get globalThemeName(): string {
        return this._globalThemeName;
    }
    get modals(): Array<ModalDisplay> {
        return this._modals;
    }

    public static readonly enablePacketLogging: boolean = false;

    get logEntryAddListeners(): Map<string, (entry: LogEntry) => void> {
        return this._logEntryAddListeners;
    }

    get sophisticatedLogHistory(): Array<LogEntry> {
        return this._sophisticatedLogHistory;
    }

    set sophisticatedLogHistory(value: Array<LogEntry>) {
        this._sophisticatedLogHistory = value;
    }

    private static instance: App | undefined = undefined;

    public static appOrCreate: (config: AppConfig, onCreate?: (app: App) => void) => App = (config: AppConfig, onCreate: ((app: App) => void) | undefined) => {
        if (App.instance === undefined) {
            App.instance = new App(config);
            onCreate?.(App.instance);
        }
        return App.instance;
    };

    public static app: () => App = () => {
        return App.instance as App;
    };

    public static use(handler: (app: App) => void) {
        handler(App.app());
    }

    public static isInitiated(): boolean {
        return App.instance !== undefined && App.app().initiated;
    }

    private readonly themes: Map<string, Themeable.Theme>;

    private readonly _progressTrackerManager: ProgressTrackerManager = new ProgressTrackerManager(this);

    // todo rename to logHistory
    private _sophisticatedLogHistory: Array<LogEntry> = new Array<LogEntry>();

    /**
     * @deprecated
     */
    private readonly _logHistory: any[][] = [];

    private readonly shards: Map<String, Shard> = new Map<String, Shard>();

    private readonly actions: Map<String, Array<(parameters?: any) => void>> = new Map<String, Array<(parameters?: any) => void>>();

    private readonly _modals: Array<ModalDisplay>;

    private centralMemoryCache?: Cache;

    private _globalThemeName: string;

    private _config: AppConfig;

    private _sessionID?: string;

    private _userData: UserProfileData | undefined;

    private _initiated: boolean = false;

    private _dialogAssembly: Assembly;

    private _logEntryAddListeners: Map<string, (entry:  LogEntry) => void> = new Map<string, (entry: LogEntry) => void>();

    private profileData?: UserProfileData;

    constructor(config: AppConfig) {
        this._config = config;
        this._globalThemeName = config.defaultTheme;
        this.themes = config.themes;
        this._dialogAssembly = config.appAssembly;
        this._modals = new Array<ModalDisplay>();
        // this.init();
    }


    public getGlobalTheme(): Themeable.Theme {
        return this.themes.get(this._globalThemeName) as Themeable.Theme;
    }

    // todo add rerender feature
    public setGlobalTheme(theme: string, setDefaultBrowserTheme: boolean = true) {
        this._globalThemeName = theme;
        if (setDefaultBrowserTheme) {
            this.setDefaultBrowserTheme(theme);
        }
    }

    public rerenderGlobally() {
        this.config.rootRerenderHook?.();
    }

    private loadDefaultBrowserTheme() {
        const theme: string | null = window.localStorage.getItem("default-browser-theme");
        if (theme != null) {
            this._globalThemeName = theme;
        }
    }

    private setDefaultBrowserTheme(theme: string) {
        window.localStorage.setItem("default-browser-theme", theme);
    }

    get config(): AppConfig {
        return this._config;
    }

    set config(value: AppConfig) {
        this._config = value;
    }

    get progressTrackerManager(): ProgressTrackerManager {
        return this._progressTrackerManager;
    }

    public set sessionID(value: string) {
        window.localStorage.setItem("session-id", value);
        this._sessionID = value;
    }

    public getUserData(): UserData | undefined {
        return this._userData;
    }

    public getSessionID(): string | undefined {
        return this._sessionID;
    }

    get initiated(): boolean {
        return this._initiated;
    }
}
