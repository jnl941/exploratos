import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphViewDialogComponent } from './graph-view-dialog.component';

describe('GraphViewDialogComponent', () => {
  let component: GraphViewDialogComponent;
  let fixture: ComponentFixture<GraphViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphViewDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
