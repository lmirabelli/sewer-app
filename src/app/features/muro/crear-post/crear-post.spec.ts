import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearPost } from './crear-post';

describe('CrearPost', () => {
  let component: CrearPost;
  let fixture: ComponentFixture<CrearPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPost],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
