import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPengaduanSayaPage } from './user-pengaduan-saya.page';

describe('UserPengaduanSayaPage', () => {
  let component: UserPengaduanSayaPage;
  let fixture: ComponentFixture<UserPengaduanSayaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPengaduanSayaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPengaduanSayaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
