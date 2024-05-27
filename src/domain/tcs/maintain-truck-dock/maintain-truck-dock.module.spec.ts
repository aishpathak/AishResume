import { MaintainTruckDockModule } from './maintain-truck-dock.module';

describe('MaintainTruckDockModule', () => {
  let maintainTruckDockModule: MaintainTruckDockModule;

  beforeEach(() => {
    maintainTruckDockModule = new MaintainTruckDockModule();
  });

  it('should create an instance', () => {
    expect(maintainTruckDockModule).toBeTruthy();
  });
});
