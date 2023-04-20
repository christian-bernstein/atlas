import {StateDispatcher} from "../ship/test/core/StateDispatcher";
import {ProjectContext} from "./ProjectContext";
import {isaDB} from "./ImageSorterAppDB";
import {Collection, PromiseExtended} from "dexie";
import {VFSElement} from "./VFSElement";
import {Project} from "./Project";
import {v4} from "uuid";
import {ImageSorterAppState} from "./ImageSorterApp";
import React from "react";
import {ImportManager} from "./ImportManager";
import {DownloadManager} from "./DownloadManager";
import {SelectionManager} from "./SelectionManager";
import {ExportManager} from "./ExportManager";
import {SettingsManager} from "./SettingsManager";

export class ImageSorterAPI {

    private _state: ImageSorterAppState | undefined;

    private readonly _setState: StateDispatcher<ImageSorterAppState> | undefined;

    private readonly _importManager: ImportManager;

    private readonly _downloadManager: DownloadManager;

    private readonly _selectionManager: SelectionManager

    private readonly _exportManager: ExportManager;

    private readonly _settingsManager: SettingsManager;

    constructor(state?: ImageSorterAppState, setState?: StateDispatcher<ImageSorterAppState>) {
        this._state = state;
        this._setState = setState;
        this._importManager = new ImportManager();
        this._importManager.setApi(this);
        this._downloadManager = new DownloadManager();
        this._downloadManager.setApi(this);
        this._selectionManager = new SelectionManager();
        this._selectionManager.setApi(this);
        this._exportManager = new ExportManager();
        this._exportManager.setApi(this);
        this._settingsManager = new SettingsManager();
        this._settingsManager.setApi(this);
    }

    public getVersionString(): string {
        return "0.1.delta"
    }

    public updateState(state: ImageSorterAppState) {
        this._state = state;
    }

    public toggleFolderCreationDialog(open?: boolean) {
        this.setState(prevState => ({
            ...prevState,
            isFolderCreationDialogOpened: open ?? !prevState.isProjectCreationDialogOpened
        }));
    }

    public getProjectContext(): ProjectContext {
        return new ProjectContext(this.state.selectedProject!);
    }

    public async getFolder(folderID: string) {
        return isaDB.vfsElements.get(folderID);
    }

    public async removeImageFromCurrentProject(imageID: string) {
        // Remove from project resources
        const current = await this.getCurrentProject();
        const resources = (current?.resources ?? []).filter(res => res !== imageID);
        await isaDB.projects.update(current?.id!, {
            resources: resources
        });
        // Remove from image db
        await isaDB.images.delete(imageID);
    }

    public async getElementsInCurrentFolder(): Promise<Collection<VFSElement>> {
        const current = await this.getCurrentElement();
        const subElementIDs = current?.subElements ?? [];
        return isaDB.vfsElements.where("id").anyOfIgnoreCase(subElementIDs);
    }

    public toggleProjectCreationDialog(open?: boolean) {
        this.setState(prevState => ({
            ...prevState,
            isProjectCreationDialogOpened: open ?? !prevState.isProjectCreationDialogOpened
        }));
    }

    public appendToFilePath(id: string) {
        this.setState(prevState => ({
            ...prevState,
            fvsPath: [...prevState.fvsPath, id]
        }));
    }

    public getCurrentProject(): PromiseExtended<Project | undefined> {
        return this.getProject(this.state.selectedProject!);
    }

    public getProject(projectID: string): PromiseExtended<Project | undefined> {
        return isaDB.projects.get(projectID);
    }

