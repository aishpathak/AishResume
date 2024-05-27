import { CaptureTimeStampModule } from './capture-time-stamp.module';

describe('CaptureTimeStampModule', () => {
  let captureTimeStampModule: CaptureTimeStampModule;

  beforeEach(() => {
    captureTimeStampModule = new CaptureTimeStampModule();
  });

  it('should create an instance', () => {
    expect(captureTimeStampModule).toBeTruthy();
  });
});
