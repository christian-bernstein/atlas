import {APIShard} from "./APIShard";
import {v4} from "uuid";
import {DuplexEventRelay} from "./DuplexEventRelay";
import {Project} from "./Project";

export class ImportManager extends APIShard {

    public async importFileStructure(files: Array<File>, eventRelay: DuplexEventRelay) {
        const errors: Map<string, Array<any>> = new Map<string, Array<any>>([
            ["folder", []],
            ["project", []],
            ["image", []],
        ]);

        const updateProcessStateTitle = (title: string) => {
            eventRelay.fire({
                channel: "update-state-title",
                data: title
            });
        }

        // Generate all folders
        updateProcessStateTitle("Creating folders");
        const relativeRootFolder = (await this.api().getCurrentElement())!;
        for (const path of Array.from(new Set(files
            .map(file => (file as any).path as string)
            .map(path => path.split("/"))
            .map(path => path.slice(0, -1))
            .map(path => path.filter(dir => dir.length > 0))
            .map(path => path.join("/"))
        ))) {
            const absolutePath = `${relativeRootFolder.path}/${relativeRootFolder.title}/${path}`;
            try {
                await this.api().mkdirs(absolutePath.split("/"));
                eventRelay.fire({
                    channel: "folder-created",
                    data: absolutePath
                });
            } catch (e) {
                errors.get("folder")!.push(e);
                eventRelay.fire({
                    channel: "error",
                    data: e
                });
            }
        }

        // Generate all projects
        updateProcessStateTitle("Creating projects");
        for (const path of Array.from(new Set(files
            .map(file => (file as any).path as string)
            .map(path => path.split("/"))
            .map(path => path.slice(0, -1))
            .map(path => path.filter(dir => dir.length > 0))
            .map(path => path.join("/"))
        ))) {

            const shards = (`${relativeRootFolder.path}/${relativeRootFolder.title}/${path}`).split("/").filter(shard => shard.length > 0);
            const folder = shards.slice(0, -1);
            const projectName = shards[shards.length - 1];
            try {
                const project: Project = {
                    title: projectName,
                    id: v4(),
                    meta: "{}",
                    tags: [],
                    resources: []
                }
                await this.api().createProjectInFolder(folder, project);
                eventRelay.fire({
                    channel: "project-created",
                    data: project
                });
            } catch (e) {
                errors.get("project")!.push(e);
                eventRelay.fire({
                    channel: "error",
                    data: e
                });
            }
        }

        // Import all images into their related projects
        updateProcessStateTitle("Importing images");
        for (const file of files) {
            const path = (file as any).path as string
            const shards = (`${relativeRootFolder.path}/${relativeRootFolder.title}/${path}`).split("/").filter(shard => shard.length > 0);
            const projectFolderAddress = shards.slice(0, -2);
            const projectName = shards.slice(-2, -1)[0];
            const fileName = shards[shards.length - 1];
            try {
                await this.api().addImageToProject(projectFolderAddress, projectName, [file]);
                eventRelay.fire({
                    channel: "image",
                    data: {
                        projectFolderAddress: projectFolderAddress,
                        projectName: projectName,
                        fileName: fileName,
                        file: file
                    }
                });
            } catch (e) {
                errors.get("image")!.push(e);
                eventRelay.fire({
                    channel: "error",
                    data: e
                });
            }
        }

        eventRelay.fire({
            channel: "finish",
            data: {
                errors: errors,
                errorCount: Array.from(errors.values()).map(arr => arr.length).reduce((acc, num) => acc + num, 0)
            }
        });
    }
}
