// github.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiGithubToken } from './token';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com/search/repositories';
  private apiRepoUrl = 'https://api.github.com';


  constructor(private http: HttpClient) {}

  searchRepositories(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `token ${apiGithubToken}`
    });

    const params = new HttpParams()
      .set('q', query)
      .set('sort', 'stars')
      .set('order', 'desc');

    return this.http.get(this.apiUrl, { headers, params });
  }

  getRepositoryContents(owner: string, repo: string, name: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `token ${apiGithubToken}`
    });

    return this.http.get<any[]>(`${this.apiRepoUrl}/repos/${owner}/${repo}/contents/${name}`, { headers });
  }
  
  getFileContentByUrl(url: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `token ${apiGithubToken}`
    });

    return this.http.get<any>(url, { headers });
  }
}
