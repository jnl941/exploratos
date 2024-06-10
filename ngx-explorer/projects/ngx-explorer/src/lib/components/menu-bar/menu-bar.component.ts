import { Component, ElementRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { map, take } from 'rxjs';
import { NgeExplorerConfig } from '../../shared/types';
import { ExplorerService } from '../../services/explorer.service';
import { ViewSwitcherComponent } from '../view-switcher/view-switcher.component';
import { CONFIG } from '../../shared/providers';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'nxe-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [ViewSwitcherComponent, AsyncPipe],
})
export class MenuBarComponent {
    @ViewChild('uploader', { static: true }) uploader!: ElementRef;

    protected explorerService: ExplorerService = inject(ExplorerService);
    protected config: NgeExplorerConfig = inject(CONFIG);

    protected featDelete = this.config.features?.delete;
    protected featUpload = this.config.features?.upload;
    protected featDownload = this.config.features?.download;
    protected featRename = this.config.features?.rename;
    protected featCreateDir = this.config.features?.createDir;

    protected canDownload$ = this.explorerService.selection$.pipe(map((n) => n.length === 1 && n[0].isLeaf));
    protected canDelete$ = this.explorerService.selection$.pipe(map((n) => n.length > 0));
    protected canRename$ = this.explorerService.selection$.pipe(map((n) => n.length === 1));

    createDir() {
        const name = prompt('Enter new name');
        if (name) {
            this.explorerService.createDir(name);
        }
    }

    refresh() {
        this.explorerService.refresh();
    }

    rename() {
        this.explorerService.selection$
            .pipe(
                take(1),
                map((n) => n[0])
            )
            .subscribe((node) => {
                const oldName = node.name;
                const newName = prompt('Enter new name', oldName);
                if (newName) {
                    this.explorerService.rename(newName);
                }
            });
    }

    remove() {
        if (confirm('Are you sure you want to delete the selected files?')) {
            this.explorerService.remove();
        }
    }

    openUploader() {
        this.uploader.nativeElement.click();
    }

    handleFiles(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
            return;
        }
        this.explorerService.upload(files);
        this.uploader.nativeElement.value = '';
    }

    download() {
        this.explorerService.download();
    }
}
