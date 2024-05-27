import { TruckInformationModule } from './truck-information.module';

describe('TruckInformationModule', () => {
  let truckInformationModule: TruckInformationModule;

  beforeEach(() => {
    truckInformationModule = new TruckInformationModule();
  });

  it('should create an instance', () => {
    expect(truckInformationModule).toBeTruthy();
  });
});
