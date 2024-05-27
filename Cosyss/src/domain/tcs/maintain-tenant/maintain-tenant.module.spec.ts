import { MaintainTenantModule } from './maintain-tenant.module';

describe('MaintainTenantModule', () => {
  let maintainTenantModule: MaintainTenantModule;

  beforeEach(() => {
    maintainTenantModule = new MaintainTenantModule();
  });

  it('should create an instance', () => {
    expect(maintainTenantModule).toBeTruthy();
  });
});
