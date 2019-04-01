import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectPengaduanPage } from './admin-project-pengaduan.page';

describe('AdminProjectPengaduanPage', () => {
  let component: AdminProjectPengaduanPage;
  let fixture: ComponentFixture<AdminProjectPengaduanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProjectPengaduanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProjectPengaduanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
