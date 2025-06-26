import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoProductComponent } from './repo-product.component';

describe('RepoProductComponent', () => {
  let component: RepoProductComponent;
  let fixture: ComponentFixture<RepoProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
