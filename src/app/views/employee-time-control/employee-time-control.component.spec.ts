import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTimeControlComponent } from './employee-time-control.component';

describe('EmployeeTimeControlComponent', () => {
  let component: EmployeeTimeControlComponent;
  let fixture: ComponentFixture<EmployeeTimeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTimeControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeTimeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
