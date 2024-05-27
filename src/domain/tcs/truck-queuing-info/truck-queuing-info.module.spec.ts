import { TruckQueuingInfoModule } from './truck-queuing-info.module';

describe('TruckQueuingInfoModule', () => {
  let truckQueuingInfoModule: TruckQueuingInfoModule;

  beforeEach(() => {
    truckQueuingInfoModule = new TruckQueuingInfoModule();
  });

  it('should create an instance', () => {
    expect(truckQueuingInfoModule).toBeTruthy();
  });
});
