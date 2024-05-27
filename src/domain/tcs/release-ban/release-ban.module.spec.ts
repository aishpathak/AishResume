import { ReleaseBanModule } from './release-ban.module';

describe('ReleaseBanModule', () => {
  let releaseBanModule: ReleaseBanModule;

  beforeEach(() => {
    releaseBanModule = new ReleaseBanModule();
  });

  it('should create an instance', () => {
    expect(releaseBanModule).toBeTruthy();
  });
});
