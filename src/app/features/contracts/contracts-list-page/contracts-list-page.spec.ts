import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ContractsListPage } from './contracts-list-page';

const SAMPLE_CONTRACT = {
  id: '1',
  propertyId: 'p1',
  tenantId: 't1',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  monthlyRent: 1200,
  dailyInterestRate: 0.01,
  interestType: 'FIXED',
  status: 'ACTIVE',
};

describe('ContractsListPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractsListPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads all contracts without a status filter on init', () => {
    const fixture = TestBed.createComponent(ContractsListPage);
    fixture.detectChanges();

    const request = httpMock.expectOne((req) => req.url === `${environment.apiBaseUrl}/contracts`);
    expect(request.request.params.has('status')).toBe(false);
    request.flush([SAMPLE_CONTRACT]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.contract-row')?.textContent).toContain('2026-01-01');
  });

  it('reloads with a status param when the filter changes', () => {
    const fixture = TestBed.createComponent(ContractsListPage);
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/contracts`).flush([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.listbox__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();
    const activeOption = Array.from(compiled.querySelectorAll('.listbox__option')).find((el) => el.textContent?.includes('Activo'));
    (activeOption as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const request = httpMock.expectOne((req) => req.url === `${environment.apiBaseUrl}/contracts`);
    expect(request.request.params.get('status')).toBe('ACTIVE');
    request.flush([]);
  });
});
