import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanTechComponent } from './clean-tech.component';

describe('CleanTechComponent', () => {
  let component: CleanTechComponent;
  let fixture: ComponentFixture<CleanTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleanTechComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleanTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