    public async appendFilesToCurrentProject(files: File[]) {
        const imageIDs: Array<string> = [];
        isaDB.images.bulkAdd(files.map(f => {
            const id = v4();
            imageIDs.push(id)
            return ({
                data: f.slice(),
                id: id,
                tags: [],
                favourite: false
            });
        }));
        const project = await this.getCurrentProject();
        try {
            await isaDB.projects.update(project?.id!, {
                "resources": [...project?.resources ?? [], ...imageIDs]
            });
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * TODO: rename
     */
    public goUpOneLevel() {
        this.setState(prevState => ({
            ...prevState,
            fvsPath: prevState.fvsPath.filter((value, index, array) => index < array.length - 1)
        }));
    }

    public goToRoot() {
        this.setState(prevState => ({
            ...prevState,
            fvsPath: []
        }));
    }

    public selectImageByID(imageID: string, toggleMode: boolean = true) {
        if (toggleMode) {
            if (this.state.selectedImageId === imageID) {
                this.setState(prevState => ({
                    ...prevState,
                    selectedImageId: undefined
                }));
                return;
            }
        }
        this.setState(prevState => ({
            ...prevState,
            selectedImageId: imageID
        }));
    }

    public unselectImage() {
        if (this.state.selectedImageId === undefined) return;
        this.setState(prevState => ({
            ...prevState,
            selectedImageId: undefined
        }));
    }

    public async getCurrentElement(): Promise<VFSElement | undefined> {
        const folderID = this.state.fvsPath.length === 0 ? "root" : this.state.fvsPath[this.state.fvsPath.length - 1];
        // console.debug("Loading folder info", folderID)
        return isaDB.vfsElements.get(folderID);
    }

    public async getProjectFromPath(projectFolderAddress: Array<string>, projectName: string) {
        const folder = (await this.getFolderFromPath(projectFolderAddress))!;
        const projectVFSElement = await isaDB.vfsElements
            .where("id")
            .anyOfIgnoreCase(folder.subElements ?? [])
            .and(el => el.title === projectName)
            .first();
        return this.getProject(projectVFSElement?.targetID!);
    }

    public async addImageToProject(projectFolderAddress: Array<string>, projectName: string, files: File[]) {
        const imageIDs: Array<string> = [];
        isaDB.images.bulkAdd(files.map(f => {
            const id = v4();
            imageIDs.push(id)
            return ({
                data: f.slice(),
                id: id,
                tags: [],
                favourite: false
            });
        }));

        const project = await this.getProjectFromPath(projectFolderAddress, projectName);

        try {
            await isaDB.projects.update(project?.id!, {
                "resources": [...project?.resources ?? [], ...imageIDs]
            });
        } catch (e) {
            console.error(e)
        }
    }

    public async mkdir(path: Array<string>, title: string) {
        if (await this.checkFolderExistence(path.concat(title))) return;
        const absolutePath = path.filter(shard => shard.trim().length > 0).join("/");
        const fullPath = absolutePath + "/" + title;
        const element: VFSElement = {
            subElements: [],
            projects: [],

            // TODO: Set
            parentID: "",

            targetID: undefined,
            title: title,
            type: "folder",
            id: v4(),
            path: absolutePath,
            fullPath: fullPath
        }
        isaDB.vfsElements.add(element);
    }

    public getElementPath(element: VFSElement) {
        let path = "";
        if (element.path.length > 0) path = element.path + "/";
        path += element.title;
        return path;
    }

    public async mkdirs(path: Array<string>) {
        let walked: Array<string> = [];
        for (const shard of path.filter(shard => shard.length > 0)) {
            await this.mkdir(walked, shard);
            walked.push(shard);
        }
    }

    public async checkFolderExistence(path: Array<string>): Promise<boolean> {
        const absolutePath = path.join("/");
        const folderExists = (await isaDB.vfsElements
            .where("fullPath")
            .equals(absolutePath)
            .and(el => el.type === "folder")
            .count()) > 0;
        // console.debug("checking folder existence:", absolutePath, "exists:", folderExists)
        return folderExists;
    }

    public async createFolder(title: string) {
        const currentFolder = (await this.getCurrentElement())!;
        // Create vfs object
        const absolutePath = `${currentFolder.path.length === 0 ? "" : `${currentFolder.path}/`}${currentFolder.title}`;
        const fullPath = absolutePath + "/" + title;
        const element: VFSElement = {
            subElements: [],
            projects: [],
            parentID: currentFolder?.id ?? "",
            targetID: undefined,
            title: title,
            type: "folder",
            id: v4(),
            path: absolutePath,
            fullPath: fullPath
        }
        // Add new folder's id to list of sub elements in current folder object
        const current = await this.getCurrentElement();
        // TODo: This should be an object not an array
        isaDB.vfsElements.update(current?.id!, [
            "subElements", [...current?.subElements ?? [], element.id]
        ]);
        isaDB.vfsElements.add(element);
    }

    public async createProject(project: Project) {
        isaDB.projects.add(project);
        // Create folder object
        // const currentFolder = (await this.getCurrentElement())!;
        const current = (await this.getCurrentElement())!;

        const element: VFSElement = {
            subElements: [],
            projects: [],
            parentID: current.id ?? "",
            targetID: project.id,
            title: project.title,
            type: "project",
            id: project.id,
            path: current.fullPath,
            fullPath: current.fullPath + "/" + current.title
        }
        // Add new folder's id to list of sub elements in current folder object
        // const current = await this.getCurrentElement();
        // TODo: This should be an object not an array
        isaDB.vfsElements.update(current?.id!, {
            "subElements": [...current?.subElements ?? [], element.id]
        });
        isaDB.vfsElements.add(element);
    }

    public async getFolderFromPath(path: Array<string>) {
        return isaDB.vfsElements
            .where("fullPath")
            .equals(path.join("/"))
            .first();
    }

    public async createProjectInFolder(fullPath: Array<string>, project: Project) {
        isaDB.projects.add(project);
        // Create folder object
        // const currentFolder = (await this.getCurrentElement())!;
        const current = (await this.getFolderFromPath(fullPath))!;

        // console.log("current", current);

        const element: VFSElement = {
            subElements: [],
            projects: [],
            parentID: current.id ?? "",
            targetID: project.id,
            title: project.title,
            type: "project",
            id: project.id,
            // path: current.fullPath,
            path: current.fullPath + "/" + project.title,
            fullPath: current.fullPath + "/" + project.title
        }

        // console.log("Element VFS representation", element)

        // Add new folder's id to list of sub elements in current folder object
        // const current = await this.getCurrentElement();
        // TODo: This should be an object not an array
        isaDB.vfsElements.update(current?.id!, {
            "subElements": [...current?.subElements ?? [], element.id]
        });
        isaDB.vfsElements.add(element);
    }

    public selectProject(projectID: string) {
        if (this.state.selectedProject === projectID) return;
        this.setState(prevState => ({
            ...prevState,
            selectedProject: projectID
        }));
    }

    public closeProject() {
        if (this.state.selectedProject === undefined) return;
        this.setState(prevState => ({
            ...prevState,
            selectedProject: undefined
        }));
    }

    get setState(): StateDispatcher<ImageSorterAppState> {
        return this._setState!;
    }

    get state(): ImageSorterAppState {
        return this._state!;
    }

    get importManager(): ImportManager {
        return this._importManager;
    }

    get downloadManager(): DownloadManager {
        return this._downloadManager;
    }

    get selectionManager(): SelectionManager {
        return this._selectionManager;
    }

    get exportManager(): ExportManager {
        return this._exportManager;
    }

    get settingsManager(): SettingsManager {
        return this._settingsManager;
    }
}

export const ImageSorterAPIContext = React.createContext<ImageSorterAPI>(new ImageSorterAPI())
