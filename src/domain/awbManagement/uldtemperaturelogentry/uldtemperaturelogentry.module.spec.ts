import { UldtemperaturelogentryModule } from './uldtemperaturelogentry.module';

describe('UldtemperaturelogentryModule', () => {
  let uldtemperaturelogentryModule: UldtemperaturelogentryModule;

  beforeEach(() => {
    uldtemperaturelogentryModule = new UldtemperaturelogentryModule();
  });

  it('should create an instance', () => {
    expect(uldtemperaturelogentryModule).toBeTruthy();
  });
});
