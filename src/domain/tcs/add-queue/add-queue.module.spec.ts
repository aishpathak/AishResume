import { AddQueueModule } from './add-queue.module';

describe('AddQueueModule', () => {
  let addQueueModule: AddQueueModule;

  beforeEach(() => {
    addQueueModule = new AddQueueModule();
  });

  it('should create an instance', () => {
    expect(addQueueModule).toBeTruthy();
  });
});
