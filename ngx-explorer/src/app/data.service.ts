import { forkJoin, map, Observable, of, Subscriber } from 'rxjs';
import { Data, IDataService, DataNode } from 'ngx-explorer';
import { FileFetcherService } from './file-fetcher.service';
import { MatFormFieldModule, MatFormFieldControl, MatFormField } from '@angular/material/form-field';
import { inject, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { GithubService } from './github.service';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { FileContentViewDialogComponent } from './file-content-view-dialog/file-content-view-dialog.component';
import { ApiService } from './api.service';
import { ArticleScrapping } from './api.service';
import { Md5 } from 'ts-md5';
import { GraphViewDialogComponent } from './graph-view-dialog/graph-view-dialog.component';
import { ExecutorService } from './executor.service';

// Definición de la interfaz de la entidad para el explorador
export interface MyExplorerEntity extends Data {
    id: number;
    name: string;
    subname: string;
    path: string;
    content: string;
    owner: string;
}

// let mock_directories = [
//     { id: 1, name: 'Music', path: '/' },
//     { id: 2, name: 'Movies', path: '/' },
//     { id: 3, name: 'Books', path: '/' },
//     { id: 4, name: 'Games', path: '/' },
//     { id: 5, name: 'Rock', path: '/Music/' },
//     { id: 6, name: 'Jazz', path: '/Music/' },
//     { id: 11, name: 'Very Long Name to display overflow', path: '/' },

//     { id: 7, name: 'Classical', path: '/Music/' },
//     { id: 15, name: 'Aerosmith', path: '/Music/Rock/' },
//     { id: 17, name: 'Led Zeppelin', path: '/Music/Rock/' },
//     { id: 18, name: 'The Beatles', path: '/Music/Rock/' },
// ] as MyExplorerEntity[];

// let mock_files = [
//     { id: 1312, name: 'notes.txt', path: '/', content: 'This is a note' },
//     { id: 1212, name: '2.txt', path: '/', content: 'This is another file' },
//     { id: 29, name: 'Back in the U.S.S.R.txt', path: '/Music/Rock/The Beatles/', content: 'This is a Beatles song' },
//     { id: 30, name: 'All You Need Is Love.txt', path: '/Music/Rock/The Beatles/', content: 'This is another Beatles song' },
//     { id: 31, name: 'Hey Jude.txt', path: '/Music/Rock/The Beatles/', content: 'This is yet another Beatles song' },
//     { id: 32, name: 'Dream On.txt', path: '/Music/Rock/Aerosmith/', content: 'This is an Aerosmith song' },
//     { id: 33, name: 'Sweet Emotion.txt', path: '/Music/Rock/Aerosmith/', content: 'This is another Aerosmith song' },
//     { id: 34, name: 'Walk This Way.txt', path: '/Music/Rock/Aerosmith/', content: 'This is yet another Aerosmith song' },
//     { id: 35, name: 'Stairway to Heaven.txt', path: '/Music/Rock/Led Zeppelin/', content: 'This is a Led Zeppelin song' },
// ] as MyExplorerEntity[];

// Nodos predefinidos para GitHub, scrapping de artículos y carpeta guardada

const Saved_Node = {
    id: 0,
    name: "Saved",
    path: "/"
} as MyExplorerEntity

@Injectable()
export class ExampleDataService implements IDataService<MyExplorerEntity> {
    private id = 0;
    private folderId = 1000;

    files: MyExplorerEntity[] = [];
    directories: MyExplorerEntity[] = [];

    constructor(private fileFetcherService: FileFetcherService, 
        private githubService: GithubService, 
        public dialog: MatDialog, 
        private apiService: ApiService,
        private executorService: ExecutorService) {
            // Obtener archivos y directorios
            this.fileFetcherService.getFilesAndDirectories().subscribe((data: { files: MyExplorerEntity[]; directories: MyExplorerEntity[]; }) => {
            this.files = data.files;
            this.directories = [Saved_Node, ...data.directories];
        });
    }
    refresh() {
        this.fileFetcherService.getFilesAndDirectories().subscribe((data: { files: MyExplorerEntity[]; directories: MyExplorerEntity[]; }) => {
            this.files = data.files;
            this.directories = [Saved_Node, ...data.directories];
        });
    }
    runFile(target: MyExplorerEntity): Observable<MyExplorerEntity> {
        this.executorService.executeAndGet(target.path+target.name).subscribe(result => console.log(result))
        console.log("running file")
        return of(target)
    }

    // Métodos para gestionar archivos y directorios

    downloadFile(data: MyExplorerEntity): Observable<any> {
        // Descargar un archivo (solo funciona en local)
        const file = this.files.find((f) => f.id === data.id);

        const myblob = new Blob([file!.content], {
            type: 'text/plain',
        });
        const objectUrl = window.URL.createObjectURL(myblob);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

        a.href = objectUrl;
        a.download = file!.name;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
        return of(null);
    }

    
    uploadFiles(parent: MyExplorerEntity, files: FileList): Observable<any> {
        // Subir un archivo (NO FUNCIONA)
        const results = [];

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;
            const obs = new Observable((observer: Subscriber<any>): void => {
                const reader = new FileReader();

                const id = ++this.id;

                reader.onload = () => {
                    const nodePath = parent ? this.directories.find((f) => f.id === parent.id)!.path : '';
                    const newFile = { id, name: file.name, path: nodePath + '/' + file.name, content: reader.result as string, owner: '', subname: ''};
                    this.files.push(newFile);
                    observer.next(reader.result);
                    observer.complete();
                };
                reader.readAsText(file);
            });
            results.push(obs);
        }

        return forkJoin(results);
    }

    delete(datas: MyExplorerEntity[]): Observable<any> {
        // Borrar un archivo (NO FUNCIONA)
        const results = datas.map((data) => {
            const path = data.path + '/';
            this.files = this.files.filter((f) => !f.path.startsWith(path));
            this.directories = this.directories.filter((f) => !f.path.startsWith(path));
            this.directories = this.directories.filter((f) => f.id !== data.id);
            return of({});
        });
        return forkJoin(results);
    }

    createDir(parent: MyExplorerEntity, name: string): Observable<any> {
        // Crear una carpeta (NO FUNCIONA)
        const path = (parent.path ? parent.path + '/' : '') + name.replace(/[\W_]+/g, ' ');
        const id = ++this.folderId;
        const newFolder = { path, id, name, content: '', owner: '', subname: ''};
        this.directories.push(newFolder);
        return of(newFolder);
    }

    private openFileContentViewDialog(parent: any): Observable<any> {
        // Para archivos: Abrir la ventana para ver el contenido
        const dialogRef = this.dialog.open(FileContentViewDialogComponent, {
            width: '80%',
            height: '90%',
            data: parent
        });
        
        throw new Error("IGNORAR: Cortar proceso de getContents() del módulo base");
        return dialogRef.afterClosed().pipe(
            map(() => ({ files: this.files, dirs: this.directories.filter(data => data.path == parent.path) }))
        );
    }

    private openGraphViewDialog(parent: any): Observable<any> {
        // Para archivos: Abrir la ventana para ver el contenido
        const dialogRef = this.dialog.open(GraphViewDialogComponent, {
            width: '80%',
            height: '90%',
            data: parent
        });
        
        throw new Error("IGNORAR: Cortar proceso de getContents() del módulo base");
        return dialogRef.afterClosed().pipe(
            map(() => ({ files: this.files, dirs: this.directories.filter(data => data.path == parent.path) }))
        );
    }
      
    private handleUrlContent(parent: any): Observable<any> {
        // Para archivos: Abrir la ventana para ver el contenido, el contenido se coge con un GET automáticamente de la URL que tiene el archivo
        return new Observable<any>((observer) => {
            this.githubService.getFileContentByUrl(parent.content).subscribe((response: any) => {
                const content = atob(response.content);
                const newParent = parent
                newParent.content = content
                const dialogRef = this.dialog.open(FileContentViewDialogComponent, {
                    width: '80%',
                    height: '90%',
                    data: newParent 
                });
    
        throw new Error("IGNORAR: Cortar proceso de getContents() del módulo base");
        dialogRef.afterClosed().subscribe(() => {
                    observer.next({ files: this.files.filter(data => data.path == parent.path), dirs: this.directories.filter(data => data.path == parent.path) });
                    observer.complete();
                });
            });
        });
    }
    

    getContent(data: MyExplorerEntity): Observable<any> {
        // Método que controla si se abre un archivo o una carpeta y qué tipo de carpeta se abre: Local, Falsa, De Scrapping u Online
        if (data.path && data.name.startsWith("pos-tracer")) {
            // Archivos/Carpetas online de la API de Github
            if (data.content.startsWith('http')) {
                return this.handleUrlContent(data);
            } else {
                return this.openGraphViewDialog(data);
            }
        } else if (data.path && data.path.startsWith("/Saved/")) {
            // Archivos locales comentados
            if (data.content.startsWith('http')) {
                return this.handleUrlContent(data);
            } else {
                return this.openFileContentViewDialog(data);
            }
        } else if(data.name == "Saved"){
            return new Observable((observer) => {
                this.apiService.getCommentedFiles().subscribe((response) => {
                    const files = response.files.map((file: any) => ({
                        id: file.id,
                        name: file.name,
                        subname: file.name,
                        path: "/Saved/"+file.path,
                        content: file.content,
                        owner: file.owner
                    }));
                    observer.next({ files, dirs: [] });
                    observer.complete();
                });
            });
        } else {
            if (this.files.find((file) => file.id === data.id)){
                if (data.content.startsWith('http')) {
                    return this.handleUrlContent(data);
                } else {
                    return this.openFileContentViewDialog(data);
                }
            }
            const folderPath = data.path || '/';
            const name = data.name ? data.name + '/' : '';
            const fullPath = folderPath + name;
            const dirs = this.directories.filter((f) => f.path === fullPath);
            const files = this.files.filter((f) => f.path === fullPath);
            return of({ files, dirs });
        }
    }
    

    // getContent(data: MyExplorerEntity): Observable<any> {
    //     // Método que controla si se abre un archivo o una carpeta y qué tipo de carpeta se abre: Local, Falsa, De Scrapping u Online
    //     if (data.path && data.name.endsWith("/Github Search")) {
    //         // Archivos/Carpetas online de la API de Github
    //         if (data.content != ""){
    //             if (data.content.startsWith('http')) {
    //                 return this.handleUrlContent(data);
    //             } else {
    //                 return this.openFileContentViewDialog(data);
    //             }
    //         }
            
    //         const repoName = data.path.replace("/Github Search/","");
    //         const owner = data.owner;
    //         console.log("In");
    //         return this.githubService.getRepositoryContents(owner, repoName, data.subname).pipe(
    //             map((contents: any[]) => {
    //                 const files = contents.filter((item) => item.type === "file").map((file: any) => ({
    //                     id: Md5.hashStr(file.sha, true)[0],
    //                     name: file.name,
    //                     subname: file.path,
    //                     path: `/Github Search/${repoName}`,
    //                     content: file.url,
    //                     owner: owner
    //                 }));
    //                 const dirs = contents.filter((item) => item.type === "dir").map((dir: any) => ({
    //                     id: dir.sha,
    //                     name: dir.name,
    //                     subname: dir.path,
    //                     path: `/Github Search/${repoName}`,
    //                     content: '',
    //                     owner: owner
    //                 }));
    //                 return { files, dirs };
    //             })
    //         );
    //     } else if (data.path && data.path.startsWith("/Articles/")) {
    //         // Artículos a modo de archivos del Scrapping del blog de Github
    //         return this.openFileContentViewDialog(data);
    //     }  else if (data.path && data.path.startsWith("/Saved/")) {
    //         // Archivos locales comentados
    //         return this.openFileContentViewDialog(data);
    //     } else if(data.id != 0 && data.name != "Github Search" && data.name != "Articles"){
    //         // Carpeta falsa "Github Search" para abrir la ventana despegable y buscar
    //         if (this.files.find((file) => file.id === data.id)){
    //             if (data.content.startsWith('http')) {
    //                 return this.handleUrlContent(data);
    //             } else {
    //                 return this.openFileContentViewDialog(data);
    //             }
    //         }
    //         const folderPath = data.path || '/';
    //         const name = data.name ? data.name + '/' : '';
    //         const fullPath = folderPath + name;
    //         const dirs = this.directories.filter((f) => f.path === fullPath);
    //         const files = this.files.filter((f) => f.path === fullPath);
    //         return of({ files, dirs });
    //     } else if(data.name == "Articles"){
    //         // Carpeta falsa "Github Search" para abrir la ventana despegable y buscar
    //         return this.apiService.getArticles().pipe(
    //             map((contents: ArticleScrapping[]) => {
    //                 const files = contents.map((article: ArticleScrapping) => ({
    //                     id: Md5.hashStr(article.title, true)[0],
    //                     name: article.title,
    //                     subname: article.title,
    //                     path: `/Articles/`,
    //                     content: article.text,
    //                     owner: "Github"
    //                 }));
    //                 return { files, dirs: [] };
    //             })
    //         );
    //     } else if(data.name == "Saved"){
    //         return new Observable((observer) => {
    //             this.apiService.getCommentedFiles().subscribe((response) => {
    //                 const files = response.files.map((file: any) => ({
    //                     id: file.id,
    //                     name: file.name,
    //                     subname: file.name,
    //                     path: "/Saved/"+file.path,
    //                     content: file.content,
    //                     owner: file.owner
    //                 }));
    //                 observer.next({ files, dirs: [] });
    //                 observer.complete();
    //             });
    //         });
    //     } else {
    //         const dialogRef = this.dialog.open(SearchDialogComponent);
    
    //         return dialogRef.afterClosed().pipe(
    //             switchMap((result: string) => {
    //                 if (result) {
    //                     return this.githubService.searchRepositories(result).pipe(
    //                         map((result: { items: any[] }) => {
    //                             const repositories: MyExplorerEntity[] = result.items.map((repo: any) => ({
    //                                 id: repo.id,
    //                                 name: repo.name,
    //                                 subname: '',
    //                                 path: `/Github Search/${repo.name}`,
    //                                 content: '', // Add the 'content' property with an empty string value,
    //                                 owner: repo.owner.login
    //                             }));
                                
    //                             return { files: [], dirs: repositories }; // Assign 'repositories' to 'dirs'
    //                         })
    //                     );
    //                 } else {
    //                     // If no result is provided, return an observable with empty files and dirs
    //                     return of({ files: [], dirs: [] });
    //                 }
    //             })
    //         );
    //     }
    // }

    rename(data: MyExplorerEntity, newName: string) {
        const node = this.directories.find((f) => f.id === data.id);
        if (node) {
            node.name = newName;
            return of(node);
        }
        const leaf = this.files.find((f) => f.id === data.id);
        if (leaf) {
            leaf.name = newName;
            return of(leaf);
        }
        return of({}) as Observable<any>;
    }

    getName(data: MyExplorerEntity) {
        return data.name;
    }

    openTree(data: MyExplorerEntity): Observable<Array<DataNode<MyExplorerEntity>>> {
        const fullPath = data.path + data.name + '/';
        const paths = fullPath.split('/').slice(0, -1);
        const parentPaths = [] as string[];
        while (paths.length > 0) {
            const path = paths.join('/') + '/';
            parentPaths.unshift(path);
            paths.pop();
        }

        const observables = parentPaths.map((path) => {
            const dirs = this.directories.filter((f) => f.path === path);
            const files = this.files.filter((f) => f.path === path);
            const nodes = dirs.concat(files);
            return of(nodes);
        });

        return forkJoin(observables).pipe(
            map((dataNodesLevels) => {
                const trees = [] as Array<DataNode<MyExplorerEntity>>;
                let parent = trees;
                parentPaths.shift(); // remove the first path, it's the root

                dataNodesLevels.forEach((dataNodes, index) => {
                    const childrenNodes = dataNodes.map((data) => ({
                        data,
                        children: [],
                        isLeaf: !!data.content,
                    }));
                    parent.push(...childrenNodes);
                    const parentPath = parentPaths[index];
                    const nextParent = childrenNodes.find((n) => parentPath === n.data.path + n.data.name + '/');
                    parent = nextParent ? nextParent.children : [];
                });
                return trees;
            })
        );
    }
}
