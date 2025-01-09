import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentVersionComponent } from './content-version.component';

describe('ContentVersionComponent', () => {
  let component: ContentVersionComponent;
  let fixture: ComponentFixture<ContentVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentVersionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContentVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
