import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCartsComponent } from './table-carts.component';

describe('TableCartsComponent', () => {
  let component: TableCartsComponent;
  let fixture: ComponentFixture<TableCartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
