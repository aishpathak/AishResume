import { TruckDockTemplateModule } from './truck-dock-template.module';

describe('TruckDockTemplateModule', () => {
  let truckDockTemplateModule: TruckDockTemplateModule;

  beforeEach(() => {
    truckDockTemplateModule = new TruckDockTemplateModule();
  });

  it('should create an instance', () => {
    expect(truckDockTemplateModule).toBeTruthy();
  });
});
