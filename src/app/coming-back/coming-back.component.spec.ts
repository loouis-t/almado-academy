import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingBackComponent } from './coming-back.component';

describe('ComingBackComponent', () => {
  let component: ComingBackComponent;
  let fixture: ComponentFixture<ComingBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComingBackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComingBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
