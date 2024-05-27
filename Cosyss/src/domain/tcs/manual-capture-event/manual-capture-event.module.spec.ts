import { ManualCaptureEventModule } from './manual-capture-event.module';

describe('ManualCaptureEventModule', () => {
  let manualCaptureEventModule: ManualCaptureEventModule;

  beforeEach(() => {
    manualCaptureEventModule = new ManualCaptureEventModule();
  });

  it('should create an instance', () => {
    expect(manualCaptureEventModule).toBeTruthy();
  });
});
