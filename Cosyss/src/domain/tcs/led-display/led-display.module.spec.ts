import { LedDisplayModule } from './led-display.module';

describe('LedDisplayModule', () => {
  let ledDisplayModule: LedDisplayModule;

  beforeEach(() => {
    ledDisplayModule = new LedDisplayModule();
  });

  it('should create an instance', () => {
    expect(ledDisplayModule).toBeTruthy();
  });
});
