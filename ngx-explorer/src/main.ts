import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CONFIG, DataService, NgeExplorerConfig } from 'ngx-explorer';
import { ExampleDataService } from './app/data.service';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimations } from '@angular/platform-browser/animations'

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(MatButtonModule),
        importProvidersFrom(BrowserModule),
        provideAnimations(),
        { provide: DataService, useClass: ExampleDataService },
        {
            provide: CONFIG,
            useValue: {
                homeNodeName: 'Home',
                defaultView: 'Icons',
                multipleSelection: true,
                features: {
                    delete: false,
                    upload: false,
                    download: true,
                    rename: false,
                    createDir: false,
                },
            } as NgeExplorerConfig,
        },
    ],
});
