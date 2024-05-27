import { DockUtilizationDetailsModule } from './dock-utilization-details.module';

describe('DockUtilizationDetailsModule', () => {
  let dockUtilizationDetailsModule: DockUtilizationDetailsModule;

  beforeEach(() => {
    dockUtilizationDetailsModule = new DockUtilizationDetailsModule();
  });

  it('should create an instance', () => {
    expect(dockUtilizationDetailsModule).toBeTruthy();
  });
});
