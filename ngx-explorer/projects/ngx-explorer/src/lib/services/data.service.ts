import { Injectable } from '@angular/core';
import { IDataService, Data, DataNode } from '../shared/types';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class DataService implements IDataService<Data> {
    abstract getContent(data: Data): Observable<{ files: Data[]; dirs: Data[] }>;
    abstract createDir(data: Data, name: string): Observable<Data>;
    abstract rename(data: Data, newName: string): Observable<Data>;
    abstract delete(data: Data[]): Observable<Data>;
    abstract uploadFiles(data: Data, files: FileList): Observable<Data>;
    abstract runFile(data: Data): Observable<Data>;
    abstract downloadFile(data: Data): Observable<Data>;
    abstract getName(data: Data): string;
    abstract openTree(data: Data): Observable<Array<DataNode<Data>>>;
}
