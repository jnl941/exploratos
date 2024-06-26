import { Directive, EventEmitter, HostListener, Output, inject } from '@angular/core';
import { ExplorerService } from '../services/explorer.service';

@Directive({
    selector: '[nxeDragDrop]',
    standalone: true,
})
export class DragDropDirective {
    @Output() private dragDrop = new EventEmitter<any>();
    @Output() private dragEnter = new EventEmitter<any>();
    @Output() private dragging = new EventEmitter<boolean>();
    @Output() private dragLeave = new EventEmitter<any>();
    @Output() private dragOver = new EventEmitter<any>();
    private explorerService = inject(ExplorerService);
    @HostListener('dragenter', ['$event'])
    public onDragEnter(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.dragEnter.emit(event);
        this.dragging.emit(true);
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.dragLeave.emit(event);
        this.dragging.emit(false);
    }

    @HostListener('dragover', ['$event'])
    public onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.dragOver.emit(event);
        this.dragging.emit(true);
    }

    @HostListener('drop', ['$event'])
    public onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer!.files as FileList;
        if (files.length > 0) {
            this.explorerService.upload(files);
            this.dragDrop.emit(files);
        }
        this.dragging.emit(false);
    }
}
