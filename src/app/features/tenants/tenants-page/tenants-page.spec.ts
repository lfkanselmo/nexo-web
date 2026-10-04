import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { TenantsPage } from './tenants-page';

describe('TenantsPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function createComponent(): ComponentFixture<TenantsPage> {
    const fixture = TestBed.createComponent(TenantsPage);
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/tenants`).flush([]);
    fixture.detectChanges();
    return fixture;
  }

  function fillForm(fixture: ComponentFixture<TenantsPage>, fullName: string, email: string, documentId: string): void {
    const inputs = fixture.nativeElement.querySelectorAll('nexo-text-field input');
    inputs[0].value = fullName;
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = email;
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[2].value = documentId;
    inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  it('lists the tenants loaded from the API', () => {
    const fixture = TestBed.createComponent(TenantsPage);
    fixture.detectChanges();
    httpMock
      .expectOne(`${environment.apiBaseUrl}/tenants`)
      .flush([{ id: '1', fullName: 'Ana Gómez', email: 'ana@example.com', documentId: 'CC123456' }]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.tenant-row')?.textContent).toContain('Ana Gómez');
  });

  it('creates a tenant and appends it to the list', () => {
    const fixture = createComponent();
    fillForm(fixture, 'Carlos Ruiz', 'carlos@example.com', 'CC987654');

    (fixture.nativeElement as HTMLElement).querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const request = httpMock.expectOne(`${environment.apiBaseUrl}/tenants`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ fullName: 'Carlos Ruiz', email: 'carlos@example.com', documentId: 'CC987654' });
    request.flush({ id: '2', fullName: 'Carlos Ruiz', email: 'carlos@example.com', documentId: 'CC987654' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.tenant-row')?.textContent).toContain('Carlos Ruiz');
  });

  it('shows an error message when creating a tenant fails', () => {
    const fixture = createComponent();
    fillForm(fixture, 'Carlos Ruiz', 'carlos@example.com', 'CC987654');

    (fixture.nativeElement as HTMLElement).querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    httpMock.expectOne(`${environment.apiBaseUrl}/tenants`).flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.field__error')?.textContent).toContain('No se pudo crear el inquilino.');
  });
});
