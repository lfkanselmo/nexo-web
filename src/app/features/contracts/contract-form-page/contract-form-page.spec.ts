import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ContractFormPage } from './contract-form-page';

describe('ContractFormPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractFormPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function createComponent(): ComponentFixture<ContractFormPage> {
    const fixture = TestBed.createComponent(ContractFormPage);
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/properties`).flush([{ id: 'p1', address: 'Calle 10', city: 'Bogotá' }]);
    httpMock.expectOne(`${environment.apiBaseUrl}/tenants`).flush([{ id: 't1', fullName: 'Ana Gómez', email: 'ana@example.com', documentId: 'CC1' }]);
    fixture.detectChanges();
    return fixture;
  }

  function selectOption(fixture: ComponentFixture<ContractFormPage>, selectFieldIndex: number, optionText: string): void {
    const compiled = fixture.nativeElement as HTMLElement;
    const selectFields = compiled.querySelectorAll('nexo-select-field');
    const trigger = selectFields[selectFieldIndex].querySelector('.listbox__trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    const options = Array.from(selectFields[selectFieldIndex].querySelectorAll<HTMLElement>('.listbox__option'));
    const option = options.find((el) => el.textContent?.includes(optionText));
    option?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
  }

  it('loads the property and tenant options from the API', () => {
    const fixture = createComponent();
    const compiled = fixture.nativeElement as HTMLElement;
    const selectFields = compiled.querySelectorAll('nexo-select-field');

    expect(selectFields[0].querySelector('.listbox__trigger')?.textContent).toContain('Seleccionar');
    (selectFields[0].querySelector('.listbox__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Calle 10, Bogotá');
  });

  it('creates a contract and navigates to its detail page', () => {
    const fixture = createComponent();
    const router = TestBed.inject(Router);
    const navigateCalls: unknown[][] = [];
    router.navigate = ((...args: unknown[]) => {
      navigateCalls.push(args);
      return Promise.resolve(true);
    }) as typeof router.navigate;

    selectOption(fixture, 0, 'Calle 10');
    selectOption(fixture, 1, 'Ana Gómez');
    selectOption(fixture, 2, 'Fijo');

    const inputs = fixture.nativeElement.querySelectorAll('nexo-text-field input');
    inputs[0].value = '2026-01-01';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = '2026-12-31';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[2].value = '1200';
    inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[3].value = '0.01';
    inputs[3].dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector('button.btn--primary')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const request = httpMock.expectOne(`${environment.apiBaseUrl}/contracts`);
    expect(request.request.body).toEqual({
      propertyId: 'p1',
      tenantId: 't1',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      monthlyRent: 1200,
      dailyInterestRate: 0.01,
      interestType: 'FIXED',
    });
    request.flush({ id: 'c1', ...request.request.body, status: 'DRAFT' });

    expect(navigateCalls).toEqual([[['/contracts', 'c1']]]);
  });
});
