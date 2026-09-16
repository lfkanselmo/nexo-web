import { TestBed } from '@angular/core/testing';
import { SelectField } from './select-field';

describe('SelectField', () => {
  const options = [
    { value: 'apartment', label: 'Apartamento' },
    { value: 'house', label: 'Casa' },
  ];

  function createComponent() {
    const fixture = TestBed.createComponent(SelectField);
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectField],
    }).compileComponents();
  });

  it('starts closed with the placeholder visible', () => {
    const fixture = createComponent();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.listbox__panel')).toBeNull();
    expect(compiled.querySelector('.listbox__trigger')?.textContent).toContain('Seleccionar...');
  });

  it('opens the panel and selects an option on click', () => {
    const fixture = createComponent();
    const compiled = fixture.nativeElement as HTMLElement;

    (compiled.querySelector('.listbox__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();
    const optionElements = compiled.querySelectorAll('.listbox__option');
    expect(optionElements.length).toBe(2);

    (optionElements[1] as HTMLLIElement).click();
    fixture.detectChanges();

    expect(compiled.querySelector('.listbox__trigger')?.textContent).toContain('Casa');
    expect(compiled.querySelector('.listbox__panel')).toBeNull();
  });

  it('closes when clicking outside the component', () => {
    const fixture = createComponent();
    const compiled = fixture.nativeElement as HTMLElement;

    (compiled.querySelector('.listbox__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelector('.listbox__panel')).not.toBeNull();

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(compiled.querySelector('.listbox__panel')).toBeNull();
  });
});
