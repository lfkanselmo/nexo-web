import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { PropertiesPage } from './properties-page';

describe('PropertiesPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function createComponent(): ComponentFixture<PropertiesPage> {
    const fixture = TestBed.createComponent(PropertiesPage);
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/properties`).flush([]);
    fixture.detectChanges();
    return fixture;
  }

  function fillForm(fixture: ComponentFixture<PropertiesPage>, address: string, city: string): void {
    const inputs = fixture.nativeElement.querySelectorAll('nexo-text-field input');
    inputs[0].value = address;
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = city;
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  it('lists the properties loaded from the API', () => {
    const fixture = TestBed.createComponent(PropertiesPage);
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/properties`).flush([{ id: '1', address: 'Calle 10', city: 'Bogotá' }]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.property-row')?.textContent).toContain('Calle 10');
  });

  it('creates a property and appends it to the list', () => {
    const fixture = createComponent();
    fillForm(fixture, 'Carrera 7', 'Medellín');

    (fixture.nativeElement as HTMLElement).querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const request = httpMock.expectOne(`${environment.apiBaseUrl}/properties`);
    expect(request.request.method).toBe('POST');
    request.flush({ id: '2', address: 'Carrera 7', city: 'Medellín' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.property-row')?.textContent).toContain('Carrera 7');
  });

  it('shows an error message when creating a property fails', () => {
    const fixture = createComponent();
    fillForm(fixture, 'Carrera 7', 'Medellín');

    (fixture.nativeElement as HTMLElement).querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    httpMock.expectOne(`${environment.apiBaseUrl}/properties`).flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.field__error')?.textContent).toContain('No se pudo crear la propiedad.');
  });
});
