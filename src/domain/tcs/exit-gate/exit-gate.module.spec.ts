import { ExitGateModule } from './exit-gate.module';

describe('ExitGateModule', () => {
  let exitGateModule: ExitGateModule;

  beforeEach(() => {
    exitGateModule = new ExitGateModule();
  });

  it('should create an instance', () => {
    expect(exitGateModule).toBeTruthy();
  });
});
