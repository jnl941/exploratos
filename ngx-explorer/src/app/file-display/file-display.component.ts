import { Component, OnInit } from '@angular/core';
import { FileFetcherService } from '../file-fetcher.service';
import { CommonModule } from '@angular/common';
import { MyExplorerEntity } from '../data.service';

@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.component.html',
  styleUrls: ['./file-display.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class FileDisplayComponent implements OnInit {
  files: MyExplorerEntity[] = [];
  directories: MyExplorerEntity[] = [];

  constructor(private fileFetcherService: FileFetcherService) {}

  ngOnInit(): void {
    this.fileFetcherService.getFilesAndDirectories().subscribe(data => {
      this.files = data.files;
      this.directories = data.directories;
    });
  }
}
