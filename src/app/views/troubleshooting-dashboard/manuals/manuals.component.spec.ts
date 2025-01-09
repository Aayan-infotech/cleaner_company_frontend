import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualsComponent } from './manuals.component';

describe('ManualsComponent', () => {
  let component: ManualsComponent;
  let fixture: ComponentFixture<ManualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
