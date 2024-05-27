import { FlightDiscrepancyModule } from './flight-discrepancy.module';

describe('FlightDiscrepancyModule', () => {
  let flightDiscrepancyModule: FlightDiscrepancyModule;

  beforeEach(() => {
    flightDiscrepancyModule = new FlightDiscrepancyModule();
  });

  it('should create an instance', () => {
    expect(flightDiscrepancyModule).toBeTruthy();
  });
});
