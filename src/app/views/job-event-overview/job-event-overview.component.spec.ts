import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobEventOverviewComponent } from './job-event-overview.component';

describe('JobEventOverviewComponent', () => {
  let component: JobEventOverviewComponent;
  let fixture: ComponentFixture<JobEventOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobEventOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobEventOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
