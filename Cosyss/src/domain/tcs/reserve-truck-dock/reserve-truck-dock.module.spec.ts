import { ReserveTruckDockModule } from './reserve-truck-dock.module';

describe('ReleaseTruckDockModule', () => {
    let reserveTruckDockModule: ReserveTruckDockModule;

    beforeEach(() => {
        reserveTruckDockModule = new ReserveTruckDockModule();
    });

    it('should create an instance', () => {
        expect(ReserveTruckDockModule).toBeTruthy();
    });
});
