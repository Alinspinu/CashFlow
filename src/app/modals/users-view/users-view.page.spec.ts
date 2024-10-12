import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersViewPage } from './users-view.page';

describe('UsersViewPage', () => {
  let component: UsersViewPage;
  let fixture: ComponentFixture<UsersViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UsersViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
