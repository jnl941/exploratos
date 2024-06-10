import { InjectionToken, inject } from '@angular/core';
import { NgeExplorerConfig, View } from './types';
import { IconsComponent, ListComponent } from '../../public-api';

export const DEFAULT_CONFIG: Partial<NgeExplorerConfig> = {
    homeNodeName: 'Files',
    multipleSelection: true,
    features: {
        delete: true,
        upload: true,
        download: true,
        rename: true,
        createDir: true,
    },
};

export const VIEWS = new InjectionToken<View[]>('NXE_VIEWS', {
    providedIn: 'root',
    factory: () => [
        {
            name: 'Icons',
            icon: 'nxe-th-large',
            component: IconsComponent,
        },
        {
            name: 'List',
            icon: 'nxe-menu',
            component: ListComponent,
        },
    ],
});

export const CONFIG = new InjectionToken<NgeExplorerConfig>('NXE_CONFIG', {
    providedIn: 'root',
    factory: () => {
        const views = inject(VIEWS);
        const defaultView = views[0].name;
        return { ...DEFAULT_CONFIG, defaultView } as NgeExplorerConfig;
    },
});
