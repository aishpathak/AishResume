import { AssignTruckDockModule } from './assign-truck-dock.module';

describe('AssignTruckDockModule', () => {
  let assignTruckDockModule: AssignTruckDockModule;

  beforeEach(() => {
    assignTruckDockModule = new AssignTruckDockModule();
  });

  it('should create an instance', () => {
    expect(assignTruckDockModule).toBeTruthy();
  });
});
