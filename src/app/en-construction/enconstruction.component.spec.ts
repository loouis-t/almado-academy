import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnconstructionComponent } from './enconstruction.component';

describe('EnconstructionComponent', () => {
  let component: EnconstructionComponent;
  let fixture: ComponentFixture<EnconstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnconstructionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnconstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
