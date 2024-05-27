import { TruckDockMonitoringModule } from './truck-dock-monitoring.module';

describe('TruckDockMonitoringModule', () => {
  let truckDockMonitoringModule: TruckDockMonitoringModule;

  beforeEach(() => {
    truckDockMonitoringModule = new TruckDockMonitoringModule();
  });

  it('should create an instance', () => {
    expect(truckDockMonitoringModule).toBeTruthy();
  });
});
