// search-dialog.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this line
import { MatDialogRef, MatDialogActions, MatDialogTitle, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';


@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  imports: [MatFormField, CommonModule, FormsModule, MatInputModule, MatDialogActions, MatDialogTitle, MatDialogContent, MatDialogClose],
  standalone: true
})
export class SearchDialogComponent {
  query: string = '';

  constructor(public dialogRef: MatDialogRef<SearchDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSearch(): void {
    this.dialogRef.close(this.query);
  }
}
