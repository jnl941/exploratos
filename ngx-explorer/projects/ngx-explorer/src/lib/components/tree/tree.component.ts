import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { ExplorerService } from '../../services/explorer.service';
import { map } from 'rxjs/operators';
import { INode } from '../../shared/types';
import { AsyncPipe, JsonPipe, NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'nxe-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgTemplateOutlet, NgClass, AsyncPipe, JsonPipe],
})
export class TreeComponent {
    private explorerService = inject(ExplorerService);
    protected treeNodes: INode[] = [];
    protected tree$ = this.explorerService.root$.pipe(map((r) => r.children));
    protected selectedId$ = this.explorerService.openedDir$.pipe(map((p) => p?.id));

    open(node: INode) {
        this.explorerService.openNode(node.id);
    }

    expand(event: Event, node: INode) {
        event.preventDefault();
        event.stopPropagation();
        this.explorerService.expand(node.id);
    }

    collapse(event: Event, node: INode) {
        event.preventDefault();
        event.stopPropagation();
        this.explorerService.collapse(node.id);
    }
}
