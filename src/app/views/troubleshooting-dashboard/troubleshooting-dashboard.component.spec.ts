import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleshootingDashboardComponent } from './troubleshooting-dashboard.component';

describe('TroubleshootingDashboardComponent', () => {
  let component: TroubleshootingDashboardComponent;
  let fixture: ComponentFixture<TroubleshootingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TroubleshootingDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TroubleshootingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
