import { TruckActivityModule } from './truck-activity.module';

describe('TruckActivityModule', () => {
  let truckActivityModule: TruckActivityModule;

  beforeEach(() => {
    truckActivityModule = new TruckActivityModule();
  });

  it('should create an instance', () => {
    expect(TruckActivityModule).toBeTruthy();
  });
});
