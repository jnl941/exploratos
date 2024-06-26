import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { MyData } from '../data.service';
import { AuthService } from '../auth.service';
import {FormsModule} from '@angular/forms'
import { MatError, MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';

export interface Comment {
  id: number,
  text: string,
  userId: number,
  fileId: number,
  username: string
}

@Component({
  selector: 'app-file-content-view-dialog',
  templateUrl: './file-content-view-dialog.component.html',
  imports: [MatButtonModule, MatDialogClose, MatDialogContent, MatDialogActions, MatDialogTitle, MatLabel, MatFormField, MatError, FormsModule, CommonModule, NgIf, MatFormFieldModule, MatInputModule, NgFor],
  standalone: true
})

export class FileContentViewDialogComponent {
  newComment: string = ''; // Variable to store the new comment
  userId: number = -1; // User's ID
  comments: Comment[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: MyData, private apiService: ApiService, private authService: AuthService) {
     this.apiService.getUserId().subscribe(user => this.userId = user.id); // Get the user's ID from the authentication service
  }

  ngOnInit(): void {
    // Fetch comments for the file from the Spring Boot backend
      this.fetchComments()
  }

  fetchComments(): void{
    this.apiService.getCommentsFromFile(this.data.id).subscribe(comments => {
      this.comments = comments;
      this.comments.forEach(comment => {
        this.apiService.getUsernameFromId(comment.userId).subscribe(user => comment.username = user.username)
      })
    });
  }
  // Method to post the comment to the API
  postFile(): Observable<any> {
    return this.apiService.postFile(this.data.id, this.data.content, this.data.path, this.data.owner, this.data.subname)
  }
    postComment(): void {
    if (this.newComment.trim() !== '') {
      // Call the API service method to post the comment
      this.apiService.postComment(this.data.id,this.newComment, this.userId, this.data.content, this.data.owner, this.data.subname, this.data.path).subscribe(
        () => {
          // Handle successful posting of comment
          console.log('Comment posted successfully');
          // Clear the input field
          this.newComment = '';
          this.fetchComments()
          console.log(this.data.path)
          if(this.data.path.startsWith("/Github Search/")){
            this.postFile().subscribe(data => {
              console.log(data.path)
            })
          }
        },
        (error) => {
          // Handle error
          console.error('Error posting comment:', error);
        }
      );
    }
  }
}