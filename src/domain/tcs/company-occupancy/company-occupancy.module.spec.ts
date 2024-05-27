import { CompanyOccupancyModule } from './company-occupancy.module';

describe('CompanyOccupancyModule', () => {
  let companyOccupancyModule: CompanyOccupancyModule;

  beforeEach(() => {
    companyOccupancyModule = new CompanyOccupancyModule();
  });

  it('should create an instance', () => {
    expect(companyOccupancyModule).toBeTruthy();
  });
});
