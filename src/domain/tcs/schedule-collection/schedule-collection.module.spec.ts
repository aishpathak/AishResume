import { ScheduleCollectionModule } from './schedule-collection.module';

describe('ScheduleCollectionModule', () => {
  let scheduleCollectionModule: ScheduleCollectionModule;

  beforeEach(() => {
    scheduleCollectionModule = new ScheduleCollectionModule();
  });

  it('should create an instance', () => {
    expect(scheduleCollectionModule).toBeTruthy();
  });
});
