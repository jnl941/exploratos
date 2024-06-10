import { Type } from '@angular/core';
import { Observable } from 'rxjs';

export interface Data {
    [key: string]: any;
}

export interface INode {
    id: number;
    name: string;
    parentId: number;
    data: Data;
    isLeaf: boolean;
    expanded: boolean;
    children: INode[];
}

export interface Dictionary<T> {
    [Key: string]: T;
}

export interface DataNode<T> {
    data: T;
    isLeaf: boolean;
    children: DataNode<T>[];
}

export interface IDataService<T extends Data> {
    /**
     *  Get content of the given directory
     */
    getContent(target: T): Observable<{ files: T[]; dirs: T[] }>;

    /**
     * Create a new directory
     */
    createDir(parent: T, name: string): Observable<T>;

    /**
     * Rename the given directory
     */
    rename(target: T, newName: string): Observable<T>;

    /**
     * Delete the given directory
     */
    delete(target: T[]): Observable<T>;

    /**
     * Upload files to the given directory
     */
    uploadFiles(parent: T, files: FileList): Observable<T>;

    /**
     * Download the given file
     */
    downloadFile(target: T): Observable<T>;

    /**
     * Get all parent directories of the given directory, and their children
     */
    openTree(data: T): Observable<Array<DataNode<T>>>;

    // move(from to) // TODO: on/off in settings
    // copyPaste(from to) // TODO: on/off in settings
    // cutPaste(from to) // TODO: on/off in settings
}

export interface View {
    name: string;
    icon: string;
    component: Type<any>;
}

export interface NgeExplorerConfig {
    homeNodeName: string;
    defaultView: string;
    multipleSelection?: boolean;
    features?: {
        delete?: boolean;
        upload?: boolean;
        download?: boolean;
        rename?: boolean;
        createDir?: boolean;
    };
}
