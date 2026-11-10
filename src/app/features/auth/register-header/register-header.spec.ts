import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterHeader } from './register-header';

describe('RegisterHeader', () => {
  let component: RegisterHeader;
  let fixture: ComponentFixture<RegisterHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
