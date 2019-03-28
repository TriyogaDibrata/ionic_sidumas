import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddPengaduanPage } from './user-add-pengaduan.page';

describe('UserAddPengaduanPage', () => {
  let component: UserAddPengaduanPage;
  let fixture: ComponentFixture<UserAddPengaduanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAddPengaduanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddPengaduanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
