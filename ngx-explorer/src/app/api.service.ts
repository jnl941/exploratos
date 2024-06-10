import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface ArticleScrapping {
    title: string;
    text: string;
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private apiUrl = 'http://localhost:8080'; // Update with your API URL
    private articlesScrappingUrl = 'http://localhost:8080/api/articles/githubArticles';
    constructor(
        private http: HttpClient,
        private injector: Injector
    ) {}

    getArticles(): Observable<any> {
        return this.http.get(this.articlesScrappingUrl);
    }

    getCommentedFiles(): Observable<any> {
        return this.http.get(`http://localhost:8080/api/files`);
    }
    getCommentsFromFile(fileId: number): Observable<any> {
        return this.http.get<any[]>(`http://localhost:8080/api/savedfiles/${fileId}/comments`);
    }
    getUsernameFromId(userId: number): Observable<any> {
        return this.http.get<any[]>(`http://localhost:8080/api/users/${userId}`);
    }
    postFile(id: number, content: string, path: string, owner: string, name: string) {
      const body = {
        id: id,
        content: content,
        path: path,
        owner: owner, // Include the user's ID in the request body
        name: name // Include the user's ID in the request body
      };
      return this.http.post<any>(`${this.apiUrl}/api/savedfiles/${body.id}`, body).pipe(
          catchError((error) => {
              console.error('Error posting comment:', error);
              throw error; // Throw the error for the component to handle
          })
      );
    }

    getUserId(): Observable<any> {
        const authService = this.injector.get(AuthService);
        return this.http.get<any>(`${this.apiUrl}/api/findUsers/${authService.getUsername()}`);
    }
    // Method to post a comment to a file
    postComment(
        fileId: number,
        comment: string,
        userId: number,
        content: string,
        fileOwner: string,
        fileName: string,
        path: string
    ): Observable<any> {
        const body = {
            text: comment,
            userId: userId,
            content: content,
            path: path,
            fileName: fileName,
            fileOwner: fileOwner, // Include the user's ID in the request body
        };
        return this.http.post<any>(`${this.apiUrl}/api/savedfiles/${fileId}/comments`, body).pipe(
            catchError((error) => {
                console.error('Error posting comment:', error);
                throw error; // Throw the error for the component to handle
            })
        );
    }
}
