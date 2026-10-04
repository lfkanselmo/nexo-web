import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ContractDetailPage } from './contract-detail-page';

const BASE = `${environment.apiBaseUrl}/contracts`;

function sampleContract(status: string) {
  return {
    id: 'c1',
    propertyId: 'p1',
    tenantId: 't1',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    monthlyRent: 1200,
    dailyInterestRate: 0.01,
    interestType: 'FIXED',
    status,
  };
}

describe('ContractDetailPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractDetailPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'c1' }) } },
        },
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function createComponent(status: string): ComponentFixture<ContractDetailPage> {
    const fixture = TestBed.createComponent(ContractDetailPage);

    httpMock.expectOne(`${BASE}/c1/payments`).flush([]);
    httpMock.expectOne((req) => req.url === `${BASE}/c1/penalty`).flush({ contractId: 'c1', overdueDays: 0, principalOwed: 0, interestAmount: 0, total: 0 });
    httpMock.expectOne(`${BASE}/c1`).flush(sampleContract(status));
    httpMock.expectOne(`${environment.apiBaseUrl}/properties`).flush([{ id: 'p1', address: 'Calle 10', city: 'Bogotá' }]);
    httpMock.expectOne(`${environment.apiBaseUrl}/tenants`).flush([{ id: 't1', fullName: 'Ana Gómez', email: 'ana@example.com', documentId: 'CC1' }]);

    fixture.detectChanges();
    return fixture;
  }

  it('renders the property, tenant and status for an active contract', () => {
    const fixture = createComponent('ACTIVE');
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Calle 10');
    expect(compiled.textContent).toContain('Ana Gómez');
    expect(compiled.querySelector('nexo-status-badge')?.textContent).toContain('Activo');
  });

  it('only offers the transitions allowed from ACTIVE', () => {
    const fixture = createComponent('ACTIVE');
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonLabels = Array.from(compiled.querySelectorAll('.btn')).map((el) => el.textContent?.trim());

    expect(buttonLabels).not.toContain('Activar');
    expect(buttonLabels).toContain('Renovar');
    expect(buttonLabels).toContain('Terminar');
  });

  it('offers no transitions for a terminated contract', () => {
    const fixture = createComponent('TERMINATED');
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonLabels = Array.from(compiled.querySelectorAll('.btn')).map((el) => el.textContent?.trim());

    expect(buttonLabels).not.toContain('Activar');
    expect(buttonLabels).not.toContain('Renovar');
    expect(buttonLabels).not.toContain('Terminar');
  });

  it('terminates the contract and updates the badge', () => {
    const fixture = createComponent('ACTIVE');
    const compiled = fixture.nativeElement as HTMLElement;

    const terminateButton = Array.from(compiled.querySelectorAll('.btn')).find((el) => el.textContent?.trim() === 'Terminar');
    terminateButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    httpMock.expectOne(`${BASE}/c1/terminate`).flush(sampleContract('TERMINATED'));
    fixture.detectChanges();

    expect(compiled.querySelector('nexo-status-badge')?.textContent).toContain('Terminado');
  });

  it('schedules a payment and refreshes the penalty', () => {
    const fixture = createComponent('ACTIVE');
    const compiled = fixture.nativeElement as HTMLElement;

    const inputs = compiled.querySelectorAll('nexo-text-field input');
    (inputs[0] as HTMLInputElement).value = '2026-01-01';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    (inputs[1] as HTMLInputElement).value = '1200';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const scheduleButton = Array.from(compiled.querySelectorAll('.btn')).find((el) => el.textContent?.trim() === 'Agendar pago');
    scheduleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const request = httpMock.expectOne(`${BASE}/c1/payments`);
    expect(request.request.body).toEqual({ dueDate: '2026-01-01', amount: 1200 });
    request.flush({ id: 'pay1', contractId: 'c1', dueDate: '2026-01-01', paidDate: null, amount: 1200, status: 'PENDING' });

    httpMock.expectOne((req) => req.url === `${BASE}/c1/penalty`).flush({ contractId: 'c1', overdueDays: 0, principalOwed: 0, interestAmount: 0, total: 0 });
    fixture.detectChanges();

    expect(compiled.querySelector('nexo-payment-status-badge')?.textContent).toContain('Pendiente');
  });
});
