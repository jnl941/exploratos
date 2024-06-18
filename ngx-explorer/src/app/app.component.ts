import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ContentComponent, ExplorerComponent, ExplorerService, TreeComponent } from 'ngx-explorer';
import { map } from 'rxjs';
import {} from '@angular/common/http';
import { FileFetcherService } from './file-fetcher.service';
import { FileDisplayComponent } from './file-display/file-display.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [ExplorerComponent, ContentComponent, TreeComponent, AsyncPipe, 
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule, FileDisplayComponent, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatFormField],
    providers: [FileFetcherService]
})
export class AppComponent implements OnInit{
    protected openedDir$ = this.explorerService.openedDir$.pipe(map((p) => p?.data['name']));
    protected selectionLength$ = this.explorerService.selection$.pipe(map((s) => s.length));
    protected rootLen$ = this.explorerService.root$.pipe(map((r) => r.children.length));

    title = 'explorer-app';

    constructor(private explorerService: ExplorerService, private fileFetcherService: FileFetcherService, private dialog: MatDialog) {
        
    }
    ngOnInit(){
        this.openLoginDialog()
    }
    openLoginDialog(): void {
        const dialogRef = this.dialog.open(LoginDialogComponent, {
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'success') {
                this.onLoginSuccessful();
            }
        });
    }

    
    onLoginSuccessful(): void {
        this.explorerService.openNode();
        this.fileFetcherService.getFilesAndDirectories().subscribe(data => this.explorerService.refresh())
    }

}
