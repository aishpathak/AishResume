import { TruckDockMaintenanceModule } from './truck-dock-maintenance.module';

describe('TruckDockMaintenanceModule', () => {
  let truckDockMaintenanceModule: TruckDockMaintenanceModule;

  beforeEach(() => {
    truckDockMaintenanceModule = new TruckDockMaintenanceModule();
  });

  it('should create an instance', () => {
    expect(truckDockMaintenanceModule).toBeTruthy();
  });
});
