import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDataPage } from './select-data.page';

describe('SelectDataPage', () => {
  let component: SelectDataPage;
  let fixture: ComponentFixture<SelectDataPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
