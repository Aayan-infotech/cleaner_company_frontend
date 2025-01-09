import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSchedulingManagementComponent } from './job-scheduling-management.component';

describe('JobSchedulingManagementComponent', () => {
  let component: JobSchedulingManagementComponent;
  let fixture: ComponentFixture<JobSchedulingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSchedulingManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobSchedulingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
