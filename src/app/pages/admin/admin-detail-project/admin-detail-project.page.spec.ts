import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetailProjectPage } from './admin-detail-project.page';

describe('AdminDetailProjectPage', () => {
  let component: AdminDetailProjectPage;
  let fixture: ComponentFixture<AdminDetailProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDetailProjectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDetailProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
