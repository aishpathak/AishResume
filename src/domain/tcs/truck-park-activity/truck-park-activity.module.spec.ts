import { TruckParkActivityModule } from './truck-park-activity.module';

describe('TruckActivityModule', () => {
    let truckParkActivityModule: TruckParkActivityModule;

    beforeEach(() => {
        truckParkActivityModule = new TruckParkActivityModule();
    });

    it('should create an instance', () => {
        expect(TruckParkActivityModule).toBeTruthy();
    });
});
