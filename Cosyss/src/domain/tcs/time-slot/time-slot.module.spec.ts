import { TimeSlotModule } from './time-slot.module';

describe('TimeSlotModule', () => {
  let timeSlotModule: TimeSlotModule;

  beforeEach(() => {
    timeSlotModule = new TimeSlotModule();
  });

  it('should create an instance', () => {
    expect(timeSlotModule).toBeTruthy();
  });
});
