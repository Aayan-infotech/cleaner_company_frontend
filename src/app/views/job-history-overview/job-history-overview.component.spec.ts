import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobHistoryOverviewComponent } from './job-history-overview.component';

describe('JobHistoryOverviewComponent', () => {
  let component: JobHistoryOverviewComponent;
  let fixture: ComponentFixture<JobHistoryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobHistoryOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobHistoryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
