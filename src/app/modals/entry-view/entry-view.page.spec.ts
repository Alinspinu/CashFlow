import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryViewPage } from './entry-view.page';

describe('EntryViewPage', () => {
  let component: EntryViewPage;
  let fixture: ComponentFixture<EntryViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EntryViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
