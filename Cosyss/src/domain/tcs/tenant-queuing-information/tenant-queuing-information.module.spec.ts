import { TenantQueuingInformationModule } from './tenant-queuing-information.module';

describe('TenantQueuingInformationModule', () => {
  let tenantQueuingInformationModule: TenantQueuingInformationModule;

  beforeEach(() => {
    tenantQueuingInformationModule = new TenantQueuingInformationModule();
  });

  it('should create an instance', () => {
    expect(tenantQueuingInformationModule).toBeTruthy();
  });
});
