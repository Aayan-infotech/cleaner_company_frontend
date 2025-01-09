import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobEstimationContractsComponent } from './job-estimation-contracts.component';

describe('JobEstimationContractsComponent', () => {
  let component: JobEstimationContractsComponent;
  let fixture: ComponentFixture<JobEstimationContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobEstimationContractsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobEstimationContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
