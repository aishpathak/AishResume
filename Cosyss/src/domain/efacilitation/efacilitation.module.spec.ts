import { EfacilitationModule } from './efacilitation.module';

describe('EfacilitationModule', () => {
  let efacilitationModule: EfacilitationModule;

  beforeEach(() => {
    efacilitationModule = new EfacilitationModule();
  });

  it('should create an instance', () => {
    expect(efacilitationModule).toBeTruthy();
  });
});
