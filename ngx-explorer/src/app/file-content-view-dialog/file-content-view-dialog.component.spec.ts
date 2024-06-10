import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileContentViewDialogComponent } from './file-content-view-dialog.component';

describe('FileContentViewDialogComponent', () => {
  let component: FileContentViewDialogComponent;
  let fixture: ComponentFixture<FileContentViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileContentViewDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileContentViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
