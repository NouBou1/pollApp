import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

async function setupTestBed() {
  await TestBed.configureTestingModule({
    imports: [App],
    providers: [provideRouter([])],
  }).compileComponents();
}

describe('App', () => {
  beforeEach(setupTestBed);

  it('should create the app', () => {
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });

  it('should render the header logo', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-header__logo-icon')).toBeTruthy();
  });
});
