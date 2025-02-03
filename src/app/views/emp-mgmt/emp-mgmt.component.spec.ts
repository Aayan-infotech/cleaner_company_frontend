import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpMgmtComponent } from './emp-mgmt.component';

describe('EmpMgmtComponent', () => {
  let component: EmpMgmtComponent;
  let fixture: ComponentFixture<EmpMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpMgmtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
