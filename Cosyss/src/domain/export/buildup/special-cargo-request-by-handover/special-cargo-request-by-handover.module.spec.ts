import { SpecialCargoRequestByHandoverModule } from './special-cargo-request-by-handover.module';

describe('SpecialCargoRequestByHandoverModule', () => {
  let specialCargoRequestByHandoverModule: SpecialCargoRequestByHandoverModule;

  beforeEach(() => {
    specialCargoRequestByHandoverModule = new SpecialCargoRequestByHandoverModule();
  });

  it('should create an instance', () => {
    expect(specialCargoRequestByHandoverModule).toBeTruthy();
  });
});
