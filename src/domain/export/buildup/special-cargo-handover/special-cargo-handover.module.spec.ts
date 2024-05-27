import { SpecialCargoHandoverModule } from './special-cargo-handover.module';

describe('SpecialCargoHandoverModule', () => {
  let specialCargoHandoverModule: SpecialCargoHandoverModule;

  beforeEach(() => {
    specialCargoHandoverModule = new SpecialCargoHandoverModule();
  });

  it('should create an instance', () => {
    expect(specialCargoHandoverModule).toBeTruthy();
  });
});
