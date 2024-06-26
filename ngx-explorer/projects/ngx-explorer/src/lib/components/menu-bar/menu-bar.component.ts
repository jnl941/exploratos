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
    @ViewChild('uploader', { static: true }) private uploader!: ElementRef;
    protected canDelete$ = this.explorerService.selection$.pipe(map((n) => n.length > 0));
    protected canDownload$ = this.explorerService.selection$.pipe(map((n) => n.length === 1 && n[0].isLeaf));
    protected canRename$ = this.explorerService.selection$.pipe(map((n) => n.length === 1));
    protected config: NgeExplorerConfig = inject(CONFIG);
    protected explorerService: ExplorerService = inject(ExplorerService);
    protected featCreateDir = this.config.features?.createDir;
    protected featDelete = this.config.features?.delete;
    protected featDownload = this.config.features?.download;
    protected featRename = this.config.features?.rename;
    protected featUpload = this.config.features?.upload;
    private createDir() {
        const name = prompt('Enter new name');
        if (name) {
            this.explorerService.createDir(name);
        }
    }

    private download() {
        this.explorerService.download();
    }

    private handleFiles(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
            return;
        }
        this.explorerService.upload(files);
        this.uploader.nativeElement.value = '';
    }

    private openUploader() {
        this.uploader.nativeElement.click();
    }

    private refresh() {
        this.explorerService.refresh();
    }

    private remove() {
        if (confirm('Are you sure you want to delete the selected files?')) {
            this.explorerService.remove();
        }
    }

    private rename() {
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
}
