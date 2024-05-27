import { AdhocDockUpdateModule } from './adhoc-dock-update.module';

describe('AdhocDockUpdateModule', () => {
  let adhocDockUpdateModule: AdhocDockUpdateModule;

  beforeEach(() => {
    adhocDockUpdateModule = new AdhocDockUpdateModule();
  });

  it('should create an instance', () => {
    expect(adhocDockUpdateModule).toBeTruthy();
  });
});
