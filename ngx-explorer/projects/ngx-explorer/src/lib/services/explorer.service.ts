import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { INode, Dictionary, Data } from '../shared/types';
import { Utils } from '../shared/utils';
import { DataService } from './data.service';
import { CONFIG, VIEWS } from '../shared/providers';

@Injectable({
    providedIn: 'root',
})
export class ExplorerService {
    private config = inject(CONFIG);
    private dataService = inject(DataService);
    private flatPointers: Dictionary<INode> = { [this.internalTree.id]: this.internalTree };
    private internalTree = Utils.createNode(this.config.homeNodeName || 'Home', 0, false, {}, true);
    private readonly openedNode$$ = new BehaviorSubject<INode | undefined>(undefined);
    private readonly root$$ = new BehaviorSubject<INode>(this.internalTree);
    private readonly selectedNodes$$ = new BehaviorSubject<INode[]>([]);
    private views = inject(VIEWS);
    public readonly currentView$ = new BehaviorSubject<string>(this.config.defaultView || this.views[0].name);
    /**
     * An Observable that emits the currently opened directory in the explorer.
     * Subscribers can use this to react to changes in the opened directory.
     */
    public readonly openedDir$ = this.openedNode$$.asObservable();
    /**
     * An Observable that emits the root node of the explorer.
     * Subscribers can use this to react to changes in the root node.
     */
    public readonly root$ = this.root$$.asObservable();
    /**
     * An Observable that emits the currently selected nodes in the explorer.
     * Subscribers can use this to react to changes in the selection.
     */
    public readonly selection$ = this.selectedNodes$$.asObservable();

    private getContent(id: number) {
        const parent = this.flatPointers[id];

        if (!parent) {
            throw new Error('Node not found');
        }

        //if (parent.isLeaf) {
        //    throw new Error('Cannot open a file node');
        //}
        
        console.log("BEFORE LEAFING")
        return this.dataService.getContent(parent.data).pipe(
            tap(({ files, dirs }) => {
                if(parent.isLeaf){
                    console.log("AFTER LEAFING")
                    return;
                }
                console.log("AFTER LEAFING2")

                const newDirNodes = dirs.map((data) => Utils.createNode(this.dataService.getName(data), id, false, data));
                const newFileNodes = files.map((data) => Utils.createNode(this.dataService.getName(data), id, true, data));
                const newChildren = newDirNodes.concat(newFileNodes);
                const added = newChildren.filter((c) => !parent.children.find((o) => Utils.compareObjects(o.data, c.data)));
                const removed = parent.children.filter((o) => !newChildren.find((c) => Utils.compareObjects(o.data, c.data)));

                removed.forEach((c) => {
                    const index = parent.children.findIndex((o) => o.id === c.id);
                    parent.children.splice(index, 1);
                    delete this.flatPointers[c.id];
                });

                added.forEach((c) => {
                    parent.children.push(c);
                    this.flatPointers[c.id] = c;
                });

                const nodeChildren = parent.children.filter((c) => !c.isLeaf);
                const leafChildren = parent.children.filter((c) => c.isLeaf);
                parent.children = nodeChildren.concat(leafChildren);

                this.root$$.next(this.internalTree);
            })
        );
    }

    public collapse(id: number) {
        const parent = this.flatPointers[id];
        parent.expanded = false;
        this.root$$.next(this.internalTree);
    }

    /**
     * Creates a new directory with the given name in the currently opened directory.
     * @param name The name of the new directory.
     */
    public createDir(name: string) {
        if (this.config.features?.createDir === false) {
            throw new Error('Create directory feature is disabled');
        }

        const parent = this.openedNode$$.value;
        this.dataService.createDir(parent!.data, name).subscribe(() => {
            this.refresh();
        });
    }

    /**
     * Downloads the currently selected file.
     */
    public download() {
        if (this.config.features?.download === false) {
            throw new Error('Download feature is disabled');
        }

        const target = this.selectedNodes$$.value[0];
        this.dataService.downloadFile(target.data).subscribe(() => {
            this.refresh();
        });
    }

    /**
     * Expands the node with the given id.
     * @param id The id of the node to expand.
     */
    public expand(id: number) {
        const parent = this.flatPointers[id];
        parent.expanded = true;
        this.getContent(id).subscribe();
    }

    /**
     * Returns the node with the given id.
     * @param id The id of the node to retrieve.
     */
    public getNode(id: number) {
        return this.flatPointers[id];
    }

    /**
     * Opens the node with the given id. If no id is provided, the root node is opened.
     * @param id The id of the node to open.
     */
    public openNode(id?: number) {
        if (!id) {
            id = this.internalTree.id;
        }

        this.getContent(id).subscribe(() => {
            const parent = this.flatPointers[id!];
            this.openedNode$$.next(parent);
            this.selectedNodes$$.next([]);
        });
    }

    /**
     * Open node and get all parent nodes
     * Ideal for opening a previously opened node by value
     */
    public openTree(data: Data) {
        this.dataService.openTree(data).subscribe((dataNodes) => {
            const queue = [
                {
                    parent: this.internalTree,
                    children: dataNodes,
                },
            ];

            let lastParent = this.internalTree;
            while (queue.length > 0) {
                const { parent, children } = queue.shift()!;
                lastParent = parent;
                children.forEach((child) => {
                    const node = Utils.createNode(this.dataService.getName(child.data), parent.id, child.isLeaf, child.data);
                    parent.children.push(node);
                    this.flatPointers[node.id] = node;
                    if (!node.isLeaf && child.children && child.children.length > 0) {
                        parent.expanded = true;
                        queue.push({
                            parent: node,
                            children: child.children,
                        });
                    }
                });
            }

            this.root$$.next(this.internalTree);
            this.openedNode$$.next(lastParent);
            this.selectedNodes$$.next([]);
        });
    }

    /**
     * Refreshes the currently opened node.
     */
    public refresh() {
        this.openNode(this.openedNode$$.value!.id);
    }

    /**
     * Removes the currently selected nodes.
     */
    public remove() {
        if (this.config.features?.delete === false) {
            throw new Error('Delete feature is disabled');
        }

        const selection = this.selectedNodes$$.value;
        if (selection.length === 0) {
            throw new Error('Nothing selected to remove');
        }

        const targets = selection.map((node) => this.flatPointers[node.id].data);
        this.dataService.delete(targets).subscribe(() => {
            this.refresh();
        });
    }

    /**
     * Renames the currently selected node.
     * @param name The new name for the node.
     */
    public rename(name: string) {
        if (this.config.features?.rename === false) {
            throw new Error('Rename feature is disabled');
        }

        const nodes = this.selectedNodes$$.value;
        if (nodes.length > 1) {
            throw new Error('Multiple selection rename not supported');
        }
        if (nodes.length === 0) {
            throw new Error('Nothing selected to rename');
        }

        const node = nodes[0];
        this.dataService.rename(node.data, name).subscribe(() => {
            this.refresh();
        });
    }

    public runFile() {
        const target = this.selectedNodes$$.value[0];
        this.dataService.runFile(target.data);
    }

    /**
     * Sets the selected nodes in the explorer.
     * @param nodes The nodes to select.
     */
    public select(nodes: INode[]) {
        this.selectedNodes$$.next(nodes);
    }

    /**
     * Uploads the given files to the currently opened directory.
     * @param files The files to upload.
     */
    public upload(files: FileList) {
        if (this.config.features?.upload === false) {
            throw new Error('Upload feature is disabled');
        }

        const node = this.openedNode$$.value!;
        this.dataService.uploadFiles(node.data, files).subscribe(() => {
            this.refresh();
        });
    }
}
