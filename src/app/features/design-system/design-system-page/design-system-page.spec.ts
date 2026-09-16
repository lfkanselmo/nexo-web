import { TestBed } from '@angular/core/testing';
import { DesignSystemPage } from './design-system-page';

describe('DesignSystemPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignSystemPage],
    }).compileComponents();
  });

  it('renders the Nexo heading', () => {
    const fixture = TestBed.createComponent(DesignSystemPage);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Nexo');
  });
});
