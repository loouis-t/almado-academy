import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreLancementComponent } from './pre-lancement.component';

describe('PreLancementComponent', () => {
  let component: PreLancementComponent;
  let fixture: ComponentFixture<PreLancementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreLancementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreLancementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
