import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalsPage } from './modals.page';

describe('ModalsPage', () => {
  let component: ModalsPage;
  let fixture: ComponentFixture<ModalsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
