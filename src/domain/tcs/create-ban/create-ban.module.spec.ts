import { CreateBanModule } from './create-ban.module';

describe('CreateBanModule', () => {
  let createBanModule: CreateBanModule;

  beforeEach(() => {
    createBanModule = new CreateBanModule();
  });

  it('should create an instance', () => {
    expect(createBanModule).toBeTruthy();
  });
});
