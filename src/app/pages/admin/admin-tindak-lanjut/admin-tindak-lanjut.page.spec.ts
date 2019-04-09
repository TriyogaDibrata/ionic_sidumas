import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTindakLanjutPage } from './admin-tindak-lanjut.page';

describe('AdminTindakLanjutPage', () => {
  let component: AdminTindakLanjutPage;
  let fixture: ComponentFixture<AdminTindakLanjutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTindakLanjutPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTindakLanjutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
