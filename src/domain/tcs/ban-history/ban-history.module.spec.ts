import { BanHistoryModule } from './ban-history.module';

describe('BanHistoryModule', () => {
  let banHistoryModule: BanHistoryModule;

  beforeEach(() => {
    banHistoryModule = new BanHistoryModule();
  });

  it('should create an instance', () => {
    expect(banHistoryModule).toBeTruthy();
  });
});
