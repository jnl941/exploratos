import { Component, ViewEncapsulation, inject } from '@angular/core';
import { VIEWS } from '../../shared/providers';
import { ExplorerService } from '../../services/explorer.service';

@Component({
    selector: 'nxe-view-switcher',
    templateUrl: './view-switcher.component.html',
    styleUrls: ['./view-switcher.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
})
export class ViewSwitcherComponent {
    private explorerService = inject(ExplorerService);
    protected views = inject(VIEWS);

    private setView(view: string) {
        this.explorerService.currentView$.next(view);
    }
}
