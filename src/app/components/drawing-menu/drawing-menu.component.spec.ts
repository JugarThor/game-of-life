import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingMenuComponent } from './drawing-menu.component';

describe('DrawingMenuComponent', () => {
  let component: DrawingMenuComponent;
  let fixture: ComponentFixture<DrawingMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
