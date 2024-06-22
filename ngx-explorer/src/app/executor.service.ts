import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, max, reduce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExecutorService {

  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {}

  executeAndGet(filePath: string): Observable<String> {
    console.log("got inside execute and get")
    return this.http.get<String>(this.apiUrl + "execFile?filePath="+filePath)
  }
}
