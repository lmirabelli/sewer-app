import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePosts } from './profile-posts';

describe('ProfilePosts', () => {
  let component: ProfilePosts;
  let fixture: ComponentFixture<ProfilePosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePosts],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePosts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
