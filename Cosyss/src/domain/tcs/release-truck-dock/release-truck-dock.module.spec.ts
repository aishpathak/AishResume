import { ReleaseTruckDockModule } from './release-truck-dock.module';

describe('ReleaseTruckDockModule', () => {
  let releaseTruckDockModule: ReleaseTruckDockModule;

  beforeEach(() => {
    releaseTruckDockModule = new ReleaseTruckDockModule();
  });

  it('should create an instance', () => {
    expect(releaseTruckDockModule).toBeTruthy();
  });
});
