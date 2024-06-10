import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {FormsModule} from '@angular/forms'
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatFormField, MatButtonModule, FormsModule, MatError, MatInput, NgIf, MatDialogTitle, FormsModule],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.scss'
})
export class RegisterDialogComponent {
  usernameRegister: string = "";
  passwordRegister: string = "";
  errorRegister: string = "";

  constructor(private dialogRef: MatDialogRef<RegisterDialogComponent>, private http: HttpClient, private dialog: MatDialog, private authService: AuthService) {}

  register(): void {
      if(this.usernameRegister === '' && this.passwordRegister === '') {
        this.errorRegister = "Register invalid"
        console.log(this.usernameRegister)
        console.log(this.passwordRegister)
        return
      }
    this.authService.register(this.usernameRegister, this.passwordRegister).subscribe(
              response => {
                  console.log('Registration successful:', response);
                  // Assuming the registration is successful, close the dialog
                  this.authService.saveUsername(this.usernameRegister)
                  this.dialogRef.close('success');
              },
              error => {
                  console.error('Registration failed:', error);
                  this.errorRegister = "Username already taken"
                  // Handle registration failure
              }
          );
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
        disableClose: true
    });

    this.dialogRef.close("failed")
    }
}