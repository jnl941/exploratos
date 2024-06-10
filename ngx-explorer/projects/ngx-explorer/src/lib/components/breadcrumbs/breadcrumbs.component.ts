import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { map } from 'rxjs';
import { INode } from '../../shared/types';
import { ExplorerService } from '../../services/explorer.service';
import { CONFIG } from '../../shared/providers';
import { AsyncPipe } from '@angular/common';

interface Breadcrumb {
    node: INode;
    name: string;
}

@Component({
    selector: 'nxe-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AsyncPipe],
})
export class BreadcrumbsComponent {
    private explorerService = inject(ExplorerService);
    private config = inject(CONFIG);

    public breadcrumbs$ = this.explorerService.openedDir$.pipe(
        map((n) => {
            if (!n) {
                return [];
            }
            const pieces = [] as Breadcrumb[];
            let currentNode = n;
            while (currentNode.parentId) {
                pieces.unshift({ name: currentNode.name || this.config.homeNodeName || '', node: currentNode });
                currentNode = this.explorerService.getNode(currentNode.parentId);
            }
            pieces.unshift({ name: currentNode.name || this.config.homeNodeName || '', node: currentNode });
            return pieces;
        })
    );

    public click(crumb: Breadcrumb) {
        this.explorerService.openNode(crumb.node.id);
    }
}
