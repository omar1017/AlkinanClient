import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoMainComponent } from './repo-main.component';

describe('RepoMainComponent', () => {
  let component: RepoMainComponent;
  let fixture: ComponentFixture<RepoMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
