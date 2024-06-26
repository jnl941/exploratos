import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CONFIG, DataService, NgeExplorerConfig } from 'ngx-explorer';
import { MyDataService } from './app/data.service';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(MatButtonModule),
        importProvidersFrom(BrowserModule),
        provideAnimations(),
        { provide: DataService, useClass: MyDataService },
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
        }, provideCharts(withDefaultRegisterables()),
    ],
});
