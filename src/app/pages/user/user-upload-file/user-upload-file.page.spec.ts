import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUploadFilePage } from './user-upload-file.page';

describe('UserUploadFilePage', () => {
  let component: UserUploadFilePage;
  let fixture: ComponentFixture<UserUploadFilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUploadFilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUploadFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
