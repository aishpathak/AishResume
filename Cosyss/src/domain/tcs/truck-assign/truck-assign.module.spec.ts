import { TruckAssignModule } from './truck-assign.module';

describe('TruckAssignModule', () => {
  let truckAssignModule: TruckAssignModule;

  beforeEach(() => {
    truckAssignModule = new TruckAssignModule();
  });

  it('should create an instance', () => {
    expect(truckAssignModule).toBeTruthy();
  });
});
