import { HttpClient } from '@angular/common/http';
import { Component, Input, NgModule } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Add this line
import { CommonModule } from '@angular/common';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { MatInput } from '@angular/material/input';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
imports: [CommonModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatFormField, MatButtonModule, FormsModule, MatError, MatInput],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent {
  usernameLogin: string = "";
  passwordLogin: string = "";
  errorLogin: string = "";
  
  constructor(private dialogRef: MatDialogRef<LoginDialogComponent>, private http: HttpClient, private dialog: MatDialog, private authService: AuthService) {}
  
  login(): void {
    if(this.usernameLogin.length + this.passwordLogin.length == 0) {
      this.errorLogin = "Login invalid"
      console.log(this.usernameLogin)
      console.log(this.passwordLogin)
      return
    }
      
        this.authService.login(this.usernameLogin, this.passwordLogin).subscribe(
              response => {
                  console.log('Login successful:', response);
                  // Assuming the login is successful, close the dialog
                  this.authService.saveUsername(this.usernameLogin)
                  this.dialogRef.close('success');
              },
              error => {
                  console.error('Login failed:', error);
                  this.errorLogin = "Login failed"
                  // Handle login failure
              }
          );
  }

  openRegisterDialog(): void {
    const dialogRef2 = this.dialog.open(RegisterDialogComponent);

    this.dialogRef.close()
  }
  close(): void {
      // Close the dialog without logging in
      this.dialogRef.close();
  }
}