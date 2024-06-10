import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyExplorerEntity } from './data.service';

interface FilesAndDirectories {
  files: MyExplorerEntity[];
  directories: MyExplorerEntity[];
}

@Injectable({
  providedIn: 'root'
})
export class FileFetcherService {
  private apiUrl = 'http://localhost:8080/api/files';

  constructor(private http: HttpClient) {}

  getFilesAndDirectories(): Observable<FilesAndDirectories> {
    return this.http.get<FilesAndDirectories>(this.apiUrl);
  }
}
