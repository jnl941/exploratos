import { Component, ViewEncapsulation } from '@angular/core';
import { BaseView } from '../base-view/base-view.directive';
import { DragDropDirective } from '../../directives/drag-drop.directive';
import { NgClass } from '@angular/common';

@Component({
    selector: 'nxe-icons',
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [DragDropDirective, NgClass],
})
export class IconsComponent extends BaseView {
    public readonly icons = {
        node: 'nxe-folder',
        leaf: 'nxe-doc',
    };

    constructor() {
        super();
    }
}
